import React, { useEffect, useState } from "react";


//ICONOS
import { IoDocumentTextSharp } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";

//SERVICIOS
import { getUsuarios } from "../service/usuariosService";
import { getHistorialReservas } from "../service/reservasService";
import { formatearFecha, formatearHora } from "../service/formatearFechaHora";

export default function Clientes() {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [idCliente, setIdCliente] = useState("");
  const [show, setShow] = useState(false);

  //Obtener usuarios
  useEffect(() => {
    getUsuarios().then(setListaUsuarios);
  }, []);

  useEffect(() => {
    if (idCliente != "") {
      getHistorialReservas(idCliente).then(setHistorial);
    }
  }, [idCliente])

  //Obtener id del cliente
  function obtenerIdCliente(id) {
    setIdCliente(id);
    setShow(true)
  }
  return (
    <div className="responsive-container container">
      <div className="container h-100 p-0">
      <h1 className="responsive-h1 mt-3">Clientes</h1>
      <div
        style={{
          borderRadius: "5px",
          background: "#F0F0F0",
          marginTop: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          gap: "10px",
          padding: "10px 10px 10px 10px",
          width: "100%",
          height: "600px",
        }}
      >

        <div className="flex-column gap-2" style={{ gridRow: "1/5", gridColumn: "1/7", display: `${show ? "none" : "flex"}` }}>
          <div className="table-responsive w-100">
            <table className="table">
              <thead className="table-light">
                <tr className="text-center">
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Reservas</th>
                  <th>Historial</th>
                </tr>
              </thead>
              <tbody>
                {listaUsuarios.map((usuario) => {
                  return (
                    <tr
                      key={usuario.id}
                      className="text-center align-middle"
                    >
                      <td>{usuario.nombre}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.telefono}</td>
                      <td>{usuario.reserva.length}</td>
                      <td><button className="btn p-1 text-light" style={{backgroundColor: "#45537A"}} onClick={(() => obtenerIdCliente(usuario.id))}><IoDocumentTextSharp className="fs-3"/></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex-column gap-2" style={{ gridRow: "1/5", gridColumn: "1/7", display: `${show ? "flex" : "none"}` }}>

          <div className="d-flex justify-content-between align-items-center">
            <h2 className="ms-3" >Historial</h2>
            <button className="me-3 btn btn-success col-1 h-75 p-0" onClick={(() => setShow(false))}><FaArrowLeft className="fs-4"/></button>
          </div>

          <div className="table-responsive w-100">
            <table className="table">
              <thead className="table-light">
                <tr className="text-center">
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>C. Personas</th>
                  <th>Mesa</th>
                </tr>
              </thead>
              <tbody>
                {historial
                  .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                  .map((reserva) => {
                    const [fecha, hora] = reserva.fecha.split("T");
                    return (
                      <tr
                        key={reserva.id}
                        className="text-center align-middle"
                      >
                        <td>{formatearFecha(fecha)}</td>
                        <td>{formatearHora(hora)}</td>
                        <td>{reserva.cantidadPersonas} {reserva.cantidadPersonas > 1 ? "personas" : "persona"}</td>
                        <td>Mesa {reserva.mesa.numero}</td>
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
    
  );
}
