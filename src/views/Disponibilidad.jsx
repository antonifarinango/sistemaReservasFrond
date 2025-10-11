import React, { useState, useEffect } from "react";

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

export default function Disponibilidad() {
  /***************************************** CARGAR INFORMACIÓN AL INICIAR ****************************************/
  const [listaHorarios, setListaHorarios] = useState([]);
  const [listaTurnos, setListaTurnos] = useState([]);
  const [listaFechasBloqueadas, setListaFechasBloqueadas] = useState([]);

  useEffect(() => {
    getHorarios().then(setListaHorarios);
    getTurnos().then(setListaTurnos);
    getFechasBloqueadas().then(setListaFechasBloqueadas);
  }, []);

  /***************************************** FECHAS BLOQUEADAS ****************************************/

  //FECHASBLOQUEADAS
  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState("");
  const [idFechaBloqueada, setIdFechaBloqueada] = useState("");
  const [activateVistaFechaBloqueada, setActiveVistaFechaBloqueada] =
    useState(false);
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

  /***************************************** HORARIOS ****************************************/
  const [datosHorarios, setDatosHorarios] = useState([]);
  const [activateVistaHorario, setActiveVistaHorario] = useState(false);

  function loadHorarios() {
    getHorarios().then(setListaHorarios);
    setActiveVistaHorario(!activateVistaHorario);
  }

  function detectarCambio(id, value, campo) {
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

  /***************************************** TURNOS ****************************************/

  const [datosTurnos, setDatosTurnos] = useState([]);
  const [activateVistaTurno, setActiveVistaTurno] = useState(false);
  const turnos = ["Mañana", "Tarde", "Noche"];

  function loadTurnos() {
    getTurnos().then(setListaTurnos);
    setActiveVistaTurno(!activateVistaTurno);
  }

  function detectarCambio(id, value, campo) {
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
        setDatosHorarios([]);
        loadTurnos();
      });
    }
  }

  return (
    <div className="container-fluid">
      <div className="container h-100 p-0">
        <h1 className="mt-3">Disponibilidad</h1>

        <div
          style={{
            borderRadius: "5px",
            background: "#F0F0F0",
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(15, 1fr)",
            gridTemplateRows: "repeat(6, 1fr)",
            gap: "10px",
            padding: "10px",
            width: "100%",
            height: "700px",
          }}
        >
          {/*************************************** HORARIOS *************************************************/}
          <div
            className="bg-warning d-flex flex-column gap-3"
            style={{ gridRow: "1/5", gridColumn: "1/7" }}
          >
            <div className="d-flex justify-content-around bg-secondary py-1">
              <h4 className="mb-0 p-2">Horarios</h4>

              <div
                className="justify-content-end w-50"
                style={{ display: `${activateVistaHorario ? "none" : "flex"}` }}
              >
                <button
                  className="btn btn-info p-0"
                  onClick={() => setActiveVistaHorario(!activateVistaHorario)}
                >
                  Editar
                </button>
              </div>

              <div
                className="justify-content-end w-50  gap-3"
                style={{ display: `${activateVistaHorario ? "flex" : "none"}` }}
              >
                <button
                  className="btn btn-info py-0"
                  onClick={() => actualizarHorarios()}
                >
                  Actualizar
                </button>
                <button
                  className="btn btn-danger  py-0"
                  onClick={() => setActiveVistaHorario(!activateVistaHorario)}
                >
                  X
                </button>
              </div>
            </div>

            <div
              className="flex-column gap-2"
              style={{ display: `${activateVistaHorario ? "none" : "flex"}` }}
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
                    style={{ height: "45px" }}
                    className="d-flex justify-content-center align-items-center gap-4"
                  >
                    <div className="" style={{ width: "100px" }}>
                      <span className="fw-bold">{horario.diaSemana}</span>
                    </div>

                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ width: "200px" }}
                    >
                      <span className="">
                        {horario.horaApertura} am - {horario.horaCierre} pm
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            {/***************** VISTA EDITAR *****************/}
            <div
              className="flex-column bg-success gap-2"
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
                    className="d-flex justify-content-around align-items-center bg-info px-3 gap-0"
                    style={{ height: "45px" }}
                  >
                    <label className="fw-bold" style={{ width: "70px" }}>
                      {horario.diaSemana}
                    </label>

                    {/* Input hora apertura */}
                    <input
                      className="text-center form-control w-25"
                      type="time"
                      value={horario.horaApertura}
                      onChange={(e) =>
                        detectarCambio(
                          horario.id,
                          e.target.value,
                          "horaApertura"
                        )
                      }
                    />
                    <span>AM</span>
                    {/* Input hora cierre */}
                    <input
                      className="text-center form-control w-25"
                      type="time"
                      value={horario.horaCierre}
                      onChange={(e) =>
                        detectarCambio(horario.id, e.target.value, "horaCierre")
                      }
                    />
                    <span>PM</span>
                  </div>
                ))}
            </div>
          </div>

          {/*************************************** TURNOS *************************************************/}
          <div
            className="bg-success d-flex flex-column gap-2"
            style={{ gridRow: "5/7", gridColumn: "1/7" }}
          >
            <div className="d-flex justify-content-around bg-danger py-1">
              <h4 className="mb-0 p-2">Turnos</h4>
              <div
                className="justify-content-end w-50"
                style={{ display: `${activateVistaTurno ? "none" : "flex"}` }}
              >
                <button
                  className="btn btn-info p-0"
                  onClick={() => setActiveVistaTurno(!activateVistaTurno)}
                >
                  Editar
                </button>
              </div>

              <div
                className="justify-content-end w-50  gap-3"
                style={{ display: `${activateVistaTurno ? "flex" : "none"}` }}
              >
                <button
                  className="btn btn-info py-0"
                  onClick={() => actualizarTurnos()}
                >
                  Actualizar
                </button>
                <button
                  className="btn btn-danger  py-0"
                  onClick={() => setActiveVistaTurno(!activateVistaTurno)}
                >
                  X
                </button>
              </div>
            </div>

            <div
              className="flex-column gap-2"
              style={{ display: `${activateVistaTurno ? "none" : "flex"}` }}
            >
              {listaTurnos
                .sort(
                  (a, b) => turnos.indexOf(a.turno) - turnos.indexOf(b.turno)
                )
                .map((turno) => (
                  <div
                    key={turno.id}
                    style={{ height: "45px" }}
                    className="d-flex justify-content-center align-items-center gap-4"
                  >
                    <div className="" style={{ width: "100px" }}>
                      <span className="fw-bold">{turno.turno}</span>
                    </div>

                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ width: "200px" }}
                    >
                      <span className="">
                        {turno.horaInicio} am - {turno.horaFin} pm
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {/***************** VISTA EDITAR *****************/}
            <div
              className="flex-column bg-success gap-2"
              style={{ display: `${activateVistaTurno ? "flex" : "none"}` }}
            >
              {listaTurnos
                .sort(
                  (a, b) => turnos.indexOf(a.turno) - turnos.indexOf(b.turno)
                )
                .map((turno) => (
                  <div
                    key={turno.id}
                    className="d-flex justify-content-around align-items-center bg-info px-3 gap-0"
                    style={{ height: "45px" }}
                  >
                    <label className="fw-bold" style={{ width: "70px" }}>
                      {turno.turno}
                    </label>

                    {/* Input hora apertura */}
                    <input
                      className="text-center form-control w-25"
                      type="time"
                      value={turno.horaInicio}
                      onChange={(e) =>
                        detectarCambio(
                          turno.id,
                          e.target.value,
                          "horaInicio"
                        )
                      }
                    />
                    <span>AM</span>
                    {/* Input hora cierre */}
                    <input
                      className="text-center form-control w-25"
                      type="time"
                      value={turno.horaFin}
                      onChange={(e) =>
                        detectarCambio(turno.id, e.target.value, "horaFin")
                      }
                    />
                    <span>PM</span>
                  </div>
                ))}
            </div>
          </div>
          {/*************************************** FECHAS BLOQUEADAS *************************************************/}
          <div
            className="d-flex flex-column bg-warning gap-3"
            style={{ gridRow: "1/7", gridColumn: "7/16" }}
          >
            <div className="d-flex justify-content-center bg-danger py-2">
              <h4 className="bg-danger text-center">Fechas Bloqueadas</h4>
            </div>

            <div className="d-flex justify-content-end">
              <button
                className="btn btn-success w-100 justify-content-center"
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
                  className="btn btn-danger justify-content-center"
                  onClick={() => formatearFechas()}
                >
                  X
                </button>
              </div>
            </div>

            {/***************** LISTADO *****************/}
            <div
              className="flex-column gap-2"
              style={{
                display: `${activateVistaFechaBloqueada ? "none" : "flex"}`,
              }}
            >
              {listaFechasBloqueadas.map((fecha) => {
                const [yyyy, mm, dd] = fecha.fecha.split("-");

                const fechaFormateada = dd + "-" + mm + "-" + yyyy;
                return (
                  <div
                    key={fecha.id}
                    style={{ height: "45px" }}
                    className="bg-success d-flex justify-content-around align-items-center p-3"
                  >
                    <div className="" style={{ width: "100px" }}>
                      <span className="fw-bold">{fechaFormateada}</span>
                    </div>

                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ width: "200px" }}
                    >
                      <span className="">{fecha.motivo}</span>
                    </div>

                    <div className="d-flex justify-content-end w-25 gap-2">
                      <button
                        className="btn btn-info"
                        onClick={() => editarFechaBloqueada(fecha)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => eliminarFecha(fecha.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/***************** VISTA EDITAR *****************/}
            <div
              className="flex-column p-3"
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
