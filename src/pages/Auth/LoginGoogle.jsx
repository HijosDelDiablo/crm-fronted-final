import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthService  from "./AuthService";
import { handleLoginResponse } from "../../utils/authUtils";

const LoginGoogle = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userParam = urlParams.get('user');

       // console.log("Token: ",token);
        //console.log("User: ",userParam);
        
        let user = {};
        try {
             user = userParam ? JSON.parse(userParam) : null;
        } catch (e) {
            console.error("Error parsing user param", e);
            user = null;
        }

        let response = {};

        if (!token || !user) {
            response = { status: false, message: 'Error en el inicio de sesión con credenciales de Google' };
        } else {
            response = { status: true, message: 'Inicio de sesión exitoso', user: { ...user, accessToken: token } };
        }

        handleLoginResponse(response, navigate, (u) => AuthService.login(u), setIsLoading);
        
    }, [navigate]);

    return (
        <>
           {isLoading ? <div>Cargando...</div> : <div>Error al iniciar sesión con Google</div>}
        </>
    );
};

export default LoginGoogle;