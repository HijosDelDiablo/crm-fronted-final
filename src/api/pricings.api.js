import { fetchApiGet, fetchApiPost, fetchApiPatch } from "../utils/api-fetch-factory.util";

export const getPricings = async (navigate) => {
    const response = await fetchApiGet('/cotizaciones/all', navigate, 'Error al obtener las cotizaciones');
    return response;
};

// === FUNCIONES PARA COTIZACIONES ===
export const getCotizacionesPendientes = async (navigate) => {
    const response = await fetchApiGet('/cotizaciones/pendientes', navigate, 'Error al obtener cotizaciones pendientes');
    return response;
};

export const getCotizacionesAprobadas = async (navigate) => {
    const response = await fetchApiGet('/cotizaciones/aprobadas', navigate, 'Error al obtener cotizaciones aprobadas');
    return response;
};

export const getMisCotizaciones = async (navigate) => {
    const response = await fetchApiGet('/cotizaciones/mis-cotizaciones', navigate, 'Error al obtener mis cotizaciones');
    return response || [];
};

export const getCotizacionesAprobadasCliente = async (navigate) => {
    // Alias for getMisCotizaciones for clients
    return await getMisCotizaciones(navigate);
};

export const getCotizacionesAprobadasByClienteId = async (clienteId, navigate) => {
    const response = await fetchApiGet(`/cotizaciones/aprobadas/${clienteId}`, navigate, 'Error al obtener cotizaciones aprobadas del cliente');
    return response || [];
};

export const getCotizacionesAll = async (navigate) => {
    // Esta es la misma que getPricings, pero la mantenemos por consistencia
    const response = await fetchApiGet('/cotizaciones/all', navigate, 'Error al obtener todas las cotizaciones');
    return response;
};

// === FUNCIONES PARA CREAR COTIZACIÓN ===
export const crearCotizacion = async (payload, navigate) => {
    // payload: { cocheId, enganche, plazoMeses }
    const response = await fetchApiPost('/cotizaciones', payload, navigate, 'Error al crear cotización');
    return response;
};

export const crearCotizacionVendedor = async (payload, navigate) => {
    // payload: { clienteId, cocheId, enganche, plazoMeses }
    const response = await fetchApiPost('/cotizaciones/vendedor-create', payload, navigate, 'Error al crear cotización como vendedor');
    return response;
};

// === FUNCIONES PARA ACTUALIZAR COTIZACIÓN ===
export const actualizarEstadoCotizacion = async (id, status, navigate) => {
    const response = await fetchApiPatch(`/cotizaciones/${id}/status`, { status }, navigate, 'Error al actualizar estado de cotización');
    return response;
};

export const actualizarNotasCotizacion = async (id, notasVendedor, navigate) => {
    const response = await fetchApiPatch(`/cotizaciones/${id}/notas`, { notasVendedor }, navigate, 'Error al actualizar notas de cotización');
    return response;
};

export const asignarVendedorACotizacion = async (idPricing, idSeller, navigate) => {
    const response = await fetchApiPatch(`/cotizaciones/${idPricing}/set-seller-to-pricing/${idSeller}`, {}, navigate, 'Error al asignar vendedor a cotización');
    return response;
};

// === FUNCIONES PARA OBTENER COTIZACIÓN ESPECÍFICA ===
export const getCotizacionById = async (id, navigate) => {
    const response = await fetchApiGet(`/cotizaciones/${id}`, navigate, 'Error al obtener cotización');
    return response;
};