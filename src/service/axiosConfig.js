
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// Interceptor de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem("token");
      window.location.href = "/login";
    }else{
    }
    return Promise.reject(error);
  }
  
);

export default api;
