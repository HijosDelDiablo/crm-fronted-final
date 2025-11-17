// src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="logo">
          {/* Cambia la ruta de la imagen por la tuya */}
          <img src="/logo-autobots.png" alt="Autobots IA" />
          <span>AUTOBOTS</span>
        </Link>

        {/* Links */}
        <nav className="nav-links">
          <NavLink to="/" className="nav-item">
            Inicio
          </NavLink>
          <NavLink to="/soluciones" className="nav-item">
            Soluciones
          </NavLink>
          <NavLink to="/autos" className="nav-item">
            Autos Conectados
          </NavLink>
          <NavLink to="/precios" className="nav-item">
            Precios
          </NavLink>
          <NavLink to="/soporte" className="nav-item">
            Soporte
          </NavLink>
        </nav>

        {/* Acciones */}
        <div className="nav-actions">
          <button className="btn-ghost">Iniciar sesión</button>
          <button className="btn-primary">Comenzar</button>
        </div>
      </div>

      {/* Sub barra tipo Apple */}
      <div className="nav-subbar">
        <div className="sub-item">
          <span className="sub-title">IA para Flotas</span>
          <span className="sub-desc">Optimiza rutas y combustible.</span>
        </div>
        <div className="sub-item">
          <span className="sub-title">Autobots Cloud</span>
          <span className="sub-desc">Monitorea tus vehículos en tiempo real.</span>
        </div>
        <div className="sub-item">
          <span className="sub-title">Integraciones</span>
          <span className="sub-desc">Conecta tu ERP, CRM y más.</span>
        </div>
      </div>
    </header>
  );
}
