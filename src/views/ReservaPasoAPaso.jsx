import React, { useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

//ICONOS
import { FaEye, FaEyeSlash } from "react-icons/fa";
//SERVICIOS
import { loggearse } from "../service/loginService";
import { getHorario } from "../service/disponibilidad";
import { getMesasDisponibles } from "../service/mesasService";
import { getRestauranteId } from "../service/restaurante";
import { crearReserva } from "../service/reservasService";
import { formatearFecha, formatearHora } from "../service/formatearFechaHora";
import { getHistorialReservas } from "../service/reservasService";
import { putReserva } from "../service/reservasService";
import { useWebSocketReserva } from "../hooks/useWebSocketReserva";

//COMPONENTES
import SelectHoras from "../components/SelectHoras";

export default function ReservaPasoAPaso() {

  /****************** NAVEGACIÓN ************************/
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const handleNext = () => {
    setStep((prev) => prev + 1);

    if (step === 2) {
      if (fechaReserva === "") {
        alert("Seleccione una fecha para continuar");
        setStep(2);
      } else if (horaSeleccionada === "") {
        alert("Seleccione una hora para continuar");
        setStep(2);
      } else if (mesaSeleccionada === null) {
        alert("Seleccione una mesa para poder continuar");
        setStep(2);
      } else {
        // todos los datos completos → continuar al siguiente paso
        setStep(3);
      }
    }
  }

  const handlePrev = () => setStep((prev) => prev - 1);

  /****************** FIN NAVEGACIÓN ************************/

  /****************** DATOS RESTAURANTE ***************************/

  const [datosRestaurante, setDatosRestaurante] = useState([]);

  useEffect(() => {
    getRestauranteId(1).then(setDatosRestaurante);
  }, [])

  /****************** FIN DATOS RESTAURANTE ***************************/

  /**************** LOGIN *************************/
  const [vistaEditar, setVistaEditar] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [idUsuario, setIdUsuario] = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);
  const [historialReservasCliente, setHistorialReservasCliente] = useState([]);
  const [idReserva, setIdReserva] = useState("");
  const [mesaGuardadaParaEditar, setMesaGuardadaParaEditar] = useState("");

  const [fechaReserva, setFechaReserva] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [diaActual, setDiaActual] = useState([]);
  const [hora, setHora] = useState("");
  const [minutos, setMinutos] = useState("");
  const [diaSemana, setDiaSemana] = useState("");
  const [mesasDisponibles, setMesasDisponibles] = useState([]);
  const [cantidadPersonasReserva, setCantidadPersonasReserva] = useState("1");
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

  async function obtenerToken(e) {
    e.preventDefault(e)
    try {

      const data = await loggearse({ usuario: email, contrasenia: pass });
      const decoded = jwtDecode(data.token);
      if (decoded.rol == "ROLE_Superadmin") {
        navigate("/administracion-superadmin");
      } else if (decoded.rol == "ROLE_Admin") {
        navigate("/administracion-admin");
      } else if (decoded.rol == "ROLE_Mesero") {
        navigate("/administracion-mesero");
      } else if (decoded.rol == "ROLE_Cliente") {
        handleNext(e);
        setIdUsuario(decoded.usuarioId);
      }

    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert("❌ Credenciales incorrectas");
      } else {
        console.error("Error inesperado", err);
      }
    }
  }

  /**************** FIN LOGIN *************************/


  function cargarHistorial() {
    if (idUsuario !== "") {
      getHistorialReservas(idUsuario).then(setHistorialReservasCliente);
    }
  }

  useEffect(() => {
    cargarHistorial();
  }, [idUsuario]);

  useWebSocketReserva((reserva) => {
    if (reserva.usuario && reserva.usuario.id === idUsuario) {
      if (reserva.tipoNotificacion === "ELIMINACION") {
        setHistorialReservasCliente((prev) => prev.filter((r) => r.id !== reserva.id));
        return;
      }
      setHistorialReservasCliente((prev) => {
        const existe = prev.some((r) => r.id === reserva.id);
        if (existe) {
          return prev.map((r) => (r.id === reserva.id ? reserva : r));
        } else {
          return [...prev, reserva];
        }
      });

      if (reserva.tipoNotificacion === "CONFIRMACION") {
        alert(`¡Su reserva para el ${formatearFecha(reserva.fecha.split("T")[0])} a las ${formatearHora(reserva.fecha.split("T")[1])} ha sido confirmada!`);
      }
    }
  });

  function editarReserva(reserva) {
    setVistaEditar(true);
    const [fecha, hora] = reserva.fecha.split("T");
    setFechaReserva(fecha);
    const [horas, minutos, segundos] = hora.split(":");
    setHoraSeleccionada(horas + ":" + minutos);
    setMesaGuardadaParaEditar(reserva.mesa.id);
    setIdReserva(reserva.id);
    setCantidadPersonasReserva(reserva.cantidadPersonas);
  }

  function actualizarReserva() {
    const confirmar = window.confirm("¿Está seguro de modificar su reserva? Tenga en cuenta que si lo hace, su reserva puede tardar unos minutos en confirmarse.");

    if (!confirmar) {
      return;
    }

    const reserva = {
      fecha: `${fechaReserva}T${horaSeleccionada}`,
      estadoReserva: "Pendiente",
      servicio: "SinServicio",
      cantidadPersonas: cantidadPersonasReserva,
      mesa: mesaSeleccionada,
      usuario: idUsuario
    };

    if (idReserva != "") {
      putReserva(reserva, idReserva)
        .then((data) => {
          if (data && data.mensaje) {
            alert(data.mensaje);
          } else {
            alert("Reserva actualizada correctamente");
          }
          cargarHistorial();

          setMesasDisponibles([]);
          setMesaSeleccionada(null);
          setHoraSeleccionada("");
          setFechaReserva("");
          setCantidadPersonasReserva("1");
          setVistaEditar(false);
        })
        .catch((err) => console.error("Error actualizando:", err));

    }

  }

  /**************** BUSCAR MESA ************************/


  //Obtener dia de la semana
  function obtenerDiaSemana(fechaString) {
    const [year, month, day] = fechaString.split("-").map(Number);
    const fechaObj = new Date(year, month - 1, day);
    const opciones = { weekday: 'long' };
    const dia = fechaObj.toLocaleDateString('es-ES', opciones);
    const diaObtenido = dia.charAt(0).toUpperCase() + dia.slice(1)
    setDiaSemana(diaObtenido);
  }

  const handleSeleccion = (mesaId) => {
    setMesaSeleccionada(mesaId);
  };

  const numeroMesaSeleccionada = mesasDisponibles.find(m => m.id === mesaSeleccionada)?.numero;

  //Cuando cambia la fecha, calcular el día
  useEffect(() => {
    if (fechaReserva != "") {

      obtenerDiaSemana(fechaReserva);
      setMesasDisponibles([]);
    }
  }, [fechaReserva]);

  //Cuando cambia el día, pedir el horario
  useEffect(() => {
    if (diaSemana) {
      getHorario(diaSemana).then(setDiaActual);
    }
  }, [diaSemana]);

  //Cuando cambia el horario, extraer hora y minutos
  useEffect(() => {

    if (diaActual && diaActual.horaCierre) {
      const [horaDia, minutosDia] = diaActual.horaCierre.split(":");
      setHora(horaDia);
      setMinutos(minutosDia);
    }


  }, [diaActual]);

  useEffect(() => {
    if (fechaReserva === "") {
      // Sin fecha → limpiar todo
      setMesasDisponibles([]);
      setMesaSeleccionada(null);
      setHoraSeleccionada("");
      return;
    }

    if (horaSeleccionada === "") {
      // Hay fecha pero no hora → no hay mesas
      setMesasDisponibles([]);
      setMesaSeleccionada(null);
      return;
    }

    // Hay fecha y hora → traer mesas disponibles
    getMesasDisponibles(fechaReserva, horaSeleccionada).then((mesas) => {
      setMesasDisponibles(mesas);

      // Si la mesa seleccionada ya no está en la lista → limpiar selección
      if (!mesas.find((m) => m.id === mesaSeleccionada?.id) && vistaEditar === false) {
        setMesaSeleccionada(null);
      } else if (!mesas.find((m) => m.id === mesaSeleccionada?.id) && vistaEditar === true) {
        setMesaSeleccionada(mesaGuardadaParaEditar);
      }
    });
  }, [fechaReserva, horaSeleccionada]);

  /**************** FIN BUSCAR MESA *********************/

  function registrarReserva() {
    if (fechaReserva != "" && mesaSeleccionada != "") {
      const reserva = {
        fecha: `${fechaReserva}T${horaSeleccionada}:00`,
        turno: null,
        cantidadPersonas: cantidadPersonasReserva,
        mesa: mesaSeleccionada,
        usuario: idUsuario
      };
      crearReserva(reserva).then(() => {
        cargarHistorial();
        setFechaReserva("");
        setHoraSeleccionada("");
        setCantidadPersonasReserva("1");
        setMesaSeleccionada("");
        setMesasDisponibles([]);
        handlePrev();
      }).catch(() => {

        handlePrev();

      });
    }

  }


  return (
    <div className="container-fluid bg-white min-vh-100 py-5 d-flex justify-content-center flex-column align-items-center">
      <div className="card shadow-lg border-2 rounded-4 w-100 mx-auto" style={{ maxWidth: "700px" }}>
        <div className="card-body p-4">

          {/* Paso actual */}
          <div className="mb-3 text-center">
            <h4 className="fw-bold text-primary">
              {step === 1 && "Iniciar sesión"}
              {step === 2 && "Buscar una mesa"}
              {step === 3 && "Confirmar Reserva"}
            </h4>
            <p className="text-muted">Paso {step} de 3</p>
          </div>

          {/* Paso 1: Iniciar sesión */}
          {step === 1 && (
            <div>
              <p className="text-secondary mb-3">
                Para continuar, inicia sesión en tu cuenta.
              </p>
              <form onSubmit={obtenerToken}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    autoComplete="username"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <div className="input-group"><input
                    type={mostrarPass ? "text" : "password"}
                    className="form-control"
                    placeholder="********"
                    autoComplete="current-password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                  />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setMostrarPass(!mostrarPass)}
                    >
                      {mostrarPass ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Iniciar sesión
                  </button>
                </div>
              </form>
              <div className="text-center mt-3">
                <small>
                  ¿No tienes una cuenta?{" "}
                  <a href="/registro" className="text-decoration-none text-primary">
                    Registrate
                  </a>
                </small>
              </div>
            </div>

          )}

          {/* Paso 2: Buscar mesa */}
          {step === 2 && vistaEditar === false ? (
            <div>
              <h5 className="fw-bold mb-3">Reservación en {datosRestaurante.nombre}</h5>
              <p>
                <span className="fw-semibold">Horario de atención :</span>{" "}
                {diaActual.horaApertura && diaActual.horaCierre
                  ? `${formatearHora(diaActual.horaApertura)} - ${formatearHora(diaActual.horaCierre)}`
                  : ""}
              </p>

              <div className="d-flex justify-content-between align-items-center mb-2">

                <div className="w-100">
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold text-muted mb-1 small">Fecha</label>
                      <input
                        value={fechaReserva}
                        onChange={(e) => setFechaReserva(e.target.value)}
                        type="date"
                        className="form-control border-1"
                        min={new Date().toLocaleDateString("en-CA")}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold text-muted mb-1 small">Hora</label>
                      <SelectHoras fecha={fechaReserva} horas={hora} minutos={minutos} value={horaSeleccionada} onHoraChange={(valor) => setHoraSeleccionada(valor)} />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold text-muted mb-1 small">Personas</label>
                      <select name="" id="" value={cantidadPersonasReserva} onChange={(e) => setCantidadPersonasReserva(e.target.value)} className="form-select" required>
                        <option value="1">1 persona</option>
                        <option value="2">2 personas</option>
                        <option value="3">3 personas</option>
                        <option value="4">4 personas</option>
                        <option value="5">5 personas</option>
                        <option value="6">6 personas</option>
                        <option value="7">7 personas</option>
                        <option value="8">8 personas</option>
                        <option value="9">9 personas</option>
                        <option value="10">10 personas</option>
                        <option value="11">11 personas</option>
                        <option value="12">12 personas</option>
                        <option value="13">13 personas</option>
                        <option value="14">14 personas</option>
                        <option value="15">15 personas</option>
                        <option value="16">16 personas</option>
                        <option value="17">17 personas</option>
                        <option value="18">18 personas</option>
                        <option value="19">19 personas</option>
                        <option value="20">20 personas</option>
                      </select>
                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-3">
                <label htmlFor="hora" className="form-label fw-semibold">Seleccionar Mesa</label>
                <div className="d-flex flex-wrap gap-2 border p-3">
                  {mesasDisponibles
                    .sort((a, b) => a.numero - b.numero)
                    .map((mesa) => {
                      return (
                        <button
                          key={mesa.id}
                          type="button"
                          onClick={() => handleSeleccion(mesa.id)}
                          className={`btn btn-outline-primary ${mesaSeleccionada === mesa.id ? "active" : ""}`}
                          style={{ width: "90px" }}
                        >
                          Mesa {mesa.numero}
                        </button>
                      )

                    })}

                </div>
              </div>

              <div className="d-grid gap-2 mt-4">
                <button className="btn btn-primary btn-lg" onClick={handleNext}>
                  Siguiente
                </button>
                <button className="btn btn-outline-secondary" onClick={handlePrev}>
                  Volver
                </button>
              </div>

            </div>

          ) : step === 2 && vistaEditar ? (
            <div>
              <h5 className="fw-bold mb-3 text-success">Editar mi Reservación</h5>
              <p>
                <span className="fw-semibold">Horario de atención :</span>{" "}
                {diaActual.horaApertura && diaActual.horaCierre
                  ? `${formatearHora(diaActual.horaApertura)} - ${formatearHora(diaActual.horaCierre)}`
                  : ""}
              </p>

              <div className="d-flex justify-content-between align-items-center mb-2">

                <div className="w-100">
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold text-muted mb-1 small">Fecha</label>
                      <input
                        value={fechaReserva}
                        onChange={(e) => setFechaReserva(e.target.value)}
                        type="date"
                        className="form-control border-1"
                        min={new Date().toLocaleDateString("en-CA")}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold text-muted mb-1 small">Hora</label>
                      <SelectHoras fecha={fechaReserva} horas={hora} minutos={minutos} value={horaSeleccionada} onHoraChange={(valor) => setHoraSeleccionada(valor)} />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold text-muted mb-1 small">Personas</label>
                      <select name="" id="" value={cantidadPersonasReserva} onChange={(e) => setCantidadPersonasReserva(e.target.value)} className="form-select" required>
                        <option value="1">1 persona</option>
                        <option value="2">2 personas</option>
                        <option value="3">3 personas</option>
                        <option value="4">4 personas</option>
                        <option value="5">5 personas</option>
                        <option value="6">6 personas</option>
                        <option value="7">7 personas</option>
                        <option value="8">8 personas</option>
                        <option value="9">9 personas</option>
                        <option value="10">10 personas</option>
                        <option value="11">11 personas</option>
                        <option value="12">12 personas</option>
                        <option value="13">13 personas</option>
                        <option value="14">14 personas</option>
                        <option value="15">15 personas</option>
                        <option value="16">16 personas</option>
                        <option value="17">17 personas</option>
                        <option value="18">18 personas</option>
                        <option value="19">19 personas</option>
                        <option value="20">20 personas</option>
                      </select>
                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-3">
                <label htmlFor="hora" className="form-label fw-semibold">Seleccionar Mesa</label>
                <div className="d-flex flex-wrap gap-2 border p-3">
                  {mesasDisponibles
                    .sort((a, b) => a.numero - b.numero)
                    .map((mesa) => {
                      return (
                        <button
                          key={mesa.id}
                          type="button"
                          onClick={() => handleSeleccion(mesa.id)}
                          className={`btn btn-outline-primary ${mesaSeleccionada === mesa.id ? "active" : ""}`}
                          style={{ width: "90px" }}
                        >
                          Mesa {mesa.numero}
                        </button>
                      )

                    })}

                </div>
              </div>

              <div className="d-grid gap-2 mt-4">
                <button className="btn btn-primary btn-lg" onClick={() => actualizarReserva()}>
                  Actualizar Reserva
                </button>
                <button className="btn btn-outline-secondary" onClick={() => {
                  setMesasDisponibles([]);
                  setMesaSeleccionada(null);
                  setHoraSeleccionada("");
                  setFechaReserva("");
                  setCantidadPersonasReserva("1");
                  setVistaEditar(false);
                }}>
                  Volver
                </button>
              </div>

            </div>
          ) : null}
          {/* Paso 3: Confirmación */}
          {step === 3 && (
            <div>
              <h5 className="fw-bold mb-3">Datos de la Reserva</h5>

              <div className="border p-3 mb-3 bg-light">
                <p className="mb-1"><span className="fw-semibold">Restaurante : </span>{datosRestaurante.nombre}</p>
                <p className="mb-1"><span className="fw-semibold">Fecha : </span>{formatearFecha(fechaReserva)}</p>
                <p className="mb-1"><span className="fw-semibold">Hora : </span>{formatearHora(horaSeleccionada)}</p>
                <p className="mb-1"><span className="fw-semibold">Mesa: </span>{numeroMesaSeleccionada}</p>
                <p className="mb-0"><span className="fw-semibold">Cantidad : </span>{`${cantidadPersonasReserva} ${cantidadPersonasReserva == "1" ? "persona" : "personas"}`}</p>
              </div>



              <div className="d-grid gap-2 mt-4 mb-2">
                <button className="btn btn-success btn-lg" onClick={() => registrarReserva()}>Confirmar Reserva</button>
                <button className="btn btn-outline-secondary" onClick={handlePrev}>
                  Volver
                </button>
              </div>

              {datosRestaurante.descripcion && (
                <div className="mt-5" style={{ borderTop: "1px solid black" }}>
                  <p className="mt-3">
                    {datosRestaurante.descripcion}
                  </p>
                </div>
              )}


              <div className="mt-5 row" style={{ borderTop: "1px solid black" }}>
                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                  <p className="mb-2">
                    <span className="fw-semibold">Teléfono :</span> {datosRestaurante.telefono}
                  </p>
                  <p className="mb-0">
                    <span className="fw-semibold">Email :</span> {datosRestaurante.email}
                  </p>
                </div>

                <div className="col-12 col-md-6 d-flex align-items-center mt-3">
                  <p className="mb-0">
                    <span className="fw-semibold">Dirección :</span> {datosRestaurante.direccion} Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate natus optio sunt magni quae quod.
                  </p>
                </div>

              </div>

            </div>
          )}
        </div>
      </div>



      {step === 2 && (
        <div className="card shadow-lg border-0 rounded-4 mt-4 container">
          <div className="card-body p-4">
            <div>
              <h5 className="fw-bold mb-3 text-primary">Mis Reservas</h5>
              <div className="table-responsive">
                <table className="table">
                  <thead className="table-light">
                    <tr className="text-center">
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>C. Personas</th>
                      <th>Mesa</th>
                      <th>Estado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                  {historialReservasCliente.length > 0 ? (
                    historialReservasCliente
                      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                      .map((reserva) => {
                        const [fecha, hora] = reserva.fecha.split("T");
                        return (

                          <tr
                            key={reserva.id}
                            className="text-center align-middle"
                          >
                            <td>{formatearFecha(fecha)}</td>
                            <td>{formatearHora(hora)}</td>
                            <td>{reserva.cantidadPersonas} {reserva.cantidadPersonas > 1 ? "personas" : "persona"}</td>
                            <td>Mesa {reserva.mesa.numero}</td>
                            <td>{reserva.estadoReserva}</td>
                            <td><button className="btn btn-success" onClick={() => editarReserva(reserva)}>Modificar Reserva</button></td>
                          </tr>
                        );
                      })) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No tienes reservasiones
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
