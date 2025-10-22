import api from "./axiosConfig";

const API_URL = "restaurantes";

export const putRestaurante  = async (restaurante,idRestaurante) => {

    try {
        
        const response = await api.put(`${API_URL}/actualizar-${idRestaurante}`, restaurante)

        return response.data;

    } catch (error) {
        alert(error.response.data.error);
    }

}

export const getRestauranteId = async (idRestaurante) => {

    try {
        const response = await api.get(`${API_URL}/restaurante-${idRestaurante}`);

        return response.data;

    } catch (error) {
        alert(error.response.data.error)
    }

}
