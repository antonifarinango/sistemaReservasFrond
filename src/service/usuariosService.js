import api from "./axiosConfig";

const API_URL = "/usuarios";

export const getUsuarios = async () => {

    const response = await api.get(`${API_URL}/administracion/clientes`, {
        headers : {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    });

    return response.data;

}