import api from "../services/api";
import { notifyError } from "../components/shared/Alerts";

export const getUsers = async () => {
    try {
        const response = await api.get('/user/all');
        return response.data;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        notifyError("Error al cargar usuarios");
        return [];
    }
};


export const createAdmin = async (formData) => {

    try {
        const response = await fetch(import.meta.env.VITE_URL_API_AUTH + '/register/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: formData.nombre, email: formData.email, password: formData.password, telefono: formData.telefono })
        });
        const data = await response.json();
        console.log("register: ", data);
        if (data.error) return false;
        return true;
    } catch (error) {
        console.error("Error en createAdmin: ", error);
        return false;
    }
}