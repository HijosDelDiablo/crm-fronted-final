import { fetchApiGet, fetchApiPost, fetchApiPatch, fetchApiPostWithParams } from "../utils/api-fetch-factory.util";

export const getAllProducts = async (navigate) => {
    return await fetchApiGet('/products/all', navigate, 'Error al obtener productos');
};

export const getStoreProducts = async (filters = {}, navigate) => {
    const queryParams = new URLSearchParams(filters).toString();
    return await fetchApiGet(`/products/tienda?${queryParams}`, navigate, 'Error al obtener productos de la tienda');
};

export const createProduct = async (productData, navigate) => {
    return await fetchApiPost('/products', productData, navigate, 'Error al crear producto');
};

export const getProductById = async (id, navigate) => {
    return await fetchApiGet(`/products/${id}`, navigate, 'Error al obtener producto');
};

export const updateProduct = async (id, productData, navigate) => {
    return await fetchApiPatch(`/products/${id}`, productData, navigate, 'Error al actualizar producto');
};

export const deleteProduct = async (id, navigate) => {
    return await fetchApiPostWithParams(`/products/${id}`, navigate, 'Error al eliminar producto', 'DELETE');
};

export const uploadProductImage = async (productId, file, navigate) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        const response = await fetch(import.meta.env.VITE_APP_API_URL + `/products/${productId}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            return await response.json();
        } else {
            if (response.status === 401) navigate('/login');
            console.error('Error al subir imagen del producto');
            return null;
        }
    } catch (error) {
        console.error('Error al subir imagen del producto:', error);
        return null;
    }
};