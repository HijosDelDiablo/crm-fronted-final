import { notifyError, notifySuccess } from '../components/shared/Alerts';

export const handleLoginResponse = (response, navigate, login, setIsLoading) => {
    if (!response.status) {
        notifyError(response.message);
        setIsLoading(false);
        return;
    }

    notifySuccess(response.message || 'Inicio de sesión exitoso');
    setIsLoading(false);
    login(response.user);

    if (response.user.rol === "ADMIN") {
        notifySuccess('Módulo de administración aun no implementado');
        navigate('/');
    } else if (response.user.rol === "CLIENTE") {
        navigate('/');
    } else {
        notifyError('Rol de usuario no reconocido');
        setIsLoading(false);
        return;
    }
};
