// src/components/layout/DashboardLayout.jsx
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logos/logoAuto.jpg";
import "./dash.css"; // opcional, si quieres estilos extra
import { useState } from "react";
import AIChatWidget from "../chat/AIChatWidget.jsx";
import { MessageSquare, LogOut, Menu, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const MODULES = [
  {
    key: "inicio",
    label: "Inicio",
    path: "/cliente/dashboard",
    icon: "bi bi-speedometer2",
  },
  {
    key: "carros",
    label: "Carros",
    path: "/cliente/catalogo",
    icon: "bi bi-car-front",
  },
  {
    key: "mis-cotizaciones",
    label: "Mis Cotizaciones",
    path: "/cliente/cotizaciones",
    icon: "bi bi-file-earmark-text",
  },
  {
    key: "mis-compras",
    label: "Mis Compras",
    path: "/cliente/compras",
    icon: "bi bi-bag",
  },
  {
    key: "mis-pagos",
    label: "Mis Pagos",
    path: "/cliente/pagos",
    icon: "bi bi-credit-card",
  },
  {
    key: "chat-ia",
    label: "Chat IA",
    action: "chat",
    icon: "bi bi-robot",
  },
];

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="d-flex dashboard-layout">
      {/* SIDEBAR */}
      <aside className={`dashboard-sidebar d-flex flex-column ${collapsed ? "sidebar--collapsed" : ""}`}>
        <div className="sidebar-header">
          {/* Logo y título solo si NO está colapsado */}
          {!collapsed && (
            <div className="sidebar-brand">
              <img src={logo} alt="Autobots IA" className="sidebar-logo" />
              <span className="sidebar-title">Autobots IA</span>
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

        <Nav className="flex-column sidebar-nav">
          {MODULES.map((m) => (
            <Nav.Item key={m.key}>
              {m.action === "chat" ? (
                <Nav.Link
                  className="sidebar-link"
                  onClick={() => setChatOpen(!chatOpen)}
                  style={{ cursor: "pointer" }}
                >
                  {m.icon && <i className={m.icon + " me-2"} />}
                  {m.label}
                </Nav.Link>
              ) : (
                <Nav.Link
                  as={Link}
                  to={m.path}
                  className={
                    "sidebar-link" +
                    (location.pathname === m.path ? " sidebar-link--active" : "")
                  }
                >
                  {m.icon && <i className={m.icon + " me-2"} />}
                  {m.label}
                </Nav.Link>
              )}
            </Nav.Item>
          ))}
        </Nav>

        <div className="sidebar-footer mt-auto">

          <div className="user-mini">
            <div className="user-avatar">
              {user?.nombre?.[0]?.toUpperCase() || "?"}
            </div>

            <div className="user-info">
              <span className="user-name">{user?.nombre}</span>

              <button className="btn-link-logout mb-1" onClick={() => navigate('/perfil')}>
                <User size={14} /> Mi Perfil
              </button>
              <button className="btn-link-logout" onClick={handleLogout}>
                <LogOut size={14} /> Salir
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="dashboard-main">
        <div className="dashboard-main-inner">
          {children}
          <AIChatWidget
            externalIsOpen={chatOpen}
            onExternalClose={() => setChatOpen(false)}
            hideFloatButton={true}
          />
        </div>
      </main>
    </div>
  );
}
