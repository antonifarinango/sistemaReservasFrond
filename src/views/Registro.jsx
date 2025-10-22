import React, { useState} from "react";


//SERVICIOS
import { postRegistrarUsuario } from "../service/loginService";

export default function Registro() {

    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        password: "",
        telefono: "",
    });

    //OBTENER DATOS DE FORMULARIO
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    //REGISTRAR CLIENTE
    const registrarCliente = (e) => {

        e.preventDefault();
        console.log(formData);
        postRegistrarUsuario(formData);

        setFormData({
            nombre: "",
            email: "",
            password: "",
            telefono: "",
        })

    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div
                className="card shadow-lg p-4"
                style={{ width: "100%", maxWidth: "400px", borderRadius: "1rem" }}
            >
                <h3 className="text-center mb-4 text-primary fw-bold">Registro</h3>

                <form onSubmit={registrarCliente}>
                    {/* Nombre */}
                    <div className="mb-3">
                        <label className="form-label">Nombre completo</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ingrese su nombre"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label">Correo electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ejemplo@correo.com"
                            required
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Ingrese una contraseña"
                            required
                        />
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="mb-3">
                        <label className="form-label">Teléfono</label>
                        <input
                            type="text"
                            className="form-control"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="Ingrese un número de teléfono"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Registrarse
                    </button>

                    <div className="text-center mt-3">
                        <small>
                            ¿Ya tienes una cuenta?{" "}
                            <a href="/login" className="text-decoration-none text-primary">
                                Inicia sesión
                            </a>
                        </small>
                    </div>
                </form>
            </div>
        </div>
    );
}

