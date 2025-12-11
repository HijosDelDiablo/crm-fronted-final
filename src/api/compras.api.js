import { fetchApiGet, fetchApiPost, fetchApiPostWithParams, fetchApiPatch } from "../utils/api-fetch-factory.util";

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

export const getAllCompras = async (navigate) => {
    const response = await fetchApiGet('/compra/all', navigate, 'Error al obtener todas las compras');
    console.log(`📋 getAllCompras - Respuesta completa:`, response);
    return response;
};

// === FUNCIONES PARA FLUJOS ESPECIALES ===
export const iniciarProcesoCompra = async (payload, navigate) => {
    const response = await fetchApiPost('/compra', payload, navigate, 'Error al iniciar proceso de compra');
    return response;
};

export const getCompraPorCotizacion = async (cotizacionId, navigate) => {
    const response = await fetchApiGet(`/compra/por-cotizacion/${cotizacionId}`, navigate, 'Error al obtener compra por cotización');
    return response;
};

export const aprobarCompra = async (compraId, payload, navigate) => {
    const response = await fetchApiPatch(`/compra/${compraId}/aprobar`, payload, navigate, 'Error al aprobar compra');
    return response;
};

export const evaluarFinanciamiento = async (compraId, navigate) => {
    const response = await fetchApiPostWithParams(`/compra/${compraId}/evaluar`, navigate, 'Error al evaluar financiamiento', 'PATCH');
    return response;
};

export const cancelarCompra = async (compraId, cancelFile, navigate) => {
    if (!compraId) {
        notifyError('Debe seleccionar una compra para cancelar');
        return;
    }
    if (!cancelFile) {
        notifyError('Debe seleccionar un archivo para cancelar la compra');
        return;
    }
    const formData = new FormData();
    formData.append('file', cancelFile);

    try {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        const response = await fetch(import.meta.env.VITE_APP_API_URL + `/compra/${compraId}/cancelar`, {
            method: 'PATCH',
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