import React from "react";
import { Link } from "react-router-dom";

export default function VistaCliente(){

    return(
        <div className="d-flex">
            <nav>
                <li className="btn btn-success"><Link className="text-light" to="/registro">Registrarse</Link></li>
                <li className="btn btn-primary"><Link className="text-light"  to="/login">Log in</Link></li>
            </nav>
        </div>
    )

}