import React, { useState } from "react";
import { loggearse } from "../service/loginService";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);
  const navigate = useNavigate();

  async function obtenerToken(e) {
    e.preventDefault();
    try {

      const data = await loggearse({ usuario: email, contrasenia: pass });
      const decoded = jwtDecode(data.token);

      if (decoded.rol == "ROLE_Superadmin") {
        navigate("/administracion-superadmin");
      } else if (decoded.rol == "ROLE_Admin") {
        navigate("/administracion-admin");
      } else if (decoded.rol == "ROLE_Mesero") {
        navigate("/administracion-admin");
      } else if (decoded.rol == "ROLE_Cliente") {
        navigate("/reserva");
      }


      console.log(decoded.rol)



    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert("❌ Credenciales incorrectas");
      } else {
        console.error("Error inesperado", err);
      }
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ width: "100%", maxWidth: "400px", borderRadius: "1rem" }}
      >
        <h3 className="text-center mb-4 text-primary fw-bold">
          Iniciar sesión
        </h3>

        <form onSubmit={obtenerToken}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <div className="input-group">
              <input
                type={mostrarPass ? "text" : "password"}
                className="form-control"
                placeholder="********"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setMostrarPass(!mostrarPass)}
              >
                {mostrarPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Botón Ingresar */}
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Ingresar
          </button>
        </form>

        {/* Enlace opcional */}
        <div className="text-center mt-3">
          <small>
            ¿No tienes cuenta?{" "}
            <a href="/registro" className="text-decoration-none text-primary">
              Regístrate
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}
