import { fetchHeader } from "../utils/fetch-header.util";

export const userActivityFetch = async (navigate) => {
    console.log("userActivityFetch...");

    const response = await fetch(import.meta.env.VITE_APP_API_URL + '/statistics/activity-user', {
        method: 'POST',
        ...fetchHeader()
    });

    if (!response.ok) navigate('/login');

};