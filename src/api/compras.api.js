import { fetchApiGet, fetchApiPost, fetchApiPostWithParams } from "../utils/api-fetch-factory.util";

// === FUNCIONES PARA CLIENTE ===
export const getMisCompras = async (navigate) => {
    const response = await fetchApiGet('/compra/mis-compras', navigate, 'Error al obtener mis compras');
    return response;
};

export const getCompraById = async (id, navigate) => {
    const response = await fetchApiGet(`/compra/${id}`, navigate, 'Error al obtener la compra');
    return response;
};

// === FUNCIONES PARA ADMIN ===
export const getComprasPendientes = async (navigate) => {
    const response = await fetchApiGet('/compra/pendientes', navigate, 'Error al obtener compras pendientes');
    return response;
};

export const getComprasEnRevision = async (navigate) => {
    const response = await fetchApiGet('/compra/en-revision', navigate, 'Error al obtener compras en revisión');
    return response;
};

export const getComprasAprobadas = async (navigate) => {
    const response = await fetchApiGet('/compra/aprobadas', navigate, 'Error al obtener compras aprobadas');
    return response;
};

export const getComprasPorCliente = async (clienteId, navigate) => {
    const response = await fetchApiGet(`/compra/por-cliente/${clienteId}`, navigate, 'Error al obtener compras del cliente');
    return response;
};

export const getComprasPorVendedor = async (vendedorId, navigate) => {
    const response = await fetchApiGet(`/compra/por-vendedor/${vendedorId}`, navigate, 'Error al obtener compras del vendedor');
    return response;
};

// === FUNCIONES PARA FLUJOS ESPECIALES ===
export const iniciarProcesoCompra = async (payload, navigate) => {
    const response = await fetchApiPost('/compra/iniciar', payload, navigate, 'Error al iniciar proceso de compra');
    return response;
};

export const evaluarFinanciamiento = async (compraId, payload, navigate) => {
    const response = await fetchApiPost(`/compra/${compraId}/evaluar`, payload, navigate, 'Error al evaluar financiamiento');
    return response;
};

export const aprobarCompra = async (compraId, payload, navigate) => {
    const response = await fetchApiPost(`/compra/${compraId}/aprobar`, payload, navigate, 'Error al aprobar compra');
    return response;
};