import { fetchHeader } from "../utils/fetch-header.util";

export const fetchApiGet = async (url, navigate, errorMessage) => {
    const fullUrl = import.meta.env.VITE_APP_API_URL + url;
    console.log(`🌐 fetchApiGet - URL completa: ${fullUrl}`);
    console.log(`🔑 fetchApiGet - Headers:`, fetchHeader());

    const response = await fetch(fullUrl, {
        method: 'GET',
        ...fetchHeader()
    });

    console.log(`📡 fetchApiGet - Response status: ${response.status}`);

    if (response.ok) {
        const data = await response.json();
        console.log(`✅ fetchApiGet - Datos recibidos:`, data);
        return data;
    } else {
        if (response.status === 401 && navigate && typeof navigate === 'function') {
            navigate('/login');
        }
        console.error(`❌ ${errorMessage} - Status: ${response.status}`);
        return null;
    }
};

export const fetchApiPost = async (url, body, navigate, errorMessage) => {
    const response = await fetch(import.meta.env.VITE_APP_API_URL + url, {
        method: 'POST',
        body: JSON.stringify(body),
        ...fetchHeader()
    });
    if (response.ok) {
        return response.json();
    } else {
        if (response.status === 401 && navigate && typeof navigate === 'function') {
            navigate('/login');
        }
        console.error(`${errorMessage} - Status: ${response.status}\n${response.error ? response.error : response}`);
        return null;
    }
};

export const fetchApiPostWithParams = async (url, navigate, errorMessage, method) => {
    const response = await fetch(import.meta.env.VITE_APP_API_URL + url, {
        method: method,
        ...fetchHeader()
    });
    if (response.ok) {
        return response.json();
    } else {
        if (response.status === 401 && navigate && typeof navigate === 'function') {
            navigate('/login');
        }
        console.error(`${errorMessage} - Status: ${response.status}`);
        return null;
    }
};

export const fetchApiPatch = async (url, body, navigate, errorMessage) => {
    const response = await fetch(import.meta.env.VITE_APP_API_URL + url, {
        method: 'PATCH',
        body: JSON.stringify(body),
        ...fetchHeader()
    });
    if (response.ok) {
        return response.json();
    } else {
        if (response.status === 401 && navigate && typeof navigate === 'function') {
            navigate('/login');
        }
        console.error(`${errorMessage} - Status: ${response.status}`);
        return null;
    }
};
