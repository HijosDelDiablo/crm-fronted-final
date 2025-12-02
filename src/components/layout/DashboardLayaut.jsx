// src/components/layout/DashboardLayout.jsx
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logos/logoAuto.jpg";
import "./dash.css"; // opcional, si quieres estilos extra
import { useState } from "react";
import AIChatWidget from "../chat/AIChatWidget.jsx";
import { MessageSquare } from "lucide-react";

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
    key: "ventas",
    label: "Ventas",
    path: "/panel/ventas",
    icon: "bi bi-graph-up",
  },
  {
    key: "reportes",
    label: "Reportes",
    path: "/panel/reportes",
    icon: "bi bi-bar-chart",
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

  return (
    <div className="d-flex dashboard-layout">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Autobots IA" className="sidebar-logo" />
          <span className="sidebar-title">Autobots IA</span>
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
          <div className="user-mini">
            <div className="user-avatar">A</div>
            <div className="user-info">
              <div className="user-name">Usuario Demo</div>
              <button
                type="button"
                className="btn-link-logout"
                onClick={() => {
                  // aquí luego limpias el token y navegas al login
                  window.location.href = "/login";
                }}
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
