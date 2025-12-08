import { fetchApiGet, fetchApiPostWithParams } from "../utils/api-fetch-factory.util";

export const getMyFavorites = async (navigate) => {
    return await fetchApiGet('/favorites-user', navigate, 'Error al obtener favoritos');
};

export const addFavorite = async (productId, navigate) => {
    return await fetchApiPostWithParams(`/favorites-user/add/${productId}`, navigate, 'Error al agregar a favoritos', 'POST');
};

export const removeFavorite = async (productId, navigate) => {
    return await fetchApiPostWithParams(`/favorites-user/remove/${productId}`, navigate, 'Error al eliminar de favoritos', 'DELETE');
};
