// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token); // decodifica el JWT
    const currentTime = Date.now() / 1000; // tiempo actual en segundos

    if (decoded.exp < currentTime) {
      // Si ya expiró, borro el token y mando a login
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Token inválido:", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children; // token válido => deja pasar
}
