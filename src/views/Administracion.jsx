import React from "react";
import { useState, useEffect } from "react";
import Menu from "../components/MenuNavegación";

import { useWebSocketReserva } from "../hooks/useWebSocketReserva";
import { formatearFecha } from "../service/formatearFechaHora";
import { formatearHora } from "../service/formatearFechaHora";

//VISTAS
import Mesas from "./Mesas";
import Reservas from "./Reservas";
import Dashboard from "./Dashboard";
import Clientes from "./Clientes";
import Disponibilidad from "./Disponibilidad";
import Configuracion from "./Configuracion";
import { useNavigate } from "react-router-dom";

export default function Administracion() {
  const [view, setView] = useState("dashboard");
  const [showSidebar, setShowSidebar] = useState(true);

  const navigate = useNavigate();

  //Cerrar sesion
  function cerrarSesion() {

    localStorage.removeItem("token");
    navigate("/");

  }

  const [listaPush, setListaPush] = useState([]);
  let colorPush = "#7781b8ff";

  // Escucha los envios
  useWebSocketReserva((notificacion) => {
    if (notificacion.tipoNotificacion === "CREACION" || notificacion.tipoNotificacion === "MODIFICACION") {
      setListaPush(prev => [...prev, notificacion]);
    }
  });

  useEffect(() => {
    if (listaPush.length === 0) return;

    const interval = setInterval(() => {
      setListaPush(prev => prev.slice(1));
    }, 5000);

    return () => clearInterval(interval);
  }, [listaPush]);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Menu show={showSidebar} setShow={setShowSidebar} setView={setView} />

      <div className="bg-white flex-grow-1 d-flex flex-column align-items-center">
        <div className="container-fluid d-flex align-items-center justify-content-between" style={{ height: "60px", backgroundColor: "#45537A", boxShadow: "-1px 1px 18px rgba(0, 0, 0, 0.3)" }} >
          <button className="btn btn-secondary text-light border-0 btn-outline-danger ms-5" onClick={() => setShowSidebar(!showSidebar)}>
            ☰
          </button>
               
          {/*NOTIFICACION PUSH*/}
          <div className="container-push-visible"
          >
            {listaPush.map((push, index) => {

              const [fechaReserva, hora] = push.fecha.split("T");
              const isModificacion = push.tipoNotificacion === "MODIFICACION";
              const bgColor = isModificacion ? "#ffc107" : colorPush;
              const titleText = isModificacion ? "¡Reserva Modificada!" : "Nueva Reserva";
              const titleColor = isModificacion ? "#000" : "#fff";

              return (
                <div key={index} className="bg-light rounded push-visible text-black d-flex flex-column justify-content-between mb-2 shadow-sm"
                  style={{ borderLeft: `7px solid ${bgColor}` }}>
                  <div className="w-100 text-center fw-bold py-1" style={{ backgroundColor: bgColor, color: titleColor }}>
                    {titleText}
                  </div>
                  <div className="d-flex w-100">
                    <div className="flex-grow-1 p-2 d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="mb-0">Fecha : </h6><p className="mb-0">{formatearFecha(fechaReserva)}</p>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="mb-0">Hora : </h6><p className="mb-0">{formatearHora(hora)}</p>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="mb-0">Estado : </h6><p className="mb-0">{push.estadoReserva}</p>
                      </div>
                    </div>

                    <div className="col-3 d-flex flex-column"
                      style={{ border: `5px solid ${bgColor}` }}>
                      <div className="text-center fs-6 fw-bold"
                        style={{ border: `2px solid ${bgColor}`, backgroundColor: `${bgColor}`, color: titleColor }}>
                        Mesa
                      </div>
                      <div className="d-flex flex-grow-1 justify-content-center align-items-center fs-3"
                        style={{ border: `2px solid ${bgColor}`, backgroundColor: `${bgColor}` }}>
                        <p className="mb-0 bg-light w-100 text-center rounded text-dark fw-bold">{push.mesa.numero}</p>
                      </div>
                    </div>
                  </div>
                </div>)
            })}
          </div>
          <button className="btn btn-success me-5" onClick={(() => cerrarSesion())}>Cerrar Sesión</button>
        </div>

        {/* Contenido principal */}
       <div
  className="responsive-contenedor-general px-3 d-flex flex-column"
  style={{
    width: "100%",
    height: showSidebar ? "350px" : ""
  }}
>
  <div style={{ display: view === "dashboard" ? "flex" : "none" }}>
    <Dashboard />
  </div>
  <div style={{ display: view === "mesas" ? "flex" : "none" }}>
    <Mesas />
  </div>
  <div style={{ display: view === "reservas" ? "flex" : "none" }}>
    <Reservas />
  </div>
  <div style={{ display: view === "clientes" ? "flex" : "none" }}>
    <Clientes />
  </div>
  <div style={{ display: view === "disponibilidad" ? "flex" : "none" }}>
    <Disponibilidad />
  </div>
  <div style={{ display: view === "configuracion" ? "flex" : "none" }}>
    <Configuracion />
  </div>
</div>


      </div>

    </div>
  );
}
