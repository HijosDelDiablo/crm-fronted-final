import { fetchHeader } from "../utils/fetch-header.util";

export const getPricings = async(navigate) => {
    const response = await fetch(import.meta.env.VITE_APP_API_URL + '/cotizacion/all', {
            method: 'GET',
            ...fetchHeader()
        });
        if(response.ok){
            return response.json();
        }else{
            if(response.status === 401) navigate('/login');
            console.error('Error al obtener las cotizaciones');
            return null;
        }
};