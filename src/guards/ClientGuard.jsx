import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ClientGuard = ({ children }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    console.log('🔒 ClientGuard - isAuthenticated:', isAuthenticated);
    console.log('🔒 ClientGuard - user:', user);
    console.log('🔒 ClientGuard - user role:', user?.rol);

    if (!isAuthenticated) {
        console.log('🔒 ClientGuard - Not authenticated, redirecting to /login');
        return <Navigate to="/login" replace />;
    }

    if (user?.rol !== 'CLIENTE') {
        console.log('🔒 ClientGuard - User role is not CLIENTE, redirecting to /admin/dashboard');
        return <Navigate to="/admin/dashboard" replace />;
    }

    console.log('🔒 ClientGuard - Access granted for CLIENTE');
    return children;
};

export default ClientGuard;