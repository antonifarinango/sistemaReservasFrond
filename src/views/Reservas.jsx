import React, { useState, useEffect } from "react";
import { useWebSocketReserva } from "../hooks/useWebSocketReserva";

//ICONOS
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { BsClipboardCheckFill } from "react-icons/bs";
import { BsClipboardXFill } from "react-icons/bs";
import { BiSolidDish } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";


//SERVICIOS
import { getMesas, getMesaId } from "../service/mesasService";
import {
  crearReserva,
  putReserva,
  eliminarReserva, //
} from "../service/reservasService";
import { formatearFecha, formatearHora } from "../service/formatearFechaHora";

export default function Reservas() {
  const [mesas, setMesas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [active, setActive] = useState(false);
  const [idMesa, setIdMesa] = useState("");
  const [idReserva, setIdReserva] = useState("");
  const [reservaObtenida, setReservaObtenida] = useState([]);
  const [activeAcciones, setActiveAcciones] = useState(false);

  //ESTADOS DEL FORM 
  const [fechaReserva, setFechaReserva] = useState("");
  const [horaReserva, setHoraReserva] = useState("");
  const [turnoReserva, setTurnoReserva] = useState(null);
  const [cantidadPersonasReserva, setCantidadPersonasReserva] = useState("");
  const [editReservaId, setEditReservaId] = useState(null);
  const [estadoFila, setEstadoFila] = useState("");

  //CARGAR MESAS
  useEffect(() => {
    getMesas().then((mesas) => {

      const mesasActivas = mesas.filter((m) => m.activa === true);
      setMesas(mesasActivas);

    });
  }, []);

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

  useWebSocketReserva(() => {
    loadReservas();
  });

  useEffect(() => {
    loadReservas();
  }, [idMesa]); //

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
        setReservaObtenida(!reservaObtenida.id);
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
      mesa: reserva.mesa
    }
    putReserva(res, reserva.id)
      .then(() => {
        loadReservas();
        setReservaObtenida({ ...reserva, estadoReserva: "Confirmada" });
        setEstadoFila("Confirmada")
        console.log("Confirmada");
        console.log(res);
        console.log(reserva.mesa);
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
      mesa: reserva.mesa
    };
    putReserva(res, reserva.id)
      .then(() => {
        loadReservas();
        setReservaObtenida({ ...reserva, estadoReserva: "Pendiente" });
        setEstadoFila("Pendiente")
        console.log("Cancelada");
        console.log(res);
        console.log(reserva.id);
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
      mesa: reserva.mesa
    };
    putReserva(res, reserva.id)
      .then(() => {
        loadReservas();
        setReservaObtenida({ ...reserva, estadoReserva: estadoFila });
        console.log("Cancelada");
        console.log(res);
        console.log(reserva.id);
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
      mesa: reserva.mesa
    };
    putReserva(res, reserva.id)
      .then(() => {
        loadReservas();
        setReservaObtenida({ ...reserva, estadoReserva: estadoFila });
        console.log("Cancelada");
        console.log(res);
        console.log(reserva.id);
      })
      .catch((err) => console.error("Error al actualizar", err));
  }

  return (
    <div className="responsive-container container">
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
            {mesas
              .slice()
              .sort((a, b) => a.numero - b.numero)
              .map((mesa) => {

                return (

                  <div className="w-75" key={mesa.id}>
                    <button
                      className={`btn w-100 p-1 ${idMesa === mesa.id ? "btn-primary" : "btn-secondary"
                        }`}
                      onClick={() => handleClickMesaId(mesa.id)}
                    >
                      Mesa {mesa.numero}
                    </button>
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
                    disabled={
                      !reservaObtenida.id
                    }
                    className="btn text-light py-0" style={{ backgroundColor: "#45537A", width: "50px", height: "45px" }}
                    onClick={() => editarReserva(reservaObtenida)}
                  >
                    <FaEdit className="fs-4" />
                  </button>

                  <button
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
                    <BsClipboardCheckFill className="fs-4" />
                  </button>

                  <button
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
                    <BsClipboardXFill className="fs-4" />
                  </button>

                  <button
                    className="btn btn-success col-4" style={{ width: "50px", height: "45px" }}
                    disabled={
                      !reservaObtenida.id || reservaObtenida.estadoReserva === "Pendiente"
                    }
                    onClick={() => reservaEnServicio(reservaObtenida)}
                  >
                    <BiSolidDish className="fs-4" />
                  </button>


                  <button
                    className="btn col-4" style={{ backgroundColor: "#45537A", width: "50px", height: "45px" }}
                    disabled={
                      !reservaObtenida.id || reservaObtenida.estadoReserva === "Pendiente"
                    }
                    onClick={() => reservaFinalizada(reservaObtenida)}
                  >
                    <FaCheckCircle className="fs-4 text-light" />
                  </button>

                  <button
                    disabled={
                      !reservaObtenida.id
                    }
                    className="btn btn-danger" style={{ width: "50px", height: "45px" }}
                    onClick={() => borrarReserva(idReserva)}
                  >
                    <MdDeleteForever className="fs-3" />
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
              className="flex-grow-1 container px-0 py-3"
              style={{ display: active ? "none" : "flex", height: "400px" }}
            >
              <div className="table-responsive w-100">
                <table className="table">
                  <thead className="table-light">
                    <tr className="text-center">
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Turno</th>
                      <th>C. Personas</th>
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
