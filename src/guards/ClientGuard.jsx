import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ClientGuard = ({ children }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.rol !== 'CLIENTE') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
};

export default ClientGuard;