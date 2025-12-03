import { fetchApiGet, fetchApiPost } from "../utils/api-fetch-factory.util";

// === FUNCIONES PARA CLIENTE ===
export const getMisPagos = async (navigate) => {
    const response = await fetchApiGet('/pagos/mis-pagos', navigate, 'Error al obtener mis pagos');
    return response;
};

// === FUNCIONES PARA ADMIN/VENDEDOR ===
export const getPagosPorCompra = async (compraId, navigate) => {
    const response = await fetchApiGet(`/pagos/por-compra/${compraId}`, navigate, 'Error al obtener pagos de la compra');
    return response;
};

export const registrarPago = async (payload, navigate) => {
    // payload debe incluir: { compraId, monto, metodoPago, notas }
    const response = await fetchApiPost('/pagos', payload, navigate, 'Error al registrar pago');
    return response;
};