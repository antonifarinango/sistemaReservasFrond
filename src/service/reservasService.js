import api from "./axiosConfig";

const API_URL = "/reservas";

export const getReservas = async () => {
  const response = await api.get(`${API_URL}/todos`);
  return response.data;
};

export const getReservaId = async (idReserva) => {
  const response = await api.get(`${API_URL}/${idReserva}`);
  return response.data;
};

export const putReserva = async (reserva, idReserva) => {
  try {
    const response = await api.put(
      `${API_URL}/actualizar/${idReserva}`,
      reserva,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      alert(error.response.data.error); // mensaje del backend
    }
  }
};

export const crearReserva = async (reserva) => {
  try {
    const response = await api.post(`${API_URL}/crear`, reserva, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      alert(error.response.data.error); // mensaje del backend
    }
  }
};

export const eliminarReserva = async (idReserva) => {
  const response = await api.delete(`${API_URL}/eliminar/${idReserva}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getReservasDia = async () => {
  const response = await api.get(`${API_URL}/dia`);
  return response.data;
};

export const getReservasPendientes = async () => {
  const response = await api.get(`${API_URL}/pendientes`);
  return response.data;
};

export const getReservasProximas = async () => {
  const response = await api.get(`${API_URL}/proximas`);
  return response.data;
};

export const getHistorialReservas = async (idCliente) => {
  const response = await api.get(`${API_URL}/historial/${idCliente}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
