// src/components/layout/Sidebar.jsx
import { useState } from "react";
import "./dash.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { House, Box, ShoppingBag, LogOut, Car, Menu, Truck, Users, UserCheck, MessageSquare, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import logo from "../../assets/logos/logoAuto.jpg";
import AIChatWidget from "../chat/AIChatWidget.jsx";

// Menú del Administrador
const ADMIN_MENU = [
  { icon: House, label: "Dashboard", path: "/dashboard" },
  { icon: Box, label: "Inventario", path: "/products" },
  { icon: Truck, label: "Proveedores", path: "/suppliers" },
  { icon: Users, label: "Clientes", path: "/clientes" },
  { icon: UserCheck, label: "Vendedores", path: "/vendedores" },
  { icon: Car, label: "Cotizaciones", path: "/Pricings" },
  { icon: MessageSquare, label: "Chat IA", action: "chat" },

  // ... otros
];

// Menú del Cliente
const CLIENT_MENU = [
  { icon: Car, label: "Catálogo", path: "/client/catalogo" },
  { icon: ShoppingBag, label: "Mis Compras", path: "/client/mis-compras" },
  { icon: MessageSquare, label: "Chat IA", action: "chat" },
];

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menu = user?.rol === "CLIENTE" ? CLIENT_MENU : ADMIN_MENU;

  return (
    <>
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
                src={logo}
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
            const active = location.pathname === item.path || (item.action === "chat" && chatOpen);

            return (
              <button
                key={i}
                type="button"
                data-label={item.label}
                className={`sidebar-link d-flex align-items-center gap-2 ${active ? "sidebar-link--active" : ""}`}
                onClick={() => {
                  if (item.action === "chat") {
                    setChatOpen(true);
                  } else {
                    navigate(item.path);
                  }
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer mt-auto">
          {/* Theme Toggle */}
          <div className="px-3 mb-3">
            <button
              className="btn-theme-toggle w-100 d-flex align-items-center justify-content-center gap-2 p-2 rounded-3"
              onClick={toggleTheme}
              style={{
                background: "var(--background-soft)",
                border: "1px solid var(--border-color)",
                color: "var(--text-main)",
                transition: "all 0.2s"
              }}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              {!collapsed && <span>{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>}
            </button>
          </div>

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
      <AIChatWidget
        externalIsOpen={chatOpen}
        onExternalClose={() => setChatOpen(false)}
        hideFloatButton={true}
      />
    </>
  );
}
