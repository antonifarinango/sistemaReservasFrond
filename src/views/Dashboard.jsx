import React, { useState, useEffect } from "react";
import { useWebSocketReserva } from "../hooks/useWebSocketReserva";

import {
  getReservasDia,
  getReservasPendientes,
  getReservasProximas,
} from "../service/reservasService";

import { getMesas } from "../service/mesasService";
import { formatearFecha, formatearHora } from "../service/formatearFechaHora";

export default function Dashboard() {
  const [listaDia, setListaDia] = useState([]);
  const [listaPendientes, setListaPendientes] = useState([]);
  const [listaProximas, setListaProximas] = useState([]);
  const [porcentajeOcupacionActual, setPorcentajeOcupacionActual] = useState("0%");
  const [mesasOcupadas, setMesasOcupadas] = useState([]);
  const [mesasTotales, setMesasTotales] = useState([]);

  useEffect(() => {
    getReservasDia().then(setListaDia);
    getReservasPendientes().then(setListaPendientes);
    getReservasProximas().then(setListaProximas);
  }, []);

  useWebSocketReserva(() => {
    getReservasPendientes().then(setListaPendientes);
  });

  //CARGAR MESAS
  useEffect(() => {
    getMesas().then((mesas) => {


      const mesasActivas = mesas.filter((m) => m.activa === true);

      const mesasOcupadas = mesasActivas.filter((m) => m.estadoActual === "Ocupada");
      setMesasOcupadas(mesasOcupadas.length);

      const totalMesas = mesasActivas.length;
      setMesasTotales(totalMesas);

    });
  }, []);

  useEffect(() => {

    if (mesasOcupadas > 0) {
      setPorcentajeOcupacionActual(((mesasOcupadas / mesasTotales) * 100).toFixed(0) + "%");
    } else {
      setPorcentajeOcupacionActual("0%");
    }



  }, [mesasOcupadas]);

  return (
    <div className="responsive-container container"> 
       <div className="responsive-horizontal-dashboard p-2 container-fluid d-flex align-items-center d-flex flex-column mt-5" style={{ backgroundColor: "#F0F0F0" }}>

      <div
      className="responsive-grid-dashboard"
        style={{
          borderRadius: "5px",
          gap: "10px",
          width: "100%",
          height: "auto",
        }}
      >
        <div className="responsive-titulo-dashboard rounded-1">
          <h2>Dashboard</h2>
        </div>
        <div
          className="responsive-porcentaje-dashboard d-flex flex-column gap-2 justify-content-center align-items-center"
        >
          <div
            className="d-flex w-100 align-items-center justify-content-center rounded-1 text-light"
            style={{ height: "50px", backgroundColor: "#45537A" }}
          >
            <h5 className="responsive-h5">Mesas Ocupadas</h5>
          </div>

          <div
            className="d-flex flex-grow-1 w-100 align-items-center justify-content-center rounded-1"
            style={{ boxSizing: "border-box", backgroundColor: "#45537A" }}
          >
                <span className="responsive-span-porcentaje text-light" style={{ fontSize: "55px" }}>
                  {porcentajeOcupacionActual}
                </span>
          </div>
        </div>
        <div
          className="responsive-pendientes-dashboard d-flex flex-column justify-content-center align-items-center gap-2"
          
        >
          <div
            className="d-flex w-100 align-items-center justify-content-center rounded-1 text-light"
            style={{ height: "50px", backgroundColor: "#45537A" }}
          >
            <h5 className="responsive-h5">Reservas Pendientes</h5>
          </div>
          <div
            className="d-flex flex-grow-1 w-100 align-items-center justify-content-center rounded-1 text-light"
            style={{ backgroundColor: "#45537A" }}
          >
            <p className="responsive-p-pendientes" style={{ fontSize: "100px" }}>
              {listaPendientes.length}
            </p>
          </div>
        </div>
        <div
          className="responsive-dia-dashboard d-flex flex-column gap-2"
        >
          <div
            className="card d-flex w-100 align-items-center justify-content-center rounded-1"
            style={{ height: "50px", backgroundColor: "#fff" }}
          >
            <h5 className="responsive-h5">Reservas del día</h5>
          </div>
          <div
            className="card d-flex flex-column w-100 align-items-start justify-content-start gap-2 rounded-1"
            style={{ padding: "10px 7px", backgroundColor: "#fff", height: "422px", overflowY: "auto", overflowX: "hidden", scrollbarColor: "#45537A #fff" }}
          >
            {listaDia.map((reserva) => (
              <div
                key={reserva.id}
                className="container d-flex justify-content-center align-items-center "
                style={{ minHeight: "46px", borderBottom: "1px solid black", backgroundColor: "#e2e2e2ff" }}
              >
                <div
                  className="col-3 d-flex justify-content-center align-items-center"
                  style={{ borderRight: "1px solid #000000ff", height: "50%" }}
                >
                  Mesa {reserva.mesa.numero}
                </div>
                <div
                  className="col-3 d-flex justify-content-center align-items-center"
                  style={{ borderRight: "1px solid #000000ff", height: "50%" }}
                >
                  {reserva.cantidadPersonas} {`${reserva.cantidadPersonas > 1 ? "Personas" : "Persona"}`}
                </div>
                <div
                  className="col-3 d-flex justify-content-center align-items-center"
                  style={{ borderRight: "1px solid #000000ff", height: "50%" }}
                >
                  {formatearHora(reserva.fecha.split("T")[1].split(":").slice(0, 2).join(" : "))}
                </div>
                <div
                  className="col-4 d-flex justify-content-center align-items-center"
                  style={{}}
                >
                  {formatearFecha(reserva.fecha.split("T")[0])}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="responsive-proximas-dashboard gap-2 d-flex flex-column"
        >
          <div
            className="card d-flex w-100 align-items-center justify-content-center rounded-1"
            style={{ height: "50px", backgroundColor: "#fff" }}
          >
            <h5 className="responsive-h5">Próximas reservas</h5>
          </div>
          <div
            className="card d-flex w-100 align-items-start justify-content-start flex-column gap-2 rounded-1"
            style={{ padding: "10px 7px", backgroundColor: "#fff", overflowY: "auto", overflowX: "hidden", scrollbarColor: "#45537A #fff", height: "750px" }}
          >
            {listaProximas
              .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
              .map((reserva) => (
                <div
                  key={reserva.id}
                  className="container d-flex justify-content-center align-items-center"
                  style={{ minHeight: "49px", borderBottom: "1px solid black", backgroundColor: "#e2e2e2ff" }}
                >
                  <div
                    className="col-3 d-flex justify-content-center align-items-center"
                    style={{ borderRight: "1px solid #000000ff", height: "50%" }}
                  >
                    Mesa {reserva.mesa.numero}
                  </div>
                  <div
                    className="col-3 d-flex justify-content-center align-items-center"
                    style={{ borderRight: "1px solid #000000ff", height: "50%" }}
                  >
                    {reserva.cantidadPersonas} {`${reserva.cantidadPersonas > 1 ? "Personas" : "Persona"}`}
                  </div>
                  <div
                    className="col-3 d-flex justify-content-center align-items-center"
                    style={{ borderRight: "1px solid #000000ff", height: "50%" }}
                  >

                    {formatearHora(reserva.fecha.split("T")[1].split(":").slice(0, 2).join(" : "))}
                  </div>
                  <div
                    className="col-4 d-flex justify-content-center align-items-center"
                    style={{}}
                  >
                    {formatearFecha(reserva.fecha.split("T")[0])}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
    </div>
   
  );
}
