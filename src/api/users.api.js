import api from "../services/api";
import { notifyError } from "../components/shared/Alerts";
import { fetchApiGet, fetchApiPost, fetchApiPatch, fetchApiPostWithParams } from "../utils/api-fetch-factory.util";

export const getUsers = async (navigate) => {
    return await fetchApiGet('/user/all', navigate, 'Error al obtener usuarios');
};

export const getClients = async (navigate) => {
    return await fetchApiGet('/user/clients', navigate, 'Error al obtener clientes');
};

export const getVendedores = async (navigate) => {
    return await fetchApiGet('/user/vendedores', navigate, 'Error al obtener vendedores');
};

export const getVendedoresWithNumClients = async (navigate) => {
    return await fetchApiGet('/user/vendedores-with-num-clients', navigate, 'Error al obtener vendedores con número de clientes');
};

export const setSellerToClient = async (clientId, sellerId, navigate) => {
    return await fetchApiPatch(`/user/${clientId}/set-seller-to-client/${sellerId}`, {}, navigate, 'Error al asignar vendedor a cliente');
};

export const updateUserRole = async (userId, role, navigate) => {
    return await fetchApiPatch(`/user/${userId}/role`, { rol: role }, navigate, 'Error al actualizar rol de usuario');
};

export const activateUser = async (userId, navigate) => {
    return await fetchApiPatch(`/user/admin/${userId}/activate`, {}, navigate, 'Error al activar usuario');
};

export const deactivateUser = async (userId, navigate) => {
    return await fetchApiPatch(`/user/admin/${userId}/deactivate`, {}, navigate, 'Error al desactivar usuario');
};

export const getProfile = async (navigate) => {
    return await fetchApiGet('/user/profile', navigate, 'Error al obtener perfil');
};

export const updateProfile = async (profileData, navigate) => {
    return await fetchApiPatch('/user/profile', profileData, navigate, 'Error al actualizar perfil');
};

export const uploadProfilePhoto = async (file, navigate) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        const response = await fetch(import.meta.env.VITE_APP_API_URL + '/user/profile/upload-photo', {
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
            console.error('Error al subir foto de perfil');
            return null;
        }
    } catch (error) {
        console.error('Error al subir foto de perfil:', error);
        return null;
    }
};

export const uploadINE = async (file, navigate) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        const response = await fetch(import.meta.env.VITE_APP_API_URL + '/user/profile/upload-ine', {
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
            console.error('Error al subir INE');
            return null;
        }
    } catch (error) {
        console.error('Error al subir INE:', error);
        return null;
    }
};

export const uploadDomicilio = async (file, navigate) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        const response = await fetch(import.meta.env.VITE_APP_API_URL + '/user/profile/upload-domicilio', {
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
            console.error('Error al subir comprobante de domicilio');
            return null;
        }
    } catch (error) {
        console.error('Error al subir comprobante de domicilio:', error);
        return null;
    }
};

export const uploadIngresos = async (file, navigate) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        const response = await fetch(import.meta.env.VITE_APP_API_URL + '/user/profile/upload-ingresos', {
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
            console.error('Error al subir comprobante de ingresos');
            return null;
        }
    } catch (error) {
        console.error('Error al subir comprobante de ingresos:', error);
        return null;
    }
};

export const getCompleteInfoSeller = async (navigate) => {
    return await fetchApiGet('/user/complete-info-seller', navigate, 'Error al obtener información completa del vendedor');
};

export const getClientsOfSeller = async (sellerId, navigate) => {
    return await fetchApiGet(`/user/clients-of-seller/${sellerId}`, navigate, 'Error al obtener clientes del vendedor');
};

export const deactivateSeller = async (sellerId, navigate) => {
    return await fetchApiPatch(`/user/${sellerId}/desactivate-seller`, {}, navigate, 'Error al desactivar vendedor');
};

export const activateSeller = async (sellerId, navigate) => {
    return await fetchApiPatch(`/user/${sellerId}/activate-seller`, {}, navigate, 'Error al activar vendedor');
};

export const registerAdmin = async (adminData, navigate) => {
    return await fetchApiPost('/user/register-admin', adminData, navigate, 'Error al registrar admin');
};

export const getAdmins = async (navigate) => {
    return await fetchApiGet('/user/admins', navigate, 'Error al obtener admins');
};

// Legacy function for backward compatibility
export const createAdmin = async (formData) => {
    try {
        const response = await fetch(import.meta.env.VITE_APP_API_URL + '/user/register-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                nombre: formData.nombre,
                email: formData.email,
                password: formData.password,
                telefono: formData.telefono
            })
        });
        const data = await response.json();
        console.log("register admin: ", data);
        if (data.error) return { status: false, message: data.message };
        return { status: true, message: data.message };
    } catch (error) {
        console.error("Error en createAdmin: ", error);
        return { status: false, message: 'Error al crear admin: ' + error.message };
    }
}