import api from "./axiosConfig";

const API_URL = "/disponibilidad";

export const getTurnos = async () => {
  try {
    const response = await api.get(`${API_URL}/turnos`);
    return response.data;
  } catch (error) {
    console.log("Error al traer la lista de Turnos" + error);
  }
};

export const getHorarios = async () => {
  try {
    const response = await api.get(`${API_URL}/horarios`);
    return response.data;
  } catch (error) {
    console.log("Error al traer la lista de Horarios" + error);
  }
};

export const getHorario = async (diaSemana) => {
  try {
    const response = await api.get(`${API_URL}/horario?dia=${diaSemana}`);
    return response.data;
  } catch (error) {
    console.log("Error al traer el horario del día" + error);
  }
};

export const getFechasBloqueadas = async () => {
  try {
    const response = await api.get(`${API_URL}/fechasBloqueadas`);
    return response.data;
  } catch (error) {
    console.log("Error al traer la lista de Fechas Bloqueadas" + error);
  }
};


export const putTurno = async (turno, idTurno) => {
  try {
    const response = await api.put(`${API_URL}/turno/actualizar-${idTurno}`,turno);
    return response.data;
  } catch (error) {
    console.log("Error al actualizar el turno" + error);
  }
};

export const putHorario = async (horario) => {
  try {
    const response = await api.put(`${API_URL}/horario/actualizar`,horario);
    return response.data;
  } catch (error) {
    console.log("Error al actualizar el horario" + error);
  }
};

export const putFechaBloqueada = async (fechasBloqueada, idFechaBloqueada) => {
  try {
    const response = await api.put(`${API_URL}/fechaBloqueada/actualizar-${idFechaBloqueada}`,fechasBloqueada);
    return response.data;
  } catch (error) {
    console.log("Error al actualizar la Fecha Bloqueda" + error);
  }
};


export const crearFechaBloqueada = async (fechasBloqueada) => {
  try {
    const response = await api.post(`${API_URL}/fechaBloqueada/crear`,fechasBloqueada);
    return response.data;
  } catch (error) {
    console.log("Error al actualizar la Fecha Bloqueda " + error);
  }
};

export const eliminarFechaBloqueada = async (idFechaBloqueada) => {
  const response = await api.delete(`${API_URL}/fechaBloqueada/eliminar-${idFechaBloqueada}`);
  return response.data;
};