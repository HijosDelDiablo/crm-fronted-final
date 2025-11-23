import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { handleLoginResponse } from "../../utils/authUtils";

const LoginGoogle = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    const [token, setToken] = useState(null);
    const [user, setUser] = useState({});
    const [response, setResponse] = useState({});

    // Capturar el token desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    setToken(urlParams.get('token'));
    setUser(urlParams.get('user'));

    if (!token || token === null || !user || user === null) {
        setResponse({ status: false, message: 'Error en el inicio de sesión con credenciales de Google' });
    }
    setResponse({ status: true, message: 'Inicio de sesión exitoso', user: { ...user, accessToken: token } });
    handleLoginResponse(response, navigate, login, setIsLoading);

    return (
        <>

        </>
    );
};

export default LoginGoogle;