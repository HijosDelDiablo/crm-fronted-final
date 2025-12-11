import { fetchApiGet, fetchApiPost } from "../utils/api-fetch-factory.util";

// === FUNCIONES PARA CLIENTE ===
export const getMisPagos = async (navigate) => {
    const response = await fetchApiGet('/pagos/mis-pagos', navigate, 'Error al obtener mis pagos');
    console.log('🔍 getMisPagos - Respuesta completa de API:', response);
    console.log('🔍 getMisPagos - response.pagos:', response?.pagos);
    const pagos = response?.pagos || [];
    console.log('🔍 getMisPagos - Retornando pagos:', pagos);
    return pagos;
};

// === FUNCIONES PARA ADMIN/VENDEDOR ===
export const getPagosPorCompra = async (compraId, navigate) => {
    const response = await fetchApiGet(`/pagos/por-compra/${compraId}`, navigate, 'Error al obtener pagos de la compra');
    // Si la respuesta tiene la propiedad 'pagos', devolvemos eso. Si no, asumimos que es el array o devolvemos vacío.
    return response?.pagos || response || [];
};

export const registrarPago = async (payload, file, navigate) => {
    // payload debe incluir: { compraId, monto, metodoPago, notas }
    const formData = new FormData();
    // Append payload fields
    Object.keys(payload).forEach(key => {
        formData.append(key, payload[key]);
    });

    // Append file if exists
    if (file) {
        formData.append('comprobante', file);
    }

    try {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        const response = await fetch(import.meta.env.VITE_APP_API_URL + '/pagos', {
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
            console.error('Error al registrar pago');
            return null;
        }
    } catch (error) {
        console.error('Error al registrar pago:', error);
        return null;
    }
};