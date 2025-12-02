import { fetchApiGet, fetchApiPost, fetchApiPostWithParams } from "../utils/api-fetch-factory.util";

export const getSellersWithNumClients = async (navigate) => {
    const response = await fetchApiGet('/user/vendedores-with-num-clients', navigate, 'Error al obtener los vendedores');
    return response;
};
export const setSellerToClient = async (data, navigate) => {
    const response = await fetchApiPostWithParams(`/user/${data.userId}/set-seller-to-client/${data.sellerId}`,
        navigate, 'Error al asignar vendedor a cliente', 'PATCH');
    return response;
};
export const setSellerToPricing = async (data, navigate) => {
    const response = await fetchApiPostWithParams(`/cotizacion/${data.pricingId}/set-seller-to-pricing/${data.sellerId}`,
        navigate, 'Error al asignar vendedor a cotizacion', 'PATCH');
    return response;
};