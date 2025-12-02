import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedAdminRoutes = () => {
  const { user, isLoggedIn } = useAuth();
  // Si isLoggedIn es null, significa que AuthContextProvider aún está verificando
  if (isLoggedIn === null) {
    return null; // O un <Spinner />
  }
  return user && user.rol === "ADMIN" ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedAdminRoutes;