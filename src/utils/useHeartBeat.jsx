import { useEffect, useRef } from 'react';
import { userActivityFetch } from '../api/user_activity.api';

const useHeartbeat = () => {
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    // Escuchar actividad del usuario
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('touchstart', updateActivity);

    // Enviar ping cada 60 segundos
    const id = setInterval(() => {
      const now = Date.now();

      // solo mando heartbeat si hubo actividad en los últimos 8 minutos
      if (now - lastActivityRef.current < 8 * 60 * 1000) {
        userActivityFetch();
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
