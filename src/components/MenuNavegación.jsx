import React, { useState, useEffect } from "react";
import "../styles/MenuNavegacion.css";
import { jwtDecode } from "jwt-decode";


import { TbLayoutDashboardFilled } from "react-icons/tb";
import { MdTableBar } from "react-icons/md";
import { FaAddressBook } from "react-icons/fa";
import { PiUsersFill } from "react-icons/pi";
import { BsFillStopwatchFill } from "react-icons/bs";
import { FaCog } from "react-icons/fa";

function Menu({ show, setView }) {
  const [rol, setRol] = useState("");

  useEffect(() => {
    // Supone que guardaste el token al iniciar sesión
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRol(decoded.rol);
    }
  }, []);

  return (
    <div
      className={`text-light vh-100 p-3 top-0 start-0 transition-all ${show ? "aparecer" : "desaparecer"
        }`}
      style={{
        backgroundColor: "#45537A",
        boxShadow: "0 0px 4px rgba(0, 0, 0, 1)",
        position: "relative",
      }}
    >
      <h2 className="fs-4 mb-4 text-center">Menú</h2>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-1 fw-semibold" style={{ borderBottom: "1px solid #fff" }}>
          <button className="nav-link w-100 text-start text-light" onClick={() => setView("dashboard")}>
           <TbLayoutDashboardFilled className="mb-1"/> Dashboard
          </button>
        </li>
        <li className="nav-item mb-1 fw-semibold" style={{ borderBottom: "1px solid #fff" }}>
          <button className="nav-link w-100 text-start text-light" onClick={() => setView("mesas")}>
           <MdTableBar className="mb-1"/> Mesas
          </button>
        </li>

        <li className="nav-item mb-1 fw-semibold" style={{ borderBottom: "1px solid #fff" }}>
          <button className="nav-link w-100 text-start text-light" onClick={() => setView("reservas")}>
            <FaAddressBook className="mb-1"/> Reservas
          </button>
        </li>

        <li className="nav-item mb-1 fw-semibold" style={{ borderBottom: "1px solid #fff" }}>
          <button className="nav-link w-100 text-start text-light" onClick={() => setView("clientes")}>
            <PiUsersFill className="mb-1"/> Clientes
          </button>
        </li>

        {/* Visible para todos los roles */}
        {(rol === "ROLE_Superadmin" || rol === "ROLE_Admin") && (
          <>
            <li className="nav-item mb-1 fw-semibold" style={{ borderBottom: "1px solid #fff" }}>
              <button className="nav-link w-100 text-start text-light" onClick={() => setView("disponibilidad")}>
                <BsFillStopwatchFill className="mb-1"/> Disponibilidad
              </button>
            </li>
          </>
        )}


        {/* Visible solo para Admin o Superadmin */}
        {(rol === "ROLE_Superadmin") && (
          <>
            <li className="nav-item mb-1 fw-semibold" style={{ borderBottom: "1px solid #fff" }}>
              <button className="nav-link w-100 text-start text-light" onClick={() => setView("configuracion")}>
                <FaCog className="mb-1"/> Configuración
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Menu;
