// authService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const loggearse = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);

    const { token } = response.data;

    if (token) {
      localStorage.setItem("token", token);
    }

    return response.data; // devuelve datos del token
    
  } catch (error) {
    console.error("Error en login:", error);
    throw error; // manejar los errores en el frontend.
  }
};

export const postRegistrarUsuario = async (datos) => {

  try {
    const response = await axios.post(`${API_URL}/register`, datos);
    const { mensaje, usuario: usuarioCreado } = response.data;

    alert(mensaje);
    window.location.href = "/reserva"; 
    return usuarioCreado;

  } catch (error) {
    alert(error.response.data.error);
    window.location.href = "/registro"; 
  }

}




