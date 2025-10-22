import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import './styles/Responsive.css'


//COMPONENTES
import ProtectedRoute from "./components/ProtectedRoute";

//VISTAS
import Administracion from "./views/Administracion";
import Inicio from "./views/Inicio";
import Login from "./views/Login";
import Registro from "./views/Registro";
import ReservaPasoAPaso from "./views/ReservaPasoAPaso";



function App() {
  
  return (

    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio/>}/>
          <Route path="/administracion-superadmin" element={<ProtectedRoute rolPermitido={"ROLE_Superadmin"}><Administracion/></ProtectedRoute>}/>
          <Route path="/administracion-admin" element={<ProtectedRoute rolPermitido={"ROLE_Admin"}><Administracion/></ProtectedRoute>}/>
          <Route path="/administracion-mesero" element={<ProtectedRoute rolPermitido={"ROLE_Mesero"}><Administracion/></ProtectedRoute>}/>
          <Route path="/reserva" element={<ReservaPasoAPaso/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/registro" element={<Registro/>}/>
        </Routes>
      </BrowserRouter>

  );
}

export default App;
