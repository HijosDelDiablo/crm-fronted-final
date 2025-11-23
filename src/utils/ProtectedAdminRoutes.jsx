import { Outlet , Navigate} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedAdminRoutes = () => {
    const { user } = useAuth();
    return user.role === "ADMIN" ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedAdminRoutes;