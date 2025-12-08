import { fetchApiGet, fetchApiPost } from "../utils/api-fetch-factory.util";

export const createProveedor = async (proveedorData, navigate) => {
    return await fetchApiPost('/proveedores', proveedorData, navigate, 'Error al registrar proveedor');
};

export const getProveedores = async (navigate) => {
    return await fetchApiGet('/proveedores', navigate, 'Error al obtener proveedores');
};

export const getPublicProveedores = async (navigate) => {
    return await fetchApiGet('/proveedores/list', navigate, 'Error al obtener lista de proveedores');
};
