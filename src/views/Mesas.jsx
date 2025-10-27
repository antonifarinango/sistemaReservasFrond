import React, { useState, useEffect } from "react";
import { getMesas, getMesaId, putMesa } from "../service/mesasService";

//ICONOS
import { FaCog } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
//CSS
import "../styles/Mesas.css";
//IMG
import logoMesas from "../assets/logo-mesas.png";
import mesa from "../assets/mesa.png";
import usePosicionesMesas from "../hooks/usePosicionesMesas";

function Mesas() {
  const [mesas, setMesas] = useState([]);
  const [mesaId, setMesaId] = useState({});
  const [showView, setShowView] = useState(false);
  const [numeroMesa, setNumeroMesa] = useState("");
  const [capacidadMesa, setCapacidadMesa] = useState("");
  const [estadoMesa, setEstadoMesa] = useState("");
  const [obtenerId, setObtenerId] = useState("");
  const posiciones = usePosicionesMesas();


  //TRAER MESAS
  useEffect(() => {
    getMesas().then(setMesas);
  }, []);
  
  //OBTENER ID Y ACTIVAR VISTA
  function handleClick(id) {
    setObtenerId(id);
    setShowView(true);
  }

  //OBTENER MESA POR ID
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
      setMesaActiva(mesaId.activa);
    }
  }, [mesaId]);

  //OCUPAR MESA
  function ocuparMesa(id) {
    if (Object.keys(mesaId).length > 0) {
      const modificarMesa = {
        numero: numeroMesa,
        capacidad: capacidadMesa,
        estadoActual: "Ocupada",
        estado: mesaId.estado,
        activa: mesaId.activa
      };
      console.log(mesaId.reservas);
      putMesa(modificarMesa, id).then(() => {
        setShowView(false);
        getMesas().then(setMesas);
      });
    }
  }

  //LIBERAR MESA
  function liberarMesa(id) {
    if (Object.keys(mesaId).length > 0) {
      const modificarMesa = {
        numero: numeroMesa,
        capacidad: capacidadMesa,
        estadoActual: "Libre",
        estado: mesaId.estado,
        activa: mesaId.activa
      };

      putMesa(modificarMesa, id).then(() => {
        setShowView(false);
        getMesas().then(setMesas);
      });
    }
  }

  /******************** CONFIGURACION DE MESAS ***************/

  const [showViewConf, setShowViewConf] = useState(true);
  const [idMesa, setIdMesa] = useState("");
  const [active, setActive] = useState(false);
  const [mesaActiva, setMesaActiva] = useState(true);

  useEffect(() => {
    if (idMesa !== "") {
      getMesaId(idMesa).then(setMesaId);
    }
  }, [idMesa]);


  function handleClickMesaId(id) {
    setIdMesa(id);
    setActive(true);
  }

  //ACTUALIZAR MESA
  function actualizarMesa() {

    if (idMesa) {

      const mesa = {
        numero: numeroMesa,
        capacidad: capacidadMesa,
        estadoActual: estadoMesa,
        estado: mesaId.estado,
        activa: mesaActiva
      }

      putMesa(mesa, idMesa).then(() => {
        getMesas().then(setMesas);
      })

    }

  }

  /******************** FIN CONFIGURACION DE MESAS ***************/


  return (
    <div className="responsive-container container">

      <div className="container-fluid d-flex flex-column">
        <div className={`h-100 ${showView ? "verCardMesa" : "ocultarCardMesa"}`}>
          <div
            className="responsive-card-mesas p-4 rounded-1"
            style={{
              width: "600px",
              height: "700px",
              background: "#ffffffff",
            }}
          >
            <div className="container-fluid d-flex justify-content-between align-items-center">
              <h1 className="responsive-h1">Mesa {mesaId.numero}</h1>
              <button
                className="btn btn-danger h-50"
                onClick={() => setShowView(false)}
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
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="mt-3">Mesas</h1>
            <div>
              <button className={`mt-3 btn ${showViewConf ? "btn-secondary" : "bg-success text-light"} `} onClick={() => setShowViewConf(!showViewConf)}>
                {showViewConf ? <FaCog className="mb-1" /> : <FaArrowLeft className="mb-1" />}



              </button>
            </div>
          </div>


          {/***********************************************CONFIGURACION DE MESAS**************************************************/}
          <div className="responsive-configuracion-mesas rounded-1"
            style={{
              background: "#F0F0F0",
              marginTop: "40px",
              display: `${showViewConf ? "none" : "grid"}`,
              gap: "10px",
              padding: "10px 10px 10px 10px",
              width: "100%",
              height: "700px",
            }}
          >
            <div
              className="responsive-mesasConfig-mesas d-flex flex-column p-2 justify-content-center align-items-center"
              style={{
                gap: "5px",
                backgroundColor: "#fff",
              }}
            >
              <h5 className="responsive-h5-config-mesas text-primary">Mesas</h5>
              {mesas
                .slice()
                .sort((a, b) => a.numero - b.numero)
                .map((mesa) => (
                  <div className="w-75" key={mesa.id}>
                    <button
                      className={`btn w-100 p-1 ${idMesa === mesa.id ? "btn-primary" : "btn-secondary"
                        }`}
                      onClick={() => handleClickMesaId(mesa.id)}
                    >
                      Mesa {mesa.numero}
                    </button>
                  </div>
                ))}
            </div>


            <div className="responsive-edit-mesas" style={{
              gap: "5px",
              backgroundColor: "#fff",
            }}>

              {/* Formulario */}
              <div
                className="p-3 flex-column mt-3"
                style={{
                  display: active ? "flex" : "none",
                  gap: "10px",
                  backgroundColor: "#fff",
                }}
              >
                <h4 className="text-dark fw-semibold">Mesa</h4>


                <label className="text-primary fw-bolder">
                  Número :
                </label>
                <input
                  value={numeroMesa}
                  onChange={(e) => setNumeroMesa(e.target.value)}
                  type="text"
                  className="form-control"
                />

                <label className="text-primary fw-bolder">
                  Capacidad :
                </label>
                <input
                  value={capacidadMesa}
                  onChange={(e) => setCapacidadMesa(e.target.value)}
                  type="number"
                  className="form-control"
                />

                <label className="text-primary fw-bolder">
                  Estado Actual :
                </label>
                <input
                  value={estadoMesa}
                  type="text"
                  className="form-control"
                  disabled
                />

                <label className="text-primary fw-bolder">
                  Estado :
                </label>

                <select className="form-select" name="" id="" value={mesaActiva ? "true" : "false"} onChange={(e) => setMesaActiva(e.target.value === "true")}>

                  <option value="true">Activada</option>
                  <option value="false">Desactivada</option>

                </select>


                <div className="w-100 d-flex justify-content-center mt-4">
                  <button className="w-50 btn btn-success" onClick={() => { actualizarMesa() }} >Actualizar</button>
                </div>

              </div>


            </div>
          </div>

          {/***********************************************FIN CONFIGURACION DE MESAS**************************************************/}
          <div className="responsive-container-mesas rounded-1 p-2"
            style={{
              background: "#F0F0F0",
              marginTop: "40px",
              display: `${showViewConf ? "grid" : "none"}`,
              gridTemplateColumns: "repeat(6, 1fr)",
              gridTemplateRows: "repeat(4, 1fr)",
              gap: "10px",
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
                  className={`responsive-container-div-mesas card rounded-1 ${mesa.activa ? "hover-btn" : "hover-btn-desactivada"}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    ...posiciones[mesa.numero]

                  }}
                >
                  <div className="responsive-mesas card-body">
                    <h5 className="responsive-h5-mesas card-title text-primary fw-bold">
                      Mesa {mesa.numero}
                    </h5>
                    <p className="responsive-p-mesas card-text">
                      <span className="text-dark fw-bolder">Capacidad:</span>{" "}
                      <span className="text-dark fw-bolder">
                        {mesa.capacidad}
                      </span>
                      <br />
                      <span className="text-dark fw-bolder">Estado: </span>
                      <span className={`fw-bolder ${mesa.estadoActual === "Libre" ? "text-success" : "text-danger"}`}>
                        {mesa.estadoActual}
                      </span>
                      <br />
                      <span className="text-dark fw-bolder">Reservada: </span>
                      <span className={`fw-bolder ${mesa.estado === "DISPONIBLE" ? "text-success" : "text-danger"}`}>
                        {mesa.estado == "RESERVADA" ? "Si" : "No"}
                      </span>
                    </p>
                  </div>
                </button>
              ))}

            {/* Imagen de espacio libre siempre visible */}
            <div
              className="card"
              style={{ width: "100%", height: "100%", ...posiciones[17] }}
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
    </div>

  );
}

export default Mesas;
