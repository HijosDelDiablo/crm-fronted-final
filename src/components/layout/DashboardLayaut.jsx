// src/components/layout/DashboardLayout.jsx
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logos/logoAuto.jpg";
import "./dash.css"; // opcional, si quieres estilos extra
import { useState } from "react";
import AIChatWidget from "../chat/AIChatWidget.jsx";
import { MessageSquare, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const MODULES = [
  {
    key: "inicio",
    label: "Inicio",
    path: "/panel",
    icon: "bi bi-speedometer2",
  },
  {
    key: "carros",
    label: "Carros",
    path: "/panel/carros",
    icon: "bi bi-car-front",
  },
  {
    key: "mis-compras",
    label: "Mis Compras",
    path: "/panel/mis-compras",
    icon: "bi bi-bag",
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
  const { theme, toggleTheme } = useTheme();
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
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Autobots IA" className="sidebar-logo" />
            <span className="sidebar-title">Autobots IA</span>
          </Link>
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

        <div className="sidebar-footer">
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
              <span>{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>
            </button>
          </div>

          <div className="user-mini">
            <div className="user-avatar">
              {user?.nombre?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.nombre || "Usuario"}</div>
              <button
                type="button"
                className="btn-link-logout"
                onClick={handleLogout}
              >
                Cerrar sesión
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
