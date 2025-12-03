// src/components/layout/Navbar.jsx
import { Navbar as BsNavbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/logos/logoAuto.jpg";
import "./nav.css";

export default function MainNavbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleDashboardRedirect = () => {
    if (user?.rol === 'ADMIN') {
      navigate('/dashboard');
    } else {
      navigate('/panel');
    }
  };

  return (
    <BsNavbar expand="lg" className="main-navbar" fixed="top">
      <Container>
        {/* Logo */}
        <BsNavbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2"
        >
          <img src={logo} className="nav-logo" alt="Autobots" />
          <span className="logo-text">Autobots IA</span>
        </BsNavbar.Brand>

        {/* Botón hamburguesa */}
        <BsNavbar.Toggle aria-controls="main-navbar-nav" />

        <BsNavbar.Collapse id="main-navbar-nav">
          {/* Links internos (scroll suave dentro de la landing) */}
          <Nav className="ms-auto align-items-lg-center gap-lg-4">
            <a href="/" className="nav-link">
              Inicio
            </a>
            <a href="#soluciones" className="nav-link">
              Soluciones
            </a>
            <a href="#modulos" className="nav-link">
              Segmentos
            </a>
            <a href="#precios" className="nav-link">
              Créditos
            </a>
            <a href="#carros" className="nav-link">
              Carros
            </a>
            <a href="#soporte" className="nav-link">
              Soporte
            </a>
          </Nav>

          {/* Botones condicionales según estado de sesión */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0 ms-lg-4">
            {isAuthenticated ? (
              <Button
                variant="primary"
                className="btn-nav-primary"
                onClick={handleDashboardRedirect}
              >
                Entrar
              </Button>
            ) : (
              <>
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
                  onClick={() => navigate("/login?registro=true")}
                >
                  Comenzar
                </Button>
              </>
            )}
          </div>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
