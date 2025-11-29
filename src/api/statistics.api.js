import { fetchApiGet } from "../utils/api-fetch-factory.util";

export const getSalesReport = async (startDate, endDate, navigate) => {
    return await fetchApiGet('/dashboard/reporte-ventas?startDate='
        + startDate + '&endDate=' + endDate, navigate, 'Error al obtener el reporte de ventas')
};

export const getTopProducts = async (navigate) => {
    return await fetchApiGet('/dashboard/top-productos', navigate, 'Error al obtener el top de productos');
};

export const getTopSellers = async (navigate) => {
    return await fetchApiGet('/dashboard/top-vendedores', navigate, 'Error al obtener el top de vendedores');
};

export const getTopSalesByPeriod = async (navigate) => {
    return await fetchApiGet('/dashboard/ventas-periodo', navigate, 'Error al obtener ventas por periodo');
}

export const getFavoritesProducts = async (limit = 100, year = 2025, startWeek = 1, endWeek = 52, navigate) => {
    return await fetchApiGet('/statistics/favorites/top/' +
        '?limit=' + limit + '&year=' + year + '&startWeek=' + startWeek + '&endWeek=' + endWeek, navigate, 'Error al obtener el los autos favoritos de los usuarios');
};
export const getFavoriteHistory = async (idProduct, navigate) => {
    return await fetchApiGet('/statistics/favorite/history/' + idProduct, navigate, 'Error al obtener el el historial de favoritos del auto');
};

export const getSellerWithMoreActivity = async (navigate) => {
    return await fetchApiGet('/statistics/seller-with-more-activity', navigate, 'Error al obtener el vendedor con más actividad');
};
