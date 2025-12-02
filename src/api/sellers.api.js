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

export const getCompleteInfoSeller = async (navigate) => {
    const response = await fetchApiGet('/user/complete-info-seller', navigate, 'Error al obtener la informacion del vendedor');
    return response;
};

export const desactivateSeller = async (userId, navigate) => {
    const response = await fetchApiPostWithParams(`/user/${userId}/desactivate-seller`,
        navigate, 'Error al desactivar vendedor', 'PATCH');
    return response;
};
export const activateSeller = async (userId, navigate) => {
    const response = await fetchApiPostWithParams(`/user/${userId}/activate-seller`,
        navigate, 'Error al activar vendedor', 'PATCH');
    return response;
};