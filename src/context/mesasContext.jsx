import { createContext, useContext, useState, useEffect } from "react";
import { getMesas } from "../service/mesasService";

const MesasContext = createContext();

export function MesasContextProvider(props){

    const [mesas,setMesas] = useState([]);
    
    const cargarMesas = () => {
        getMesas().then(setMesas).catch(err => console.error(err));
    };

    useEffect(() => {
        cargarMesas();
      }, []);

    const value = {mesas,setMesas,cargarMesas};

    return (
        <MesasContext.Provider value={value}>
            {props.children}
        </MesasContext.Provider>
    )

}

export function useMesasContext(){

    const context = useContext(MesasContext);
    if(!context){
        throw new Error('useMesasContext debe ser usado con un MesaContextProvider');
    }

    return context;


}