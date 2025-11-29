import { useEffect } from 'react';
import { userActivityFetch } from '../api/user_activity.api';
import { useNavigate } from 'react-router-dom';

const useHeartbeat = () => {

  const navigate = useNavigate();

  useEffect(() => {
    let lastActivity = Date.now();

    const updateActivity = () => {
      lastActivity = Date.now();
    };

    // Escuchar actividad del usuario
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('touchstart', updateActivity);

    // Enviar ping cada 30 segundos
    const id = setInterval(() => {
      const now = Date.now();

      // solo mando heartbeat si hubo actividad en los últimos 8 minutos
      if (now - lastActivity < 8 * 60 * 1000) {
        userActivityFetch(navigate);
      }
    }, 60000);

    return () => {
      // limpiar listeners y intervalos cuando el componente se desmonta
      clearInterval(id);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
    };
  }, []);
}

export default useHeartbeat;
