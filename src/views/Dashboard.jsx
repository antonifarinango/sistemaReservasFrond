import React, { useState, useEffect } from "react";

import {
  getReservasDia,
  getReservasPendientes,
  getReservasProximas,
} from "../service/reservasService";

export default function Dashboard() {
  const [listaDia, setListaDia] = useState([]);
  const [listaPendientes, setListaPendientes] = useState([]);
  const [listaProximas, setListaProximas] = useState([]);

  useEffect(() => {
    getReservasDia().then(setListaDia);
    getReservasPendientes().then(setListaPendientes);
    getReservasProximas().then(setListaProximas);
  }, [listaDia, listaPendientes, listaProximas]);

  return (
    <div className="container h-100 p-0 d-flex align-items-center">
      <div
        style={{
          borderRadius: "5px",
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gridTemplateRows: "repeat(5, 1fr)",
          gap: "10px",
          width: "100%",
          height: "750px",
        }}
      >
        <div
          className="d-flex flex-column gap-2 justify-content-center align-items-center"
          style={{ gridColumn: "1/4", gridRow: "1/3" }}
        >
          <div
            className="bg-warning d-flex w-100 align-items-center justify-content-center"
            style={{ height: "60px", borderRadius: "16px" }}
          >
            <h4>Ocupación</h4>
          </div>

          <div
            className="d-flex flex-grow-1 w-100 align-items-center justify-content-center"
            style={{ borderRadius: "16px", boxSizing: "border-box" }}
          >
            <div
              className="bg-primary d-flex justify-content-center align-items-center"
              style={{
                borderRadius: "100%",
                height: "100%",
                width: "60%",
                padding: "6px",
                border: "3px dashed #fff",
              }}
            >
              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  borderRadius: "100%",
                  height: "100%",
                  width: "100%",
                  border: "3px dashed #fff",
                }}
              >
                <span className="fw-semibold" style={{ fontSize: "70px" }}>
                  70%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="d-flex flex-column justify-content-center align-items-center gap-2"
          style={{ gridColumn: "4/6", gridRow: "1/3" }}
        >
          <div
            className="bg-success d-flex w-100 align-items-center justify-content-center"
            style={{ height: "60px", borderRadius: "16px" }}
          >
            <h4>Reservas Pendientes</h4>
          </div>
          <div
            className="bg-primary d-flex flex-grow-1 w-100 align-items-center justify-content-center"
            style={{ borderRadius: "16px" }}
          >
            <span className="" style={{ fontSize: "120px" }}>
              {listaPendientes.length}
            </span>
          </div>
        </div>
        <div
          className="d-flex flex-column gap-2"
          style={{ gridColumn: "1/6", gridRow: "3/6" }}
        >
          <div
            className="bg-secondary d-flex w-100 align-items-center justify-content-center"
            style={{ height: "60px", borderRadius: "16px" }}
          >
            <h4>Reservas para hoy</h4>
          </div>
          <div
            className="bg-primary d-flex flex-grow-1 flex-column w-100 align-items-start justify-content-start gap-2"
            style={{ borderRadius: "16px", padding: "10px 7px" }}
          >
            {listaDia.map((reserva) => (
              <div
                key={reserva.id}
                className="container bg-danger d-flex justify-content-center align-items-center"
                style={{ borderRadius: "14px", height: "50px" }}
              >
                <div
                  className="col-3 d-flex justify-content-center align-items-center"
                  style={{ borderRight: "3px solid #fff", height: "50%" }}
                >
                  d
                </div>
                <div
                  className="col-3 d-flex justify-content-center align-items-center"
                  style={{ borderRight: "3px solid #fff", height: "50%" }}
                >
                  f
                </div>
                <div
                  className="col-3 d-flex justify-content-center align-items-center"
                  style={{ borderRight: "3px solid #fff", height: "50%" }}
                >
                  d
                </div>
                <div
                  className="col-4 d-flex justify-content-center align-items-center"
                  style={{}}
                >
                  d
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="gap-2 d-flex flex-column"
          style={{ gridColumn: "6/11", gridRow: "1/6" }}
        >
          <div
            className="bg-warning d-flex w-100 align-items-center justify-content-center"
            style={{ height: "60px", borderRadius: "16px" }}
          >
            <h4>Reservas Pendientes</h4>
          </div>
          <div
            className="bg-primary d-flex flex-grow-1 w-100 align-items-start justify-content-start flex-column gap-2"
            style={{ borderRadius: "16px", padding: "10px 7px" }}
          >
            {listaProximas.map((reserva) => (
              <div
                key={reserva.id}
                className="container bg-danger d-flex justify-content-center align-items-center"
                style={{ borderRadius: "14px", height: "50px" }}
              >
                <div
                  className="col-3 d-flex justify-content-center align-items-center"
                  style={{ borderRight: "3px solid #fff", height: "50%" }}
                >
                  d
                </div>
                <div
                  className="col-3 d-flex justify-content-center align-items-center"
                  style={{ borderRight: "3px solid #fff", height: "50%" }}
                >
                  f
                </div>
                <div
                  className="col-3 d-flex justify-content-center align-items-center"
                  style={{ borderRight: "3px solid #fff", height: "50%" }}
                >
                  d
                </div>
                <div
                  className="col-4 d-flex justify-content-center align-items-center"
                  style={{}}
                >
                  d
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
