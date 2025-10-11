import React, { useEffect, useState } from "react";

//SERVICIOS
import { getUsuarios } from "../service/usuariosService";
import { getHistorialReservas } from "../service/reservasService";

export default function Clientes() {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [idCliente, setIdCliente] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    getUsuarios().then(setListaUsuarios);
  }, []);

  useEffect(()=>{
    if(idCliente != ""){
      getHistorialReservas(idCliente).then(setHistorial);
      console.log( "ID DEL CLIENTE =>  " + idCliente);
    }
  },[idCliente])

  function obtenerIdCliente(id){
    setIdCliente(id);
    setShow(true)
  }
  return (
    <div className="container h-100 p-0">
      <h1 className="mt-3">Clientes</h1>
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
        <div
          className="gap-2 flex-column"
          style={{ gridRow: "1/5", gridColumn: "1/7", display:`${show ? "none" : "flex"}`}}
        >
          <div className="d-flex align-items-center p-2">
            <div
              className="col-3 d-flex justify-content-center align-items-center"
              style={{ borderRight: "3px solid #fff", height: "50%" }}
            >
              <span>Nombre</span>
            </div>
            <div
              className="col-3 d-flex justify-content-center align-items-center"
              style={{ borderRight: "3px solid #fff", height: "50%" }}
            >
              <span>E-Mail</span>
            </div>
            <div
              className="col-3 d-flex justify-content-center align-items-center"
              style={{ borderRight: "3px solid #fff", height: "50%" }}
            >
              <span>Teléfono</span>
            </div>
            <div
              className="col-2 d-flex justify-content-center align-items-center"
              style={{ borderRight: "3px solid #fff", height: "50%" }}
            >
              <span>Reservas Totales</span>
            </div>
            <div
              className="col-1 d-flex justify-content-center align-items-center"
              style={{ height: "50%" }}
            >
            </div>
          </div>
          {listaUsuarios.map((usuario) => (
            <div
              className="d-flex align-items-center p-2"
              key={usuario.id}
            >
              <div
                className="col-3 d-flex justify-content-center align-items-center"
                style={{ borderRight: "3px solid #fff", height: "50%" }}
              >
                {usuario.nombre}
              </div>
              <div
                className="col-3 d-flex justify-content-center align-items-center"
                style={{ borderRight: "3px solid #fff", height: "50%" }}
              >
                {usuario.email}
              </div>
              <div
                className="col-3 d-flex justify-content-center align-items-center"
                style={{ borderRight: "3px solid #fff", height: "50%" }}
              >
                {usuario.telefono}
              </div>
              <div
                className="col-2 d-flex justify-content-center align-items-center"
                style={{  borderRight: "3px solid #fff", height: "50%" }}
              >
                {usuario.reserva.length}
              </div>
              <div
                className="col-1 d-flex justify-content-center align-items-center"
                style={{ height: "50%" }}
              >
                <button className="btn btn-info p-1" onClick={(() => obtenerIdCliente(usuario.id))}>Info</button>
              </div>
            </div>
          ))}
        </div>

          <div className="flex-column gap-2" style={{ gridRow : "1/5", gridColumn : "1/7",display:`${show ? "flex" : "none"}`}}>
          <button className="btn btn-success col-1" onClick={(()=>setShow(false))}>volver</button>
          <h2 className="" >historial</h2>
          <div className="table-responsive w-100">
                <table className="table">
                  <thead className="table-light">
                    <tr className="text-center">
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>C. Personas</th>
                      <th>N° Mesa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((reserva) => {
                      const [soloFecha, soloHora] = reserva.fecha.split("T");
                      const [yyyy, mm, dd] = soloFecha.split("-");
                      const fecha = dd + "-" + mm + "-" + yyyy;
                      return (
                        <tr
                          key={reserva.id}
                          className="text-center align-middle"
                        >
                          <td>{fecha}</td>
                          <td>{soloHora}</td>
                          <td>{reserva.cantidadPersonas}</td>
                          <td>{reserva.mesa.numero}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
          
          </div>

      </div>
    </div>
  );
}
