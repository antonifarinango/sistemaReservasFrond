// MESAS API
import api from "./axiosConfig";

const API_URL = "/mesas"
export const getMesas = async () => {
  const response = await api.get(`${API_URL}/todos`);
  return response.data;
};

export const getMesaId = async (id) => {
  const response = await api.get(`${API_URL}/administracion/${id}`,{
    headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const putMesa = async (mesa,id) => {
  const response = await api.put(`${API_URL}/administracion/actualizar/${id}`,mesa,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const crearMesas = async (producto) => {
  const response = await api.post(API_URL, producto);
  return response.data;
};
