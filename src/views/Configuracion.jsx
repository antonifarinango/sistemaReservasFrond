import React, { useState, useEffect } from "react";

//SERVICIOS
import { getRestauranteId, putRestaurante } from "../service/restaurante";
import { getUsuariosRoles, putUsuariosRoles } from "../service/usuariosService";

export default function Configuracion() {

  const [restaurante, setRestaurante] = useState([]);
  const [activeVistaRestauranteEditar, setActiveVistaRestauranteEditar] = useState(false);
  const [nombreRestaurante, setNombreRestaurante] = useState("");
  const [descripcionRestaurante, setDescripcioNRestaurante] = useState("");
  const [direccionRestaurante, setDireccionRestaurante] = useState("");
  const [emailRestaurante, setEmailRestaurante] = useState("");
  const [telefonoRestaurante, setTelefonoRestaurante] = useState("");

  //Obtener datos del restaurante
  useEffect(() => {
    getRestauranteId(1).then(setRestaurante);
  }, [])

  //Actualizar datos restaurante
  function actualizarRestaurante(restaurante) {

    if (restaurante != " ") {
      const data = {

        nombre: nombreRestaurante,
        direccion: direccionRestaurante,
        telefono: telefonoRestaurante,
        email: emailRestaurante,
        descripcion: descripcionRestaurante

      }

      putRestaurante(data, restaurante.id).then(() => {

        getRestauranteId(restaurante.id).then(setRestaurante);
        setActiveVistaRestauranteEditar(false);

      })
    }

  }

  //Editar datos restaurante
  function editarRestaurante(restaurante) {

    setNombreRestaurante(restaurante.nombre);
    setDescripcioNRestaurante(restaurante.descripcion);
    setDireccionRestaurante(restaurante.direccion);
    setEmailRestaurante(restaurante.email);
    setTelefonoRestaurante(restaurante.telefono);
    setActiveVistaRestauranteEditar(!activeVistaRestauranteEditar)
  }


  //**************************** ROLES ******************************** */

  const [listaRoles, setListaRoles] = useState([]);
  const [activeVistaRolesEditar, setActiveVistaRolesEditar] = useState(false);

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");
  const [contraseniaUsuario, setContraseniaUsuario] = useState("");
  const [telefonoUsuario, setTelefonoUsuario] = useState("");
  const [rolUsuario, setRolUsuario] = useState("");
  const [idRolUsuario, setIdRolUsuario] = useState(null);

  //Editar rol
  function editarRolUsuario(usuario) {

    setIdRolUsuario(usuario.id);

    setNombreUsuario(usuario.nombre);
    setEmailUsuario(usuario.email);
    setContraseniaUsuario("");

    if (usuario.telefono != null) {
      setTelefonoUsuario(usuario.telefono);
    } else {
      setTelefonoUsuario("");
    }

    setRolUsuario(usuario.rol)

    setActiveVistaRolesEditar(!activeVistaRolesEditar);

  }

  //Formatear datos
  function loadUsuarioRol() {

    setIdRolUsuario("");
    setNombreUsuario("");
    setEmailUsuario("");
    setContraseniaUsuario("");
    setTelefonoUsuario("");
    setRolUsuario("")

    setActiveVistaRolesEditar(false);

  }


  //Actualizar rol
  function actualizarRol() {

    if (idRolUsuario != null) {
      const usuario = {
        nombre: nombreUsuario,
        email: emailUsuario,
        password: contraseniaUsuario,
        telefono: telefonoUsuario,
        rol: rolUsuario

      }

      putUsuariosRoles(usuario, idRolUsuario).then(() => {
        loadUsuarioRol();
      })

    }
  }

  const orden = ["Superadmin", "Admin", "Mesero"];

  useEffect(() => {
    getUsuariosRoles().then(setListaRoles);
  }, [])

  return (
    <div className="container-fluid p-0">
      <div className="container h-100 p-0">
        <h1 className="responsive-h1 mt-3">Restaurante</h1>

        <div className="responsive-configuracion"
          style={{
            borderRadius: "5px",
            background: "#F0F0F0",
            marginTop: "20px",
            display: "grid",
            gap: "10px",
            padding: "10px",
            width: "100%",
            height: "auto"
          }}
        >
          {/********************************  RESTAURANTE **********************************************/}

          <div className="responsive-restaurante-configuracion d-flex flex-column align-items-center">

            <div className="d-flex w-100 justify-content-around align-items-center mb-4 p-2 rounded-1" style={{ backgroundColor: "#45537A", height: "56px" }}>
              <h5 className="responsive-h5 mb-0 text-light">Información del Restaurante</h5>
              <button className="btn btn-info" style={{ display: activeVistaRestauranteEditar ? "none" : "flex" }} onClick={(() => editarRestaurante(restaurante))}>Editar</button>
              <div className="gap-3" style={{ display: activeVistaRestauranteEditar ? "flex" : "none" }}>
                <button className="btn btn-info" onClick={() => actualizarRestaurante(restaurante)}>Guardar</button>
                <button className="btn btn-danger" onClick={(() => setActiveVistaRestauranteEditar(!activeVistaRestauranteEditar))}>X</button>
              </div>

            </div>

            <div className="card container-fluid flex-column align-items-center gap-5 p-3 rounded-1" style={{ display: activeVistaRestauranteEditar ? "none" : "flex" }}>

              <table className="table mb-0">
                <tbody>
                  <tr>
                    <th className="text-white" style={{ width: "150px", backgroundColor: "#45537A" }}>Nombre :</th>
                    <td style={{ background: "#e0e0e08b", borderBottom: "1px solid white" }}>{restaurante.nombre}</td>
                  </tr>
                  <tr>
                    <th colSpan={"2"} className="text-white text-center" style={{ backgroundColor: "#45537A" }}>Descripción :</th>
                  </tr>
                  <tr>
                    <td colSpan={"2"} className="p-4" style={{ minHeight: "200px", background: "#e0e0e08b", borderBottom: "1px solid white" }}>
                      {restaurante.descripcion}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={"2"} className="text-white text-center" style={{ backgroundColor: "#45537A" }}>Dirección :</th>
                  </tr>
                  <tr>
                    <td colSpan={"2"} className="p-4" style={{ minHeight: "200px", background: "#e0e0e08b", borderBottom: "1px solid white" }}>
                      {restaurante.direccion}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-white" style={{ backgroundColor: "#45537A" }}>Email :</th>
                    <td className="" style={{ background: "#e0e0e08b", borderBottom: "1px solid white" }}>{restaurante.email}</td>
                  </tr>
                  <tr>
                    <th className="text-white" style={{ backgroundColor: "#45537A" }}>Teléfono :</th>
                    <td style={{ background: "#e0e0e08b" }}>{restaurante.telefono}</td>
                  </tr>
                </tbody>
              </table>


            </div>

            <div className="card container flex-column align-items-center gap-5 p-3 rounded-3" style={{ display: activeVistaRestauranteEditar ? "flex" : "none" }}>
              <form className="card bg-light d-flex flex-column rounded-3 w-100 p-3" style={{ maxWidth: "800px" }}>
                <div className="mb-3 d-flex justify-content-start gap-3">
                  <label className="col-sm-3 col-form-label text-light rounded px-3" style={{ backgroundColor: "#45537A" }}>
                    Nombre :
                  </label>
                  <div className="col-sm-8 flex-grow-1">
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={nombreRestaurante}
                      onChange={(e) => setNombreRestaurante(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3 d-flex flex-column gap-2">
                  <label className="col-form-label text-light w-100 text-center rounded" style={{ backgroundColor: "#45537A" }}>
                    Descripción :
                  </label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Ingrese la descripción del restaurante"
                    name="descripcion"
                    value={descripcionRestaurante}
                    onChange={(e) => setDescripcioNRestaurante(e.target.value)}
                  ></textarea>
                </div>

                <div className="mb-3 d-flex flex-column gap-2">
                  <label className="col-form-label text-light w-100 text-center rounded" style={{ backgroundColor: "#45537A" }}>
                    Dirección :
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Ingrese la dirección del restaurante"
                    name="direccion"
                    value={direccionRestaurante}
                    onChange={(e) => setDireccionRestaurante(e.target.value)}
                  ></textarea>
                </div>

                <div className="mb-3 d-flex justify-content-start gap-3">
                  <label className="col-sm-3 col-form-label text-light rounded px-3" style={{ backgroundColor: "#45537A" }}>
                    E-mail :
                  </label>
                  <div className="col-sm-8 flex-grow-1">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="ejemplo@correo.com"
                      name="email"
                      value={emailRestaurante}
                      onChange={(e) => setEmailRestaurante(e.target.value)}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-start gap-3">
                  <label className="col-sm-3 col-form-label text-light rounded px-3" style={{ backgroundColor: "#45537A" }}>
                    Teléfono :
                  </label>
                  <div className="col-sm-8 flex-grow-1">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ingrese el teléfono"
                      name="telefono"
                      value={telefonoRestaurante}
                      onChange={(e) => setTelefonoRestaurante(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </div>

          </div>


          {/********************************  ROLES **********************************************/}

          <div className="responsive-roles-configuracion">
            <div className="d-flex w-100 justify-content-around align-items-center mb-4 p-2 rounded-1"
              style={{ backgroundColor: "#45537A" }}>
              <h5 className="responsive-h5 mb-0 p-2 text-light">Roles</h5>
              <div className="gap-3" style={{ display: activeVistaRolesEditar ? "flex" : "none" }}>
                <button className="btn btn-info" onClick={() => actualizarRol()}>Guardar</button>
                <button className="btn btn-danger" onClick={(() => setActiveVistaRolesEditar(!activeVistaRolesEditar))}>X</button>
              </div>
            </div>


            <div className="card container flex-column align-items-center gap-3 p-3 rounded-3" style={{ display: activeVistaRolesEditar ? "none" : "flex" }}>
              {
                listaRoles
                  .sort((a, b) => orden.indexOf(a.rol) - orden.indexOf(b.rol))
                  .map((usuario) => {
                    return (
                      <div key={usuario.id} className="card w-100 bg-light rounded-3 p-3">
                        <div className="bg-light mb-0">
                          <div>
                            <div className="d-flex justify-content-between rounded" style={{ background: "#e0e0e08b", height: "40px" }}>
                              <div className="col-9 d-flex align-items-center fw-semibold">
                                <span className="col-6 ms-3">{usuario.rol}</span>
                              </div>
                              <button className="col-3 btn rounded-0 rounded-end text-light" style={{ backgroundColor: "#45537A" }} onClick={(() => editarRolUsuario(usuario))}>editar</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
              }
            </div>


            <div className="card container flex-column align-items-center gap-5 p-3 rounded-3" style={{ display: activeVistaRolesEditar ? "flex" : "none" }}>
              <div className="card bg-light d-flex flex-column rounded-3 w-100 p-3" style={{ maxWidth: "800px" }}>
                <div className="mb-3 d-flex justify-content-start gap-3">
                  <label className="col-sm-4 col-form-label  text-light rounded px-3" style={{ backgroundColor: "#45537A" }}>
                    Nombre :
                  </label>
                  <div className="col-sm-7 flex-grow-1">
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      placeholder="Ingrese un nuevo usuario"
                      value={nombreUsuario}
                      onChange={(e) => setNombreUsuario(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3 d-flex justify-content-start gap-3">
                  <label className="col-sm-4 col-form-label text-light rounded px-3" style={{ backgroundColor: "#45537A" }}>
                    E-mail :
                  </label>
                  <div className="col-sm-7 flex-grow-1">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Ingrese un E-mail"
                      value={emailUsuario}
                      onChange={(e) => setEmailUsuario(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3 d-flex justify-content-start gap-3">
                  <label className="col-sm-4 col-form-label text-light rounded px-3" style={{ backgroundColor: "#45537A" }}>
                    Contraseña :
                  </label>
                  <div className="col-sm-7 flex-grow-1">
                    <input
                      type="contrasenia"
                      className="form-control"
                      name="contrasenia"
                      placeholder="Ingrese una nueva contraseña"
                      value={contraseniaUsuario || ""}
                      onChange={(e) => setContraseniaUsuario(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3 d-flex justify-content-start gap-3">
                  <label className="col-sm-4 col-form-label text-light rounded px-3" style={{ backgroundColor: "#45537A" }}>
                    Teléfono :
                  </label>
                  <div className="col-sm-7 flex-grow-1">
                    <input
                      type="text"
                      className="form-control"
                      name="telefono"
                      placeholder="Ingrese un número de teléfono"
                      value={telefonoUsuario}
                      onChange={(e) => setTelefonoUsuario(e.target.value)}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-start gap-3">
                  <label className="col-sm-4 col-form-label text-light rounded px-3" style={{ backgroundColor: "#45537A" }}>
                    Rol :
                  </label>
                  <div className="col-sm-7 flex-grow-1">
                    <input
                      type="text"
                      className="form-control"
                      name="rol"
                      value={rolUsuario}
                      onChange={(e) => setRolUsuario(e.target.value)}
                      disabled
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
