
import { fetchApiGet, fetchApiPost, fetchApiPatch, fetchApiPostWithParams } from "../utils/api-fetch-factory.util";

export const loginFetch = async (formData) => {
    try {
        const response = await fetch((import.meta.env.VITE_APP_API_URL) + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await response.json();

        // Verificar si el estatus es 401 o 400
        if (data.status === 401 || data.status === 400) {
            return { status: false, message: data.message || 'Credenciales inválidas' };
        }
        if (!data.user) return { status: false, message: 'Problema obtención de datos del usuario' };
        if (data.user.rol) {
            return { status: true, message: "Inicio de sesión exitoso", user: { ...data.user, accessToken: data.accessToken || data.access_token } };
        }

        return { status: false, message: data.message || 'Error en el inicio de sesión' };
    } catch (error) {
        console.error("Error en loginFetch: ", error);
        return { status: false, message: 'Error en el inicio de sesión: ' + error.message };
    }
}

export const registerFetch = async (formData) => {
    console.log('registerFetch called with:', formData);
    try {
        const url = (import.meta.env.VITE_APP_API_URL ) + '/auth/register';
        console.log('Fetching URL:', url);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: formData.name, email: formData.email, password: formData.password })
        });
        console.log('Response status:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log("register data:", data);
            return { status: true, message: 'Registro exitoso', user: data };
        } else {
            const errorData = await response.json().catch(() => ({}));
            console.log("register error:", errorData);
            return { status: false, message: errorData.message || 'Error en el registro' };
        }
    } catch (error) {
        console.error("Error en registerFetch: ", error);
        return { status: false, message: 'Error en el registro: ' + error.message };
    }
}

// Google Login
export const googleLogin = () => {
    window.location.href = import.meta.env.VITE_APP_API_URL + '/auth/google';
};

// Get Profile
export const getProfile = async (navigate) => {
    return await fetchApiGet('/auth/profile', navigate, 'Error al obtener perfil');
};

// 2FA Generate
export const generate2FA = async (navigate) => {
    return await fetchApiPostWithParams('/auth/2fa/generate', navigate, 'Error al generar 2FA', 'POST');
};

// 2FA Turn On
export const turnOn2FA = async (code, navigate) => {
    return await fetchApiPost('/auth/2fa/turn-on', { code }, navigate, 'Error al activar 2FA');
};

// Forgot Password
export const forgotPassword = async (email, navigate) => {
    return await fetchApiPost('/auth/forgot-password', { email }, navigate, 'Error al enviar email de recuperación');
};

// Reset Password
export const resetPassword = async (token, newPassword, navigate) => {
    return await fetchApiPost('/auth/reset-password', { token, newPassword }, navigate, 'Error al resetear contraseña');
};

// Admin Assign Role
export const assignRole = async (userId, role, navigate) => {
    return await fetchApiPatch(`/auth/admin/assign-role/${userId}`, { rol: role }, navigate, 'Error al asignar rol');
};

// Admin Delete User
export const deleteUser = async (userId, navigate) => {
    return await fetchApiPostWithParams(`/auth/admin/delete-user/${userId}`, navigate, 'Error al eliminar usuario', 'DELETE');
};

