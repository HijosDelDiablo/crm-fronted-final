import { notifyError, notifySuccess } from "../components/shared/Alerts";
import { loginSuccess } from "../redux/slices/authSlice";

export const handleLoginResponse = (
  response,
  navigate,
  dispatch,
  login,
  setIsLoading
) => {
  console.log('🔍 handleLoginResponse - Response:', response);
  console.log('🔍 handleLoginResponse - User:', response.user);

  if (!response.status) {
    notifyError(response.message);
    setIsLoading(false);
    return;
  }

  notifySuccess(response.message || "Inicio de sesión exitoso");
  setIsLoading(false);

  // Actualizar AuthService
  login(response.user);

  // Actualizar Redux
  console.log('🔍 handleLoginResponse - Dispatching loginSuccess to Redux');
  dispatch(loginSuccess({
    user: response.user,
    token: response.user.accessToken // El token viene en user.accessToken
  }));

  console.log('🔍 handleLoginResponse - User role:', response.user.rol);
  console.log('🔍 handleLoginResponse - About to navigate...');

  if (response.user.rol === "ADMIN") {
    console.log('🔍 handleLoginResponse - Navigating to /dashboard');
    navigate("/dashboard");
  } else if (response.user.rol === "CLIENTE") {
    console.log('🔍 handleLoginResponse - Navigating to /cliente/dashboard');
    navigate("/cliente/dashboard");
  } else {
    console.log('🔍 handleLoginResponse - Unknown role:', response.user.rol);
    notifyError("Rol de usuario no reconocido");
    setIsLoading(false);
    return;
  }
};
