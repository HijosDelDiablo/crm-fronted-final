import { fetchHeader } from "../utils/fetch-header.util";

export const getSalesReport = async(startDate,endDate, navigate) => {
    const response = await fetch(import.meta.env.VITE_APP_API_URL + '/dashboard/reporte-ventas?startDate='
        +startDate+'&endDate='+endDate, {
            method: 'GET',
            ...fetchHeader()
        });
        if(response.ok){
            return response.json();
        }else{
            if(response.status === 401) navigate('/login');
            console.error('Error al obtener el reporte de ventas');
            return null;
        }
};

export const getTopProducts = async(navigate) => {
    const response = await fetch(import.meta.env.VITE_APP_API_URL + '/dashboard/top-productos', {
            method: 'GET',
            ...fetchHeader()
        });
        if(response.ok){
            return response.json();
        }else{
            if(response.status === 401) navigate('/login');
            console.error('Error al obtener el top de productos');
            return null;
        }
};

export const getTopSellers = async(navigate) => {
    const response = await fetch(import.meta.env.VITE_APP_API_URL + '/dashboard/top-vendedores', {
            method: 'GET',
            ...fetchHeader()
        });
        if(response.ok){
            return response.json();
        }else{
            if(response.status === 401) navigate('/login');
            console.error('Error al obtener el top de vendedores');
            return null;
        }
}

export const getFavoritesProducts = async(limit=100,year=2025,startWeek=1,endWeek=52,navigate) => {
    const response = await fetch(import.meta.env.VITE_APP_API_URL + '/statistics/favorites/top/'+
        '?limit='+limit+'&year='+year+'&startWeek='+startWeek+'&endWeek='+endWeek, {
            method: 'GET',
            ...fetchHeader()
        });
        if(response.ok){
            if(response.status === 401) navigate('/login');
            return response.json();
        }else{
            console.error('Error al obtener el los autos favoritos de los usuarios');
            return null;
        }
};
export const getFavoriteHistory = async(idProduct, navigate) => {
    const response = await fetch(import.meta.env.VITE_APP_API_URL + '/statistics/favorite/history/'+idProduct, {
            method: 'GET',
            ...fetchHeader()
        });
        if(response.ok){
            return response.json();
        }else{
            if(response.status === 401) navigate('/login');
            console.error('Error al obtener el el historial de favoritos del auto');
            return null;
        }
};

export const getSellerWithMoreActivity = async(navigate) => {
    const response = await fetch(import.meta.env.VITE_APP_API_URL + '/statistics/seller-with-more-activity', {
            method: 'GET',
            ...fetchHeader()
        });
        if(response.ok){
            return response.json();
        }else{
            if(response.status === 401) navigate('/login');
            console.error('Error al obtener el vendedor con más actividad');
            return null;
        }
};