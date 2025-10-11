import React, { useEffect, useState } from "react";

import { loggearse } from "../service/loginService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const navigate = useNavigate();

  async function obtenerToken() {
    try {
      const data = await loggearse({ usuario: email, contrasenia: pass });
      
      navigate("/administracion");
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert("Credenciales incorrectas");
      } else {
        console.error("Error inesperado", err);
      }
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card mb-3">
        <div className="card-body">
          <label className="form-label">email</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="form-label">Contraseña</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setPass(e.target.value)}
          />

          <button
            className="btn btn-primary w-100 mt-3"
            onClick={() => obtenerToken()}
          >
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
}
