import React, { useState, useEffect } from "react";
import { getMesas, getMesaId, putMesa } from "../service/mesasService";
import {
  getReservas,
  getReservaId,
  crearReserva,
  putReserva,
  eliminarReserva, //
} from "../service/reservasService";

export default function Reservas() {
  const [mesas, setMesas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [active, setActive] = useState(false);
  const [idMesa, setIdMesa] = useState("");

  // Estados del form
  const [fechaReserva, setFechaReserva] = useState("");
  const [horaReserva, setHoraReserva] = useState("");
  const [turnoReserva, setTurnoReserva] = useState(null);
  const [cantidadPersonasReserva, setCantidadPersonasReserva] = useState("");

  const [editReservaId, setEditReservaId] = useState(null);
  //CARGAR MESAS
  useEffect(() => {
    getMesas().then(setMesas);
  }, []);

  function handleClickMesaId(id) {
    setIdMesa(id);
  }

  //OBTENER LISTA DE RESERVAS POR MESA
  function loadReservas() {
    if (idMesa) {
      getMesaId(idMesa).then((data) => {
        setReservas(data.reservas || []);
      });
    }
  }
  useEffect(() => {
    loadReservas();
  }, [idMesa]);

  // GUARDAR O ACTUALIZAR
  function guardarReserva() {
    const reserva = {
      fecha: `${fechaReserva}T${horaReserva}:00`,
      turno: turnoReserva,
      cantidadPersonas: cantidadPersonasReserva,
      mesa: idMesa,
    };

    if (editReservaId) {
      // EDITAR
      console.log("id Reserva" + editReservaId);
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
        .catch((err) => console.error("Error creando:", err));
    }
  }

  // RESETEAR FORMULARIO
  function resetForm() {
    setActive(false);
    setEditReservaId(null);
    setFechaReserva("");
    setHoraReserva("");
    setCantidadPersonasReserva("");
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
    setActive(true);
  }

  //ELIMINAR RESERVA
  function borrarReserva(id) {
    eliminarReserva(id)
      .then(() => {
        loadReservas();
      })
      .catch((err) => console.error("Error al eliminar", err));
  }

  //CONFIRMAR RESERVA
  function confirmarReserva(reserva) {
    const res = {
      fecha: reserva.fecha,
      turno: reserva.turno,
      estadoReserva: "Confirmada",
      cantidadPersonas: reserva.cantidadPersonas,
      mesa: reserva.mesa,
    };
    putReserva(res, reserva.id)
      .then(() => {
        loadReservas();
      })
      .catch((err) => console.error("Error al actualizar", err));
  }

  //CANCELAR RESERVA
  function cancelarReserva(reserva) {
    const res = {
      fecha: reserva.fecha,
      turno: reserva.turno,
      estadoReserva: "Pendiente",
      cantidadPersonas: reserva.cantidadPersonas,
      mesa: reserva.mesa,
    };
    putReserva(res, reserva.id)
      .then(() => {
        loadReservas();
      })
      .catch((err) => console.error("Error al actualizar", err));
  }

  return (
    <div className="container-fluid">
      <div className="container h-100 p-0">
        <h1 className="mt-3">Reservas</h1>

        <div
          style={{
            borderRadius: "5px",
            background: "#F0F0F0",
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gridTemplateRows: "repeat(4, 1fr)",
            gap: "10px",
            padding: "10px",
            width: "100%",
            height: "700px",
          }}
        >
          {/* Columna mesas */}
          <div
            className="d-flex flex-column p-2 justify-content-center align-items-center"
            style={{
              gap: "5px",
              gridColumn: "1/ 2",
              gridRow: "1 / 5",
              backgroundColor: "#fff",
            }}
          >
            <h5 className="text-primary">Mesas</h5>
            {mesas
              .slice()
              .sort((a, b) => a.numero - b.numero)
              .map((mesa) => (
                <div className="w-75" key={mesa.id}>
                  <button
                    className={`btn w-100 p-1 ${
                      idMesa === mesa.id ? "btn-primary" : "btn-secondary"
                    }`}
                    onClick={() => handleClickMesaId(mesa.id)}
                  >
                    Mesa {mesa.numero}
                  </button>
                </div>
              ))}
          </div>

          {/* Columna reservas */}
          <div
            className="d-flex flex-column"
            style={{ gridColumn: "2/7", gridRow: "1 / 5" }}
          >
            {/* Header */}
            <div
              className={`container d-flex justify-content-end p-2 ${
                active ? "gap-2" : ""
              }`}
              style={{ backgroundColor: "#fff" }}
            >
              <button
                className="btn btn-success"
                style={{ display: active ? "none" : "flex" }}
                onClick={() => setActive(true)}
              >
                Crear Reserva
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
                />

                <label className="text-primary fw-bolder">
                  Selecciona la hora:
                </label>
                <input
                  value={horaReserva}
                  onChange={(e) => setHoraReserva(e.target.value)}
                  type="time"
                  className="form-control"
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

            {/* Tabla */}
            <div
              className="flex-grow-1 container p-3"
              style={{ display: active ? "none" : "flex", height:"400px"}}
            >
              <div className="table-responsive w-100">
                <table className="table">
                  <thead className="table-light">
                    <tr className="text-center">
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Turno</th>
                      <th>C. Personas</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map((reserva) => {
                      const [soloFecha, soloHora] = reserva.fecha.split("T");
                      const [yyyy, mm, dd] = soloFecha.split("-");
                      const fecha = dd + "-" + mm + "-" + yyyy;
                      return (
                        <tr
                          key={reserva.id}
                          className="text-center align-middle"
                        >
                          <td>{fecha}</td>
                          <td>{soloHora}</td>
                          <td>{reserva.turno}</td>
                          <td>{reserva.cantidadPersonas}</td>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <button
                                className="btn btn-info w-25"
                                onClick={() => editarReserva(reserva)}
                              >
                                E
                              </button>
                              <button
                                className="btn btn-danger w-25"
                                onClick={() => borrarReserva(reserva.id)}
                              >
                                E
                              </button>
                              <button
                                disabled={
                                  reserva.estadoReserva === "Confirmada"
                                }
                                className={`btn w-25 ${reserva.estadoReserva === "Confirmada" ? "btn-secondary": "btn-success"}`}
                                onClick={() => confirmarReserva(reserva)}
                              >
                                C
                              </button>
                              <button
                                disabled={
                                  reserva.estadoReserva === "Pendiente"
                                }
                                className={`btn w-25 ${reserva.estadoReserva === "Confirmada" ? "btn-danger": "btn-secondary"}`}
                                onClick={() => cancelarReserva(reserva)}
                              >
                                Ca
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
          </div>
        </div>
      </div>
    </div>
  );
}
