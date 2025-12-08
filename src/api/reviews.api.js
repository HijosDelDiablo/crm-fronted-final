import { fetchApiGet, fetchApiPost } from "../utils/api-fetch-factory.util";

export const createSellerReview = async (reviewData, navigate) => {
    return await fetchApiPost('/seller-review', reviewData, navigate, 'Error al crear reseña');
};

export const getSellerReviews = async (sellerId, navigate) => {
    return await fetchApiGet(`/seller-review/vendedor/${sellerId}`, navigate, 'Error al obtener reseñas del vendedor');
};

export const getAllReviews = async (navigate) => {
    return await fetchApiGet('/seller-review', navigate, 'Error al obtener todas las reseñas');
};
