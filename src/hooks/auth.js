export const loginGoogleFetch = async () => {
    try {
        window.location.href = import.meta.env.VITE_URL_API_AUTH + '/googleInWeb';
    } catch (error) {
        console.error("Error en loginGoogleFetch: ", error);
        return { status: false, message: 'Error en el inicio de sesión: ' + error.message };
    }
}
export const loginFetch = async (formData) => {
    try {
        const response = await fetch(import.meta.env.VITE_URL_API_AUTH + '/login', {
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
            return { status: true, message: "Inicio de sesión exitoso", user: { ...data.user, accessToken: data.accessToken } };
        }


        return { status: false, message: data.message || 'Error en el inicio de sesión' };
    } catch (error) {
        console.error("Error en loginFetch: ", error);
        return { status: false, message: 'Error en el inicio de sesión: ' + error.message };
    }
}

export const registerFetch = async (formData) => {

    try {
        const response = await fetch(import.meta.env.VITE_URL_API_AUTH + '/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: formData.name, email: formData.email, password: formData.password, telefono: formData.telefono })
        });
        const data = await response.json();
        console.log("register: ", data);
        if (data.error) return false;
        return true;
    } catch (error) {
        console.error("Error en registerFetch: ", error);
        return false;
    }
}

