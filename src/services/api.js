import axios from 'axios';
import { store } from '../redux/store';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:2002',
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  let token = state.auth.token || localStorage.getItem('token') || localStorage.getItem('accessToken');

  // Si no hay token, intenta extraer accessToken del objeto user
  if (!token) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.accessToken) {
          token = userObj.accessToken;
          console.log('[API DEBUG] accessToken extraído de user:', token);
        }
      } catch (e) {
        console.warn('[API DEBUG] Error al parsear user:', e);
      }
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[API DEBUG] Header Authorization:', config.headers.Authorization);
  } else {
    console.warn('[API DEBUG] No se encontró token en Redux ni en localStorage');
  }
  return config;
});

export default api;