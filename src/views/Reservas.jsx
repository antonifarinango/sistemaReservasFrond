import React, { useState, useEffect } from "react";
import { useWebSocketReserva } from "../hooks/useWebSocketReserva";
import '../styles/Reservas.css'

//ICONOS
import { FaEdit, FaCheck, FaBan, FaUtensils, FaCheckDouble, FaTrashAlt } from "react-icons/fa";



//SERVICIOS
import { getClientes, crearUsuarioAdmin } from "../service/usuariosService";
import { getMesaId } from "../service/mesasService";
import {
  crearReserva,
  putReserva,
  eliminarReserva, //
} from "../service/reservasService";
import { formatearFecha, formatearHora } from "../service/formatearFechaHora";
import { useMesasContext } from "../context/mesasContext";
import { getHorario } from "../service/disponibilidad";
import SelectHoras from "../components/SelectHoras";

export default function Reservas() {
  const { mesas } = useMesasContext();
  const [mesasActivas, setMesasActivas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [active, setActive] = useState(false);
  const [idMesa, setIdMesa] = useState("");
  const [idReserva, setIdReserva] = useState("");
  const [reservaObtenida, setReservaObtenida] = useState([]);
  const [activeBuscarCliente, setActiveBuscarCliente] = useState(false);

  //ESTADOS DEL FORM 
  const [fechaReserva, setFechaReserva] = useState("");
  const [horaReserva, setHoraReserva] = useState("");
  const [turnoReserva, setTurnoReserva] = useState(null);
  const [cantidadPersonasReserva, setCantidadPersonasReserva] = useState("");
  const [editReservaId, setEditReservaId] = useState(null);
  const [estadoFila, setEstadoFila] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [diaSemana, setDiaSemana] = useState("");
  const [diaActual, setDiaActual] = useState([]);
  const [hora, setHora] = useState("");
  const [minutos, setMinutos] = useState("");

  const [listaClientes, setListaClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  // NUEVOS ESTADOS REGISTRAR CLIENTE
  const [activeRegistrarCliente, setActiveRegistrarCliente] = useState(false);
  const [formDataCliente, setFormDataCliente] = useState({
    nombre: "", email: "", password: "", telefono: "", rol: "Cliente"
  });

  const handleChangeCliente = (e) => {
    setFormDataCliente({ ...formDataCliente, [e.target.name]: e.target.value });
  };

  const handleRegistrarClienteBtn = async (e) => {
    e.preventDefault();
    try {
      const nuevoCliente = await crearUsuarioAdmin(formDataCliente);
      alert("Cliente registrado correctamente");
      setListaClientes(prev => [...prev, nuevoCliente]);
      setClientesFiltrados(prev => [...prev, nuevoCliente]);
      setActiveRegistrarCliente(false);
      setFormDataCliente({ nombre: "", email: "", password: "", telefono: "", rol: "Cliente" });
    } catch (error) {
      console.error(error);
    }
  }

  //CARGAR MESAS
  useEffect(() => {
    setMesasActivas(mesas.filter((m) => m.activa === true));
  }, [mesas]);

  function handleClickMesaId(id) {
    setIdMesa(id);
    setReservaObtenida([]);
  }


  function handleClickReserva(id, reserva) {
    setIdReserva(id);
    setReservaObtenida(reserva);
    setEstadoFila(reserva.estadoReserva);
  }

  //OBTENER LISTA DE RESERVAS POR MESA
  function loadReservas() {
    if (idMesa) {
      getMesaId(idMesa).then((data) => {
        setReservas(data.reservas || []);
      });
    }
  }
  ////

  useWebSocketReserva((reserva) => {
    if (reserva.tipoNotificacion === "ELIMINACION") {
      setReservas((prev) => prev.filter((r) => r.id !== reserva.id));
      setMesasActivas((prev) => prev.map((mesa) => ({
        ...mesa,
        reservas: mesa.reservas.filter((r) => r.id !== reserva.id)
      })));
      return;
    }

    setReservas((prev) => {
      if (idMesa === reserva.mesa.id) {
        const existe = prev.some((r) => r.id === reserva.id);
        return existe ? prev.map((r) => (r.id === reserva.id ? reserva : r)) : [...prev, reserva];
      } else {
        return prev.filter((r) => r.id !== reserva.id);
      }
    });

    setMesasActivas((prev) => prev.map((mesa) => {
      const mesaLimpia = {
        ...mesa,
        reservas: mesa.reservas.filter((r) => r.id !== reserva.id)
      };

      if (mesaLimpia.id === reserva.mesa.id) {
        return {
          ...mesaLimpia,
          reservas: [...mesaLimpia.reservas, reserva]
        };
      }
      return mesaLimpia;
    }));
  });

  useEffect(() => {
    loadReservas();
  }, [idMesa]); //

  //Obtener dia de la semana
  function obtenerDiaSemana(fechaString) {
    const [year, month, day] = fechaString.split("-").map(Number);
    const fechaObj = new Date(year, month - 1, day);
    const opciones = { weekday: 'long' };
    const dia = fechaObj.toLocaleDateString('es-ES', opciones);
    const diaObtenido = dia.charAt(0).toUpperCase() + dia.slice(1)
    setDiaSemana(diaObtenido);
  }

  //Cuando cambia la fecha, calcular el día
  useEffect(() => {
    if (fechaReserva != "") {
      obtenerDiaSemana(fechaReserva);
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

  // GUARDAR O ACTUALIZAR
  function guardarReserva() {
    const reserva = {
      fecha: `${fechaReserva}T${horaReserva}:00`,
      turno: turnoReserva,
      estadoReserva: estadoFila || "Pendiente",
      servicio: "SinServicio",
      cantidadPersonas: cantidadPersonasReserva,
      mesa: idMesa,
      usuario: idCliente == "" ? null : idCliente
    };

    if (editReservaId) {
      // EDITAR
      putReserva(reserva, editReservaId)
        .then(() => {
          resetForm();
          loadReservas();
        })
        .catch((err) => console.error("Error actualizando:", err));
    } else {
      //CREAR
      crearReserva(reserva)
        .then(() => {
          resetForm();
          loadReservas();
        })
        .catch((err) => {
          console.error("Error creando:", err)
        });
    }
  }

  // RESETEAR FORMULARIO
  function resetForm() {
    setActive(false);
    setEditReservaId(null);
    setFechaReserva("");
    setHoraReserva("");
    setCantidadPersonasReserva("");
    setNombreCliente("");
    setEmailCliente("");
    setIdCliente("");
  }

  // EDITAR RESERVA
  function editarReserva(reserva) {
    const [soloFecha, soloHora] = reserva.fecha.split("T");
    const [hh, mm, ss] = soloHora.split(":");
    const hora = hh + ":" + mm;
    setFechaReserva(soloFecha);
    setHoraReserva(hora);
    setTurnoReserva(reserva.turno);
    setCantidadPersonasReserva(reserva.cantidadPersonas);
    setEditReservaId(reserva.id);
    setNombreCliente(reserva.usuario.nombre);
    setEmailCliente(reserva.usuario.email);
    setActive(true);
  }

  //ELIMINAR RESERVA
  function borrarReserva(id) {
    eliminarReserva(id)
      .then(() => {
        setReservas((prev) => prev.filter((r) => r.id !== id));
        //loadReservas();
        setReservaObtenida(!reservaObtenida.id);
        setMesasActivas((prev) =>
          prev.map((mesa) => ({
            ...mesa,
            reservas: mesa.reservas.filter((r) => r.id !== id)
          })));
      })
      .catch((err) => console.error("Error al eliminar", err));
  }

  //CONFIRMAR RESERVA
  function confirmarReserva(reserva) {
    const res = {
      fecha: reserva.fecha,
      turno: reserva.turno,
      estadoReserva: "Confirmada",
      servicio: "SinServicio",
      cantidadPersonas: reserva.cantidadPersonas,
      mesa: reserva.mesa.id,
      usuario: reserva.usuario.id
    }

    putReserva(res, reserva.id)
      .then(() => {
        setReservas((prev) => prev.map((r) => (r.id === reserva.id ? { ...r, estadoReserva: "Confirmada", servicio: "SinServicio" } : r)));

        //loadReservas();
        setMesasActivas(prev =>
          prev.map(mesa =>
            mesa.id === reserva.mesa.id
              ? {
                ...mesa,
                reservas: mesa.reservas.map(r =>
                  r.id === reserva.id
                    ? { ...r, estadoReserva: "Confirmada", servicio: "SinServicio" }
                    : r
                )
              }
              : mesa
          )
        );
        setReservaObtenida({ ...reserva, estadoReserva: "Confirmada" });
        setEstadoFila("Confirmada")
      })
      .catch((err) => console.error("Error al actualizar", err));
  }

  //CANCELAR RESERVA
  function cancelarReserva(reserva) {
    const res = {
      fecha: reserva.fecha,
      turno: reserva.turno,
      estadoReserva: "Pendiente",
      servicio: "SinServicio",
      cantidadPersonas: reserva.cantidadPersonas,
      mesa: reserva.mesa.id,
      usuario: reserva.usuario.id
    };
    putReserva(res, reserva.id)
      .then(() => {
        setReservas((prev) => prev.map((r) => r.id === reserva.id ? { ...r, estadoReserva: "Pendiente", servicio: "SinServicio" } : r));
        //loadReservas();
        setMesasActivas(prev =>
          prev.map(mesa =>
            mesa.id === reserva.mesa.id
              ? {
                ...mesa,
                reservas: mesa.reservas.map(r =>
                  r.id === reserva.id
                    ? { ...r, estadoReserva: "Pendiente", servicio: "SinServicio" }
                    : r
                )
              }
              : mesa
          )
        );
        setReservaObtenida({ ...reserva, estadoReserva: "Pendiente" });
        setEstadoFila("Pendiente")
      })
      .catch((err) => console.error("Error al actualizar", err));
  }


  //RESERVA EN SERVICIO

  function reservaEnServicio(reserva) {
    const res = {
      fecha: reserva.fecha,
      turno: reserva.turno,
      servicio: "EnServicio",
      estadoReserva: estadoFila,
      cantidadPersonas: reserva.cantidadPersonas,
      mesa: reserva.mesa.id,
      usuario: reserva.usuario.id
    };
    putReserva(res, reserva.id)
      .then(() => {
        console.log(estadoFila);
        setReservas((prev) => prev.map((r) => r.id === reserva.id ? { ...r, estadoReserva: estadoFila, servicio: "EnServicio" } : r));
        //loadReservas();
        setReservaObtenida({ ...reserva, estadoReserva: estadoFila });
      })
      .catch((err) => console.error("Error al actualizar", err));
  }

  //FINALIZAR RESERVA

  function reservaFinalizada(reserva) {
    const res = {
      fecha: reserva.fecha,
      turno: reserva.turno,
      servicio: "Finalizada",
      estadoReserva: estadoFila,
      cantidadPersonas: reserva.cantidadPersonas,
      mesa: reserva.mesa.id,
      usuario: reserva.usuario.id
    };

    putReserva(res, reserva.id)
      .then(() => {
        setReservas((prev) => prev.map((r) => r.id === reserva.id ? { ...r, estadoReserva: estadoFila, servicio: "Finalizada" } : r));
        //loadReservas();
        setReservaObtenida({ ...reserva, estadoReserva: estadoFila });
      })
      .catch((err) => console.error("Error al actualizar", err));
  }

  useEffect(() => {
    if (activeBuscarCliente) {
      getClientes().then((data) => {
        setListaClientes(data);
        setClientesFiltrados(data);
      });
    }
  }, [activeBuscarCliente]);

  useEffect(() => {
    setClientesFiltrados(
      listaClientes.filter((c) =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase())
      )
    );
  }, [busqueda, listaClientes]);

  const [idCliente, setIdCliente] = useState("");

  function handleClickCliente(id, cliente) {
    setIdCliente(id);
    setNombreCliente(cliente.nombre);
    setEmailCliente(cliente.email);
  }

  return (
    <div className="responsive-container container">

      <div
        className="vista-buscar-cliente"
        style={{ display: `${activeBuscarCliente ? "flex" : "none"}` }}
      >
        <div className="bg-light col-lg-3 col-sm-7 col-9 p-3 d-flex flex-column">
          <div className="d-flex justify-content-end">
            <button className="btn btn-danger" onClick={() => setActiveBuscarCliente(false)}
            >X</button>
          </div>

          <div className="d-flex flex-column py-1" style={{ height: "370px" }}>
            <h2>Buscar Clientes</h2>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <table className="table table-bordered flex-grow-1" style={{ overflow: "auto" }}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map((cliente) => (
                    <tr className={`${idCliente === cliente.id ? "table-primary" : ""
                      }`} onClick={() => handleClickCliente(cliente.id, cliente)} key={cliente.id}>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.telefono}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center text-muted">
                      No se encontraron clientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-dark mt-2">
            <button className="btn btn-success w-100" onClick={() => {
              setActiveBuscarCliente(false)
            }}>Confirmar</button>
          </div>
        </div>

      </div>

      <div
        className="vista-buscar-cliente"
        style={{ display: `${activeRegistrarCliente ? "flex" : "none"}`, zIndex: 100 }}
      >
        <div className="bg-light col-lg-3 col-sm-7 col-9 p-3 d-flex flex-column" style={{ borderRadius: "8px", height: "450px" }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 text-primary fw-bold">Registrar Cliente</h4>
            <button className="btn btn-danger btn-sm" onClick={() => setActiveRegistrarCliente(false)}>X</button>
          </div>

          <form onSubmit={handleRegistrarClienteBtn} className="d-flex flex-column flex-grow-1 overflow-auto pe-2">
            <div className="mb-2">
              <label className="form-label mb-1 fw-semibold text-primary">Nombre completo</label>
              <input type="text" className="form-control" name="nombre" value={formDataCliente.nombre} onChange={handleChangeCliente} required />
            </div>

            <div className="mb-2">
              <label className="form-label mb-1 fw-semibold text-primary">Correo</label>
              <input type="email" className="form-control" name="email" value={formDataCliente.email} onChange={handleChangeCliente} required />
            </div>

            <div className="mb-2">
              <label className="form-label mb-1 fw-semibold text-primary">Contraseña temporal</label>
              <input type="password" className="form-control" name="password" value={formDataCliente.password} onChange={handleChangeCliente} required />
            </div>

            <div className="mb-2">
              <label className="form-label mb-1 fw-semibold text-primary">Teléfono</label>
              <input type="text" className="form-control" name="telefono" value={formDataCliente.telefono} onChange={handleChangeCliente} required />
            </div>

            <button type="submit" className="btn btn-success mt-auto w-100 py-2 fw-semibold">Guardar y Confirmar</button>
          </form>
        </div>
      </div>

      <div className="container h-100 p-0">
        <h1 className="responsive-h1 mt-3">Reservas</h1>

        <div className="responsive-configuracion-mesas"
          style={{
            borderRadius: "5px",
            background: "#F0F0F0",
            marginTop: "20px",
            display: "grid",
            gap: "10px",
            padding: "10px",
            height: "700px",
          }}
        >
          {/* Columna mesas */}
          <div
            className="responsive-mesasConfig-mesas d-flex flex-column p-2 justify-content-center align-items-center"
            style={{
              gap: "5px",
              backgroundColor: "#fff",
            }}
          >
            <h5 className="responsive-h5-config-mesas text-primary">Mesas</h5>
            {mesasActivas
              .slice()
              .sort((a, b) => a.numero - b.numero)
              .map((mesa) => {

                const reservasPendientes = mesa.reservas.filter((reserva) => reserva.estadoReserva === "Pendiente").length;

                return (

                  <div className="div-btn-mesa w-75" key={mesa.id}>
                    <button
                      className={`btn w-100 p-1 ${idMesa === mesa.id ? "btn-primary" : "btn-secondary"
                        }`}
                      onClick={() => handleClickMesaId(mesa.id)}
                    >
                      Mesa {mesa.numero}


                    </button>
                    {reservasPendientes > 0 && (
                      <p className="div-aviso-reserva">{reservasPendientes}</p>
                    )}

                  </div>



                )

              })}
          </div>

          {/* Columna reservas */}
          <div
            className="responsive-edit-mesas d-flex flex-column"

          >
            {/* Header */}
            <div
              className={`container d-flex  p-2 ${active ? "gap-2 justify-content-end" : "justify-content-between"
                }`}
              style={{ backgroundColor: "#fff" }}
            >
              <div
                className="col-10 gap-2"
                style={{ display: `${active ? "none" : "flex"}` }}>
                <div className="w-50 d-flex gap-2">
                  <button
                    title="Editar Reserva"
                    disabled={
                      !reservaObtenida.id
                    }
                    className="btn text-light py-0" style={{ backgroundColor: "#45537A", width: "50px", height: "45px" }}
                    onClick={() => editarReserva(reservaObtenida)}
                  >
                    <FaEdit className="fs-4" />
                  </button>

                  <button
                    title="Confirmar Reserva"
                    disabled={
                      !reservaObtenida.id || reservaObtenida.estadoReserva === "Confirmada"
                    }
                    className={`btn ${!reservaObtenida.id
                      ? "btn-secondary"
                      : reservaObtenida.estadoReserva === "Confirmada"
                        ? "btn-secondary"
                        : "btn-success"
                      }`}
                    style={{ width: "50px", height: "45px" }}
                    onClick={() => confirmarReserva(reservaObtenida)}
                  >
                    <FaCheck className="fs-4" />
                  </button>

                  <button
                    title="Cancelar Reserva"
                    disabled={
                      !reservaObtenida.id || reservaObtenida.estadoReserva === "Pendiente"
                    }
                    className={`btn me-5 ${!reservaObtenida.id
                      ? "btn-secondary"
                      : reservaObtenida.estadoReserva === "Pendiente"
                        ? "btn-secondary"
                        : "btn-danger"
                      }`}
                    style={{ width: "50px", height: "45px" }}
                    onClick={() => cancelarReserva(reservaObtenida)}
                  >
                    <FaBan className="fs-4" />
                  </button>

                  <button
                    title="Reserva en Servicio"
                    className="btn btn-success col-4" style={{ width: "50px", height: "45px" }}
                    disabled={
                      !reservaObtenida.id || reservaObtenida.estadoReserva === "Pendiente"
                    }
                    onClick={() => reservaEnServicio(reservaObtenida)}
                  >
                    <FaUtensils className="fs-4" />
                  </button>


                  <button
                    title="Reserva Finalizada"
                    className="btn col-4" style={{ backgroundColor: "#45537A", width: "50px", height: "45px" }}
                    disabled={
                      !reservaObtenida.id || reservaObtenida.estadoReserva === "Pendiente"
                    }
                    onClick={() => reservaFinalizada(reservaObtenida)}
                  >
                    <FaCheckDouble className="fs-4 text-light" />
                  </button>

                  <button
                    title="Eliminar Reserva"
                    disabled={
                      !reservaObtenida.id
                    }
                    className="btn btn-danger" style={{ width: "50px", height: "45px" }}
                    onClick={() => borrarReserva(idReserva)}
                  >
                    <FaTrashAlt className="fs-4" />
                  </button>

                </div>

              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-success py-2"
                  style={{ display: active ? "none" : "flex", height: "45px" }}
                  onClick={() => setActive(true)}
                  disabled={!idMesa}
                >
                  Crear
                </button>

                <button
                  className="btn btn-info"
                  style={{ display: active ? "flex" : "none" }}
                  onClick={() => guardarReserva()}
                >
                  {editReservaId ? "Actualizar" : "Guardar"}
                </button>

                <button
                  className="btn btn-danger"
                  style={{ display: active ? "flex" : "none" }}
                  onClick={() => resetForm()}
                >
                  X
                </button>
              </div>

            </div>

            {/* Formulario */}
            <div
              className="p-3 flex-column mt-3"
              style={{
                display: active ? "flex" : "none",
                gap: "10px",
                backgroundColor: "#fff",
              }}
            >
              <h4 className="text-dark fw-semibold">
                {editReservaId ? "Editar Reserva" : "Crear Reserva"}
              </h4>

              <div className="d-flex flex-column gap-2">
                <label className="text-primary fw-bolder">
                  Selecciona la fecha:
                </label>
                <input
                  value={fechaReserva}
                  onChange={(e) => setFechaReserva(e.target.value)}
                  type="date"
                  className="form-control"
                  min={new Date().toLocaleDateString("en-CA")}
                />

                <label className="text-primary fw-bolder">
                  Selecciona la hora:
                </label>
                <SelectHoras
                  fecha={fechaReserva}
                  horas={hora}
                  minutos={minutos}
                  value={horaReserva}
                  onHoraChange={(valor) => setHoraReserva(valor)}
                  reservasMesa={reservas}
                  editReservaId={editReservaId}
                />

                <label className="text-primary fw-bolder">
                  Cantidad de personas:
                </label>
                <input
                  value={cantidadPersonasReserva}
                  onChange={(e) => setCantidadPersonasReserva(e.target.value)}
                  type="number"
                  className="form-control"
                  min="1"
                />
              </div>
            </div>

            <div
              className="p-3 flex-column mt-3"
              style={{
                display: active ? "flex" : "none",
                gap: "10px",
                backgroundColor: "#fff",
              }}
            >
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-end gap-3">
                  <button className="col-2 btn btn-primary" onClick={(e) => { e.preventDefault(); setActiveBuscarCliente(true); }}>
                    Buscar cliente
                  </button>

                  <button className="col-2 btn btn-success" onClick={(e) => { e.preventDefault(); setActiveRegistrarCliente(true); }}>
                    Registrar cliente
                  </button>

                </div>

                <label className="text-primary fw-bolder">
                  Cliente:
                </label>
                <input
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                  type="text"
                  className="form-control"
                  disabled
                />

                <label className="text-primary fw-bolder">
                  Email:
                </label>
                <input
                  value={emailCliente}
                  onChange={(e) => setEmailCliente(e.target.value)}
                  type="text"
                  className="form-control"
                  disabled
                />
              </div>
            </div>

            {/* Tabla */}
            <div
              className="flex-grow-1 container px-0 py-3"
              style={{ display: active ? "none" : "flex", height: "400px" }}
            >
              <div className="table-responsive w-100">
                <table className="table">
                  <thead className="table-light">
                    <tr className="text-center">
                      <th>Usuario</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Turno</th>
                      <th>C.Personas</th>
                      <th>Estado</th>
                      <th>Servicio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas
                      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                      .map((reserva) => {
                        const [fecha, hora] = reserva.fecha.split("T");

                        return (
                          <tr
                            key={reserva.id}
                            className={`text-center align-middle ${idReserva === reserva.id ? "table-primary" : ""
                              }`}

                            style={{ cursor: "pointer", backgroundColor: "" }}
                            onClick={() => handleClickReserva(reserva.id, reserva)}
                          >
                            <td>{reserva.usuario.nombre}</td>
                            <td>{formatearFecha(fecha)}</td>
                            <td>{formatearHora(hora)}</td>
                            <td>{reserva.turno}</td>
                            <td>{reserva.cantidadPersonas}</td>
                            <td className={`fw-semibold ${reserva.estadoReserva == "Pendiente" ? "text-danger" : ""}`} >{reserva.estadoReserva}</td>
                            <td>
                              {reserva.servicio === "SinServicio"
                                ? "-----"
                                : reserva.servicio === "EnServicio"
                                  ? "En Servicio"
                                  : "Finalizada"}

                            </td>

                          </tr>
                        );

                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
