import { fetchApiGet, fetchApiPost } from "../utils/api-fetch-factory.util";

export const createGasto = async (gastoData, navigate) => {
    return await fetchApiPost('/gastos', gastoData, navigate, 'Error al registrar gasto');
};

export const getGastos = async (navigate) => {
    return await fetchApiGet('/gastos', navigate, 'Error al obtener gastos');
};

export const getGastosPorFecha = async (startDate, endDate, navigate) => {
    return await fetchApiGet(`/gastos/rango-fechas?startDate=${startDate}&endDate=${endDate}`, navigate, 'Error al filtrar gastos por fecha');
};

export const getGastosPorCategoria = async (categoria, navigate) => {
    return await fetchApiGet(`/gastos/categoria/${categoria}`, navigate, 'Error al filtrar gastos por categoría');
};

export const getTotalGastos = async (navigate) => {
    return await fetchApiGet('/gastos/total', navigate, 'Error al obtener total de gastos');
};
