import React, { useState, useEffect } from "react";
import { getMesas, getMesaId, putMesa } from "../service/mesasService";

//CSS
import "../styles/Mesas.css";
//IMG
import logoMesas from "../assets/logo-mesas.png";
import mesa from "../assets/mesa.png";

function Mesas() {
  const [mesas, setMesas] = useState([]);
  const [mesaId, setMesaId] = useState({});
  const [showView, setShowView] = useState(false);
  const [numeroMesa, setNumeroMesa] = useState("");
  const [capacidadMesa, setCapacidadMesa] = useState("");
  const [estadoMesa, setEstadoMesa] = useState("");

  useEffect(() => {
    getMesas().then(setMesas);
  }, []); //showView

  const posiciones = {
    1: { gridColumn: "1 / 2", gridRow: "1 / 2" },
    2: { gridColumn: "1 / 2", gridRow: "2 / 3" },
    3: { gridColumn: "1 / 2", gridRow: "3 / 4" },
    4: { gridColumn: "1 / 2", gridRow: "4 / 5" },
    5: { gridColumn: "2 / 3", gridRow: "3 / 4" },
    6: { gridColumn: "2 / 3", gridRow: "4 / 5" },
    7: { gridColumn: "3 / 4", gridRow: "3 / 4" },
    8: { gridColumn: "3 / 4", gridRow: "4 / 5" },
    9: { gridColumn: "4 / 5", gridRow: "3 / 4" },
    10: { gridColumn: "4 / 5", gridRow: "4 / 5" },
    11: { gridColumn: "5 / 6", gridRow: "3 / 4" },
    12: { gridColumn: "5 / 6", gridRow: "4 / 5" },
    13: { gridColumn: "6 / 7", gridRow: "1 / 2" },
    14: { gridColumn: "6 / 7", gridRow: "2 / 3" },
    15: { gridColumn: "6 / 7", gridRow: "3 / 4" },
    16: { gridColumn: "6 / 7", gridRow: "4 / 5" },
  };

  const [obtenerId, setObtenerId] = useState("");

  function handleClick(id) {
    setObtenerId(id);
    setShowView(true);
  }
  useEffect(() => {
    if (obtenerId) {
      getMesaId(obtenerId).then(setMesaId);
    }
  }, [obtenerId, showView]);

  useEffect(() => {
    if (Object.keys(mesaId).length > 0) {
      setNumeroMesa(mesaId.numero || "");
      setCapacidadMesa(mesaId.capacidad || "");
      setEstadoMesa(mesaId.estadoActual);
    }
  }, [mesaId]);

  function ocuparMesa(id) {
    if (Object.keys(mesaId).length > 0) {
      const modificarMesa = {
        numero: numeroMesa,
        capacidad: capacidadMesa,
        estadoActual: "Ocupada",
        estado: mesaId.estado,
      };
      console.log(mesaId.reservas);
      putMesa(modificarMesa, id).then(() => {
        setShowView(false);
        getMesas().then(setMesas);
      });
    }
  }
  function liberarMesa(id) {
    if (Object.keys(mesaId).length > 0) {
      const modificarMesa = {
        numero: numeroMesa,
        capacidad: capacidadMesa,
        estadoActual: "Libre",
        estado: mesaId.estado,
      };

      putMesa(modificarMesa, id).then(() => {
        setShowView(false);
        getMesas().then(setMesas);
      });
    }
  }
  // Posición fija para la imagen de espacio libre
  const espacioLibre = { gridColumn: "2 / 6", gridRow: "1 / 3" };

  return (
    <div className="container-fluid d-flex flex-column">
      <div className={`h-100  ${showView ? "verCardMesa" : "ocultarCardMesa"}`}>
        <div
          className="p-4"
          style={{
            borderRadius: "5px",
            width: "600px",
            height: "700px",
            background: "#ffffffff",
          }}
        >
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <h1 className="">Mesa {mesaId.numero}</h1>
            <button
              className="btn btn-danger h-50"
              onClick={() => {
                setShowView(false);
              }}
            >
              X
            </button>
          </div>

          <div className="container-fluid p-3 d-flex flex-column  align-items-center gap-3">
            <div>
              <img src={mesa} alt="mesa" />
            </div>

            <div className="d-flex col-10 align-items-center">
              <label className="form-label col-3 mb-0">Mesa :</label>
              <input
                value={numeroMesa}
                type="text"
                className="form-control"
                onChange={(e) => setNumeroMesa(e.target.value)}
                disabled
              />
            </div>
            <div className="d-flex col-10 align-items-center">
              <label className="form-label col-3 mb-0 ">Capacidad :</label>
              <input
                value={capacidadMesa}
                type="text"
                className="form-control"
                onChange={(e) => setCapacidadMesa(e.target.value)}
                disabled
              />
            </div>
            <div className="d-flex col-10 align-items-center">
              <label className="form-label col-3 mb-0 ">Estado :</label>
              <input value={estadoMesa} className="form-control" disabled />
            </div>
          </div>

          <div className="container-fluid d-flex gap-3 justify-content-center mt-4 p-2">
            <button
              className="btn btn-success col-6"
              onClick={() => liberarMesa(mesaId.id)}
            >
              Liberar
            </button>
            <button
              className="btn btn-primary col-6"
              onClick={() => ocuparMesa(mesaId.id)}
            >
              Ocupar
            </button>
          </div>
        </div>
      </div>

      <div className="container h-100 p-0">
        <h1 className="mt-3">Mesas</h1>
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
          {/* Render de mesas */}
          {mesas
            .slice()
            .sort((a, b) => a.numero - b.numero)
            .map((mesa) => (
              <button
                onClick={() => handleClick(mesa.id)}
                key={mesa.id}
                className="card hover-btn"
                style={{
                  width: "100%",
                  height: "100%",
                  ...posiciones[mesa.numero],
                }}
              >
                <div className="card-body">
                  <h5 className="card-title text-primary fw-bold">
                    Mesa {mesa.numero}
                  </h5>
                  <p className="card-text">
                    <span className="text-dark fw-bolder">Capacidad:</span>{" "}
                    <span className="text-dark fw-bolder">
                      {mesa.capacidad}
                    </span>
                    <br />
                    <span className="text-dark fw-bolder">Estado: </span>
                    <span className="text-danger fw-bolder">
                      {mesa.estadoActual}
                    </span>
                    <br />
                    <span className="text-dark fw-bolder">Reservada: </span>
                    <span className="text-danger fw-bolder">
                      {mesa.estado == "RESERVADA" ? "Si" : "No"}
                    </span>
                  </p>
                </div>
              </button>
            ))}

          {/* Imagen de espacio libre siempre visible */}
          <div
            className="card"
            style={{ width: "100%", height: "100%", ...espacioLibre }}
          >
            <img
              src={logoMesas}
              alt="logoRestaurante"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mesas;
