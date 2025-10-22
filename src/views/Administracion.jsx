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
    setListaPush(prev => [...prev, notificacion]);
    console.log(notificacion);
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

      <div className="flex-grow-1 d-flex flex-column align-items-center">
        <div className="container-fluid d-flex align-items-center justify-content-between" style={{ height: "60px", backgroundColor: "#45537A", boxShadow: "-1px 1px 18px rgba(0, 0, 0, 0.3)" }} >
          <button className="btn btn-secondary text-light border-0 btn-outline-danger ms-5" onClick={() => setShowSidebar(!showSidebar)}>
            ☰
          </button>

          {/*NOTIFICACION PUSH*/}
          <div className="container-push-visible"
          >
            {listaPush.map((push, index) => {

              const [fechaReserva, hora] = push.fecha.split("T");

              return (
                <div key={index} className="bg-light rounded push-visible text-black d-flex justify-content-between"
                  style={{ borderLeft: `7px solid${colorPush}` }}>
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
                    style={{ border: `5px solid ${colorPush}` }}>
                    <div className="text-center fs-5 text-light"
                      style={{ border: `2px solid ${colorPush}`, backgroundColor: `${colorPush}` }}>
                      Mesa
                    </div>
                    <div className="d-flex flex-grow-1 justify-content-center align-items-center fs-2"
                      style={{ border: `2px solid ${colorPush}`, backgroundColor: `${colorPush}` }}>
                      <p className="mb-0 bg-light w-100 text-center rounded">{push.mesa.numero}</p>
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

          {view === "dashboard" && <Dashboard />}
          {view === "mesas" && <Mesas />}
          {view === "reservas" && <Reservas />}
          {view === "clientes" && <Clientes />}
          {view === "disponibilidad" && <Disponibilidad />}
          {view === "configuracion" && <Configuracion />}

        </div>

      </div>

    </div>
  );
}
