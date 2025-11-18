// src/components/layout/Navbar.jsx
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logos/logoAuto.jpg";
import "./nav.css";

export default function MainNavbar() {
  const navigate = useNavigate();

  return (
    <Navbar expand="lg" className="main-navbar" fixed="top">
      <Container>
        {/* Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2"
        >
          <img src={logo} className="nav-logo" alt="Autobots" />
          <span className="logo-text">Autobots IA</span>
        </Navbar.Brand>

        {/* Botón hamburguesa */}
        <Navbar.Toggle aria-controls="main-navbar-nav" />

        <Navbar.Collapse id="main-navbar-nav">
          {/* Links */}
          <Nav className="ms-auto align-items-lg-center gap-lg-4">
            <NavLink className="nav-link" to="/">
              Inicio
            </NavLink>
            <NavLink className="nav-link" to="/soluciones">
              Soluciones
            </NavLink>
            <NavLink className="nav-link" to="/modulos">
              Módulos
            </NavLink>
            <NavLink className="nav-link" to="/precios">
              Precios
            </NavLink>
            <NavLink className="nav-link" to="/soporte">
              Soporte
            </NavLink>
          </Nav>

          {/* Botones */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0 ms-lg-4">
            <Button
              variant="outline-primary"
              className="btn-nav-ghost"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </Button>

            <Button
              variant="primary"
              className="btn-nav-primary"
              onClick={() => navigate("/registro")}
            >
              Comenzar
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
