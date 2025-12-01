import { fetchApiGet } from "../utils/api-fetch-factory.util";

export const getClients = async (navigate) => {
    const response = await fetchApiGet('/user/clients', navigate, 'Error al obtener los clientes');
    return response;
};