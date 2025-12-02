import { fetchHeader } from "../utils/fetch-header.util";

export const userActivityFetch = async () => {
    console.log("userActivityFetch...");

    await fetch(import.meta.env.VITE_APP_API_URL + '/statistics/activity-user', {
        method: 'POST',
        ...fetchHeader()
    });

};