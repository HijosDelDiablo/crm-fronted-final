import "./Sidebar.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { House, Box, ShoppingBag, LogOut, Car } from "lucide-react";

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Menús según rol
  const adminMenu = [
    { icon: <House size={20} />, label: "Dashboard", path: "/dashboard" },
    { icon: <Box size={20} />, label: "Inventario", path: "/products" },
    // ... otros
  ];

  const clientMenu = [
    { icon: <Car size={20} />, label: "Catálogo", path: "/client/catalogo" },
    { icon: <ShoppingBag size={20} />, label: "Mis Compras", path: "/client/mis-compras" },
  ];

  const menu = user?.rol === "CLIENTE" ? clientMenu : adminMenu;

  return (
    <aside className="sidebar d-flex flex-column justify-content-between pb-4">
      <div>
        <div className="sidebar-user p-3 mb-2">
           <small className="text-muted d-block">Hola,</small>
           <strong>{user?.nombre?.split(' ')[0]}</strong>
        </div>
        {menu.map((m, i) => (
          <div key={i} className="sidebar-item" onClick={() => navigate(m.path)}>
            {m.icon}
            <span>{m.label}</span>
          </div>
        ))}
      </div>
      
      <div className="sidebar-item text-danger" onClick={handleLogout}>
        <LogOut size={20} />
        <span>Salir</span>
      </div>
    </aside>
  );
}