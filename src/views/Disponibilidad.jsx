import React, { useState, useEffect } from "react";

//ICONOS
import { FaEdit } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { IoCloseCircleSharp } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

//SERVICIOS
import {
  getFechasBloqueadas,
  getHorarios,
  getTurnos,
  crearFechaBloqueada,
  eliminarFechaBloqueada,
  putFechaBloqueada,
  putHorario,
  putTurno
} from "../service/disponibilidad";
import { formatearFecha, formatearHora } from "../service/formatearFechaHora";

export default function Disponibilidad() {
  /******************** CARGAR INFORMACIÓN AL INICIAR *************************/
  const [listaHorarios, setListaHorarios] = useState([]);
  const [listaTurnos, setListaTurnos] = useState([]);
  const [listaFechasBloqueadas, setListaFechasBloqueadas] = useState([]);

  useEffect(() => {
    getHorarios().then(setListaHorarios);
    getTurnos().then(setListaTurnos);
    getFechasBloqueadas().then(setListaFechasBloqueadas);
  }, []);

  /******************** FIN CARGAR INFORMACIÓN AL INICIAR *************************/

  /********************************FECHAS BLOQUEADAS *******************************/

  //FECHAS BLOQUEADAS
  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState("");
  const [idFechaBloqueada, setIdFechaBloqueada] = useState("");
  const [activateVistaFechaBloqueada, setActiveVistaFechaBloqueada] = useState(false);
  const [activateEditar, setActiveEditar] = useState(false);

  function eliminarFecha(id) {
    eliminarFechaBloqueada(id).then(() => {
      loadFechas();
    });
  }

  function formatearFechas() {
    setActiveVistaFechaBloqueada(!activateVistaFechaBloqueada);
    setFecha("");
    setMotivo("");
    setIdFechaBloqueada("");
    setActiveEditar(false);
  }

  useEffect(() => {
    loadFechas();
  }, []);

  function loadFechas() {
    getFechasBloqueadas().then(setListaFechasBloqueadas);
  }

  function editarFechaBloqueada(fechaBloqueada) {
    setFecha(fechaBloqueada.fecha);
    setMotivo(fechaBloqueada.motivo);
    setIdFechaBloqueada(fechaBloqueada.id);
    setActiveVistaFechaBloqueada(!activateVistaFechaBloqueada);
    setActiveEditar(true);
  }

  function guardarFechaBloqueada() {
    const fechaBloqueada = {
      fecha: fecha,
      motivo: motivo,
    };

    if (idFechaBloqueada != "") {
      // EDITAR
      putFechaBloqueada(fechaBloqueada, idFechaBloqueada)
        .then(() => {
          loadFechas();
          formatearFechas();
          setActiveEditar(false);
        })
        .catch((err) => console.error("Error actualizando:", err));
    } else {
      crearFechaBloqueada(fechaBloqueada).then(() => {
        loadFechas();
        formatearFechas();
        setActiveEditar(false);
      });
    }
  }

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  /******************************** FIN FECHAS BLOQUEADAS *******************************/

  /***************************************** HORARIOS ****************************************/
  const [datosHorarios, setDatosHorarios] = useState([]);
  const [activateVistaHorario, setActiveVistaHorario] = useState(false);

  function loadHorarios() {
    getHorarios().then(setListaHorarios);
    setActiveVistaHorario(!activateVistaHorario);
  }

  function detectarCambioHorario(id, value, campo) {
    const listaActualizada = listaHorarios.map((h) =>
      h.id === id ? { ...h, [campo]: value } : h
    );
    setListaHorarios(listaActualizada);

    setDatosHorarios((prev) => {
      const existe = prev.find((item) => item.id === id);
      if (existe) {
        return prev.map((h) => (h.id === id ? { ...h, [campo]: value } : h));
      } else {
        const horarioModificado = listaActualizada.find((h) => h.id === id);
        return [...prev, horarioModificado];
      }
    });
  }

  function actualizarHorarios() {
    if (datosHorarios.length !== 0) {
      putHorario(datosHorarios).then(() => {
        setDatosHorarios([]);
        loadHorarios();
      });
    }
  }

  /***************************************** FIN HORARIOS ****************************************/

  /***************************************** TURNOS ****************************************/

  const [datosTurnos, setDatosTurnos] = useState([]);
  const [activateVistaTurno, setActiveVistaTurno] = useState(false);
  const turnos = ["Mañana", "Tarde", "Noche"];

  function loadTurnos() {
    getTurnos().then(setListaTurnos);
    setActiveVistaTurno(!activateVistaTurno);
  }

  function detectarCambioTurno(id, value, campo) {
    const listaActualizada = listaTurnos.map((t) =>
      t.id === id ? { ...t, [campo]: value } : t
    );
    setListaTurnos(listaActualizada);

    setDatosTurnos((prev) => {
      const existe = prev.find((item) => item.id === id);
      if (existe) {
        return prev.map((t) => (t.id === id ? { ...t, [campo]: value } : t));
      } else {
        const horarioModificado = listaActualizada.find((t) => t.id === id);
        return [...prev, horarioModificado];
      }
    });
  }

  function actualizarTurnos() {
    if (datosTurnos.length !== 0) {
      putTurno(datosTurnos).then(() => {
        setDatosTurnos([]);
        loadTurnos();
      });
    }
  }

  /***************************************** FIN TURNOS ****************************************/
  return (
    <div className="container-fluid p-0">
      <div className="container h-100 p-0">
        <h1 className="responsive-h1 mt-3">Disponibilidad</h1>

        <div className="responsive-diponibilidad"
          style={{
            borderRadius: "5px",
            background: "#F0F0F0",
            marginTop: "20px",
            display: "grid",
            gap: "10px",
            padding: "10px",
            width: "100%",
            height: "auto"
          }}
        >
          {/*************************************** HORARIOS *************************************************/}
          <div
            className="responsive-horarios-diponibilidad d-flex flex-column gap-3"
          >
            <div className="d-flex justify-content-around py-1 rounded-1" style={{ backgroundColor: "#45537A" }}>
              <h5 className="responsive-h5 mb-0 p-2 text-light">Horarios</h5>

              <div
                className="justify-content-end w-50"
                style={{ display: `${activateVistaHorario ? "none" : "flex"}` }}
              >
                <button
                  className="btn text-light p-0"
                  onClick={() => setActiveVistaHorario(!activateVistaHorario)}
                >
                  <FaEdit className="fs-4" />
                </button>
              </div>

              <div
                className="justify-content-end w-50  gap-3"
                style={{ display: `${activateVistaHorario ? "flex" : "none"}` }}
              >
                <button
                  className="btn text-light py-0"
                  onClick={() => actualizarHorarios()}
                >
                  <IoIosSave className="fs-3"/>
                </button>
                <button
                  className="btn text-light py-0"
                  onClick={() => setActiveVistaHorario(!activateVistaHorario)}
                >
                  <IoCloseCircleSharp className="fs-2" />
                </button>
              </div>
            </div>

            <div
              className="card table-responsive w-100 rounded-1"
              style={{ display: `${activateVistaHorario ? "none" : "flex"}` }}
            >

              <table className="table mb-0">
                <thead className="table-light">
                  <tr className="text-center">
                    <th>Fecha</th>
                    <th>Horario</th>
                  </tr>
                </thead>
                <tbody>
                  {listaHorarios
                    .sort(
                      (a, b) =>
                        diasSemana.indexOf(a.diaSemana) -
                        diasSemana.indexOf(b.diaSemana)
                    )
                    .map((horario) => (
                      <tr
                        key={horario.id}
                        className="text-center"
                        style={{ height: "45px" }}
                      >
                        <td>
                          {horario.diaSemana}
                        </td>

                        <td>
                          {horario.horaApertura} am - {horario.horaCierre} pm
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/***************** VISTA EDITAR *****************/}
            <div
              className="flex-column gap-2"
              style={{ display: `${activateVistaHorario ? "flex" : "none"}` }}
            >
              {listaHorarios
                .sort(
                  (a, b) =>
                    diasSemana.indexOf(a.diaSemana) -
                    diasSemana.indexOf(b.diaSemana)
                )
                .map((horario) => (
                  <div
                    key={horario.id}
                    className="d-flex justify-content-around align-items-center px-3 gap-0 rounded-1 bg-light"
                    style={{ height: "45px", border: "1px solid rgba(0, 0, 0, 0.125)" }}
                  >
                    <label className="fw-bold" style={{ width: "70px" }}>
                      {horario.diaSemana}
                    </label>

                    {/* Input hora apertura */}
                    <span>Inicio</span>
                    <input
                      className="text-center form-control w-25"
                      type="time"
                      value={horario.horaApertura}
                      onChange={(e) =>
                        detectarCambioHorario(
                          horario.id,
                          e.target.value,
                          "horaApertura"
                        )
                      }
                    />
                    {/* Input hora cierre */}
                    <span>Fin</span>
                    <input
                      className="text-center form-control w-25"
                      type="time"
                      value={horario.horaCierre}
                      onChange={(e) =>
                        detectarCambioHorario(horario.id, e.target.value, "horaCierre")
                      }
                    />
                  </div>
                ))}
            </div>
          </div>

          {/*************************************** TURNOS *************************************************/}
          <div
            className="responsive-turnos-diponibilidad d-flex flex-column gap-3"
          >
            <div className="d-flex justify-content-around py-1 rounded-1" style={{ backgroundColor: "#45537A" }}>
              <h5 className="responsive-h5 mb-0 p-2 text-light">Turnos</h5>
              <div
                className="justify-content-end w-50"
                style={{ display: `${activateVistaTurno ? "none" : "flex"}` }}
              >
                <button
                  className="btn text-light p-0 px-2"
                  onClick={() => setActiveVistaTurno(!activateVistaTurno)}
                >
                  <FaEdit className="fs-4" />
                </button>
              </div>

              <div
                className="justify-content-end w-50  gap-3"
                style={{ display: `${activateVistaTurno ? "flex" : "none"}` }}
              >
                <button
                  className="btn text-light py-0"
                  onClick={() => actualizarTurnos()}
                >
                  <IoIosSave className="fs-3"/>
                </button>
                <button
                  className="btn text-light  py-0"
                  onClick={() => setActiveVistaTurno(!activateVistaTurno)}
                >
                  <IoCloseCircleSharp className="fs-2" />
                </button>
              </div>
            </div>


            <div
              className="card table-responsive w-100 rounded-1"
              style={{ display: `${activateVistaTurno ? "none" : "flex"}` }}
            >

              <table className="table mb-0">
                <tbody>
                  {listaTurnos
                    .sort(
                      (a, b) => turnos.indexOf(a.turno) - turnos.indexOf(b.turno)
                    )
                    .map((turno) => (
                      <tr
                        key={turno.id}
                        className="text-center"
                        style={{ height: "49px" }}
                      >
                        <td className="" style={{ width: "100px" }}>
                          {turno.turno}
                        </td>

                        <td
                          style={{ width: "200px" }}
                        >
                          {formatearHora(turno.horaInicio)} - {formatearHora(turno.horaFin)}
                        </td>
                      </tr>
                    ))}
                </tbody>

              </table>
            </div>

            {/***************** VISTA EDITAR *****************/}
            <div
              className="flex-column gap-2"
              style={{ display: `${activateVistaTurno ? "flex" : "none"}` }}
            >
              {listaTurnos
                .sort(
                  (a, b) => turnos.indexOf(a.turno) - turnos.indexOf(b.turno)
                )
                .map((turno) => (
                  <div
                    key={turno.id}
                    className="d-flex justify-content-around align-items-center bg-light px-3 gap-0 rounded-1"
                    style={{ height: "45px", border: "1px solid rgba(0, 0, 0, 0.125)" }}
                  >
                    <label className="fw-bold" style={{ width: "70px" }}>
                      {turno.turno}
                    </label>

                    {/* Input hora apertura */}
                    <span>Inicio</span>
                    <input
                      className="text-center form-control w-25"
                      type="time"
                      value={turno.horaInicio}
                      onChange={(e) =>
                        detectarCambioTurno(
                          turno.id,
                          e.target.value,
                          "horaInicio"
                        )
                      }
                    />
                    {/* Input hora cierre */}
                    <span>Fin</span>
                    <input
                      className="text-center form-control w-25"
                      type="time"
                      value={turno.horaFin}
                      onChange={(e) =>
                        detectarCambioTurno(turno.id, e.target.value, "horaFin")
                      }
                    />
                  </div>
                ))}
            </div>
          </div>
          {/*************************************** FECHAS BLOQUEADAS *************************************************/}
          <div
            className="responsive-fechas-disponibilidad d-flex flex-column gap-3"
          >
            <div className="d-flex justify-content-center py-2 rounded-1" style={{ backgroundColor: "#45537A" }}>
              <h5 className="responsive-h5 text-center text-light">Fechas Bloqueadas</h5>
            </div>

            <div className="d-flex justify-content-end">
              <button
                className="btn btn-success w-100 justify-content-center rounded-1"
                style={{
                  display: `${activateVistaFechaBloqueada ? "none" : "flex"}`,
                }}
                onClick={() => setActiveVistaFechaBloqueada(true)}
              >
                Registrar nueva fecha
              </button>

              <div
                className="w-100 gap-2"
                style={{
                  display: `${activateVistaFechaBloqueada ? "flex" : "none"}`,
                }}
              >
                <button
                  className="btn btn-success w-100 justify-content-center"
                  onClick={() => guardarFechaBloqueada()}
                >
                  {activateEditar ? "Actualizar fecha" : "Guardar fecha"}
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => formatearFechas()}
                >
                  <MdOutlineClose className="fs-4"/>
                </button>
              </div>
            </div>

            {/***************** LISTADO *****************/}



            <div
              className="card h-100  bg-danger gap-2 rounded-1 bg-light"
              style={{
                display: `${activateVistaFechaBloqueada ? "none" : "flex"}`, overflowY: "auto",
              }}
            >
              <div 
                className="responsive-fechas-tabla-disponibilidad table-responsive w-100"
              >

                <table className="table">
                  <thead className="table-light">
                    <tr className="text-center">
                      <th>Fecha</th>
                      <th>Motivo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>


                    {listaFechasBloqueadas
                      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                      .map((fecha) => {
                        const [yyyy, mm, dd] = fecha.fecha.split("-");

                        const fechaFormateada = dd + "-" + mm + "-" + yyyy;
                        return (
                          <tr
                            key={fecha.id}
                            className="text-center align-middle"
                          >
                            <td>{fechaFormateada}</td>
                            <td>{fecha.motivo}</td>
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn text-light"
                                  style={{ backgroundColor: "#45537A" }}
                                  onClick={() => editarFechaBloqueada(fecha)}
                                >
                                  <FaEdit className="fs-4" />
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => eliminarFecha(fecha.id)}
                                >
                                  <MdDeleteForever className="fs-4"/>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>

              </div>
            </div>



            {/***************** VISTA EDITAR *****************/}
            <div
              className="card flex-column p-3 bg-light"
              style={{
                display: `${activateVistaFechaBloqueada ? "flex" : "none"}`,
              }}
            >
              <div className="d-flex flex-column">
                <label className="form-label">Fecha</label>
                <input
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  type="date"
                  className="form-control"
                />
              </div>

              <div className="d-flex flex-column mt-3">
                <label className="form-label">Motivo</label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="form-control"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
