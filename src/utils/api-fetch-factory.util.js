import { fetchHeader } from "../utils/fetch-header.util";

export const fetchApiGet = async (url, navigate, errorMessage) => {
    const response = await fetch(import.meta.env.VITE_APP_API_URL + url, {
        method: 'GET',
        ...fetchHeader()
    });
    if (response.ok) {
        return response.json();
    } else {
        if (response.status === 401) navigate('/login');
        console.error(errorMessage);
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
        if (response.status === 401) navigate('/login');
        console.error(errorMessage);
        return null;
    }
};
