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

export const getUsuariosRoles = async () =>{

    try {
        const response = await api.get(`${API_URL}/administracion/roles`,{
            headers : {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type" : "application/json"
            }
        })

        return response.data;
    } catch (error) {
        alert(error.response.data.error);
    }

}

export const putUsuariosRoles = async (usuario ,idUsarioRol) =>{

    try {

        const response = await api.put(`${API_URL}/administracion/actualizar/${idUsarioRol}`, usuario ,{
            headers : {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type" : "application/json"
            }
        })

        return response.data;

    } catch (error) {

        alert(error.response.data.error);

    }

}

