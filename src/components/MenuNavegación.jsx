import React,{useState} from "react";



//CSS
import '../styles/MenuNavegacion.css'

function Menu({ show, setShow, setView }) {

  const [configOpen, setConfigOpen] = useState(false);
  return (
    <div
      className={`bg-light border-end vh-100 p-3 top-0 start-0  transition-all ${show ? "aparecer" : "desaparecer"}`}
    >
        
      <button className="btn btn-secondary text-light border-0 btn-outline-danger w-100" onClick={() => setShow(false)}>
        Cerrar
      </button>

      <h2 className="fs-4 mb-4 mt-4">Restaurante</h2>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <button className="nav-link text-start" onClick={() => setView("dashboard")}>
            Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link text-start" onClick={() => setView("mesas")}>
            Mesas
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link text-start" onClick={() => setView("reservas")}>
            Reservas
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link text-start" onClick={() => setView("clientes")}>
            Clientes
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link text-start" onClick={() => setView("disponibilidad")}>
            Disponibilidad
          </button>
        </li>
       
        <li className="nav-item">
          <button
            className="nav-link text-start d-flex justify-content-center align-items-center gap-5"
            onClick={() => setConfigOpen(!configOpen)}
          >
            <h6>Configuración</h6>
            <span> {configOpen ? "▲" : " ▼"}</span>
          </button>

          {configOpen && (
            <ul className="nav flex-column ms-3">
              <li>
                <button className="nav-link text-start" onClick={() => setView("restaurante")}>
                  Restaurante
                </button>
              </li>
              <li>
                <button className="nav-link text-start" onClick={() => setView("roles")}>
                  Roles
                </button>
              </li>
            </ul>
          )}
        </li>
      </ul>

    </div>
  );
}

export default Menu;