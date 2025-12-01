import AuthService from "../pages/Auth/AuthService"; // Importa tu servicio

export const fetchHeader = () => {
    const user = AuthService.getUser(); // Obtén el usuario directamente del servicio
    
    // Es buena práctica validar que exista el usuario/token
    if (!user || !user.accessToken) {
        return { headers: {} }; 
    }
    if(import.meta.env.DEVELOPMENT) console.log(user.accessToken)
    return {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    };
};