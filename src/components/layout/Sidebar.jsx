// src/components/layout/Sidebar.jsx
import { useState } from "react";
import "./dash.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { House, Box, ShoppingBag, LogOut, Car, Menu, Truck, Users, UserCheck } from "lucide-react";

// Menú del Administrador
const ADMIN_MENU = [
  { icon: House, label: "Dashboard", path: "/dashboard" },
  { icon: Box, label: "Inventario", path: "/products" },
  { icon: Truck, label: "Proveedores", path: "/suppliers" },
  { icon: Users, label: "Clientes", path: "/clientes" },
  { icon: UserCheck, label: "Vendedores", path: "/vendedores" },
  { icon: Car, label: "Precio", path: "/Pricings" },

  // ... otros
];

// Menú del Cliente
const CLIENT_MENU = [
  { icon: Car, label: "Catálogo", path: "/client/catalogo" },
  { icon: ShoppingBag, label: "Mis Compras", path: "/client/mis-compras" },
];

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menu = user?.rol === "CLIENTE" ? CLIENT_MENU : ADMIN_MENU;

  return (
    <aside
      className={`dashboard-sidebar d-flex flex-column ${collapsed ? "sidebar--collapsed" : ""
        }`}
    >
      {/* HEADER */}
      <div className="sidebar-header">
        {/* Logo y título solo si NO está colapsado */}
        {!collapsed && (
          <div className="sidebar-brand">
            <img
              src="../../assets/logos/logoAuto.jpg"
              alt="logo"
              className="sidebar-logo"
            />
            <span className="sidebar-title">CarAI CRM</span>
          </div>
        )}

        {/* Botón hamburguesa SIEMPRE visible */}
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <Menu className="sidebar-toggle-icon" size={18} />
        </button>
      </div>

      {/* MENÚ */}
      <nav className="sidebar-nav">
        {menu.map((item, i) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <button
              key={i}
              type="button"
              data-label={item.label}
              className={`sidebar-link d-flex align-items-center gap-2 ${active ? "sidebar-link--active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* FOOTER / USUARIO */}
      <div className="sidebar-footer mt-auto">
        <div className="user-mini">
          <div className="user-avatar">
            {user?.nombre?.[0]?.toUpperCase() || "?"}
          </div>

          <div className="user-info">
            <span className="user-name">{user?.nombre}</span>

            <button className="btn-link-logout" onClick={handleLogout}>
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
