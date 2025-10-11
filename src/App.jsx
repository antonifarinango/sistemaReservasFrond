import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route} from "react-router-dom";


//COMPONENTES
import ProtectedRoute from "./components/ProtectedRoute";

//VISTAS
import Administracion from "./views/Administracion";
import VistaCliente from "./views/VistaCliente";
import Login from "./views/Login";



function App() {
  
  return (

    <BrowserRouter>
        <Routes>
          <Route path="/administracion" element={<ProtectedRoute><Administracion/></ProtectedRoute>}/>
          <Route path="/" element={<VistaCliente/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </BrowserRouter>

  );
}

export default App;
