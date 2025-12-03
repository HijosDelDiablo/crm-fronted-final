import { fetchApiGet, fetchApiPost } from "../utils/api-fetch-factory.util";

export const getPricings = async (navigate) => {
    const response = await fetchApiGet('/cotizaciones/all', navigate, 'Error al obtener las cotizaciones');
    return response;
};

// === NUEVAS FUNCIONES PARA COTIZACIONES ===
export const getCotizacionesPendientes = async (navigate) => {
    const response = await fetchApiGet('/cotizaciones/pendientes', navigate, 'Error al obtener cotizaciones pendientes');
    return response;
};

export const getCotizacionesAprobadas = async (navigate) => {
    const response = await fetchApiGet('/cotizaciones/aprobadas', navigate, 'Error al obtener cotizaciones aprobadas');
    return response;
};

export const getCotizacionesAprobadasCliente = async (clienteId, navigate) => {
    const response = await fetchApiGet(`/cotizaciones/mis-cotizaciones`, navigate, 'Error al obtener cotizaciones del cliente');
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