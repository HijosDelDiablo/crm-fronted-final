import { fetchApiGet, fetchApiPost } from "../utils/api-fetch-factory.util";

export const getSellersWithNumClients = async (navigate) => {
    const response = await fetchApiGet('/vendedores/vendedores-with-num-clients', navigate, 'Error al obtener los vendedores');
    return response;
};
export const setSellerToClient = async (data, navigate) => {
    const response = await fetchApiPost('/user/set-seller-to-client', data, navigate, 'Error al asignar vendedor a cliente');
    return response;
};
export const setSellerToPricing = async (data, navigate) => {
    const response = await fetchApiPost('/cotizacion/set-seller-to-pricing', data, navigate, 'Error al asignar vendedor a cotizacion');
    return response;
};