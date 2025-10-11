// authService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/login";

export const loggearse = async (data) => {
  try {
    const response = await axios.post(API_URL, data);

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
