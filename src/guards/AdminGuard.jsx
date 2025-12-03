import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminGuard = ({ children }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.rol !== 'ADMIN') {
        return <Navigate to="/cliente/dashboard" replace />;
    }

    return children;
};

export default AdminGuard;