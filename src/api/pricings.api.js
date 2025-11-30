import { fetchApiGet } from "../utils/api-fetch-factory.util";

export const getPricings = async (navigate) => {
    const response = await fetchApiGet('/cotizacion/all', navigate, 'Error al obtener las cotizaciones');
    return response;
};