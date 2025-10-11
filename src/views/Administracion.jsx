import React from "react";
import { useState } from "react";
import Menu from "../components/MenuNavegación";

//VISTAS
import Mesas from "./Mesas";
import Reservas from "./Reservas";
import Dashboard from "./Dashboard";
import Clientes from "./Clientes";
import Disponibilidad from "./Disponibilidad";
import Restaurante from "./Restaurante";
import Roles from "./Roles";

export default function Administracion() {
  const [view, setView] = useState("dashboard");
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="d-flex">
      {/* Botón toggle arriba */}
      {!showSidebar && (
        <div className="top-0 start-0  p-2 vh-100">
          <button
            className="btn btn-primary"
            onClick={() => setShowSidebar(true)}
          >
            ☰
          </button>
        </div>
      )}

      {/* Sidebar */}
      <Menu show={showSidebar} setShow={setShowSidebar} setView={setView} />

      {/* Contenido principal */}
      <div
        className="flex-grow-1 p-4 d-flex justify-content-center"
        style={{
          width: showSidebar ? "calc(100% - 280px)" : "calc(100% - 70px)",
        }}
      >
        {view === "dashboard" && <Dashboard/>}
        {view === "mesas" && <Mesas/>}
        {view === "reservas" && <Reservas/>}
        {view === "clientes" && <Clientes/>}
        {view === "disponibilidad" && <Disponibilidad/>}
        {view === "restaurante" && <Restaurante/>}
        {view === "roles" && <Roles/>}
        
      </div>
    </div>
  );
}
