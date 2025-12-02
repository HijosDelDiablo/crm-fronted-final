import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from '../../assets/logos/logoAuto.jpg';


export default function NavbarTop() {
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
          <span className="logo-text">Autobots IA Manager</span>
        </Navbar.Brand>

        {/* Botón hamburguesa */}
        <Navbar.Toggle aria-controls="main-navbar-nav" />

        <Navbar.Collapse id="main-navbar-nav">
          {/* Links */}
          <Nav className="ms-auto align-items-lg-center gap-lg-4">
            <NavLink className="nav-link" to="/">
              Dashboard
            </NavLink>
            <NavLink className="nav-link" to="/pricings">
              Cotizaciones
            </NavLink>
            <NavLink className="nav-link" to="/clientes">
              Clientes
            </NavLink>
            <NavLink className="nav-link" to="/productos">
              Productos
            </NavLink>
            <NavLink className="nav-link" to="/vendedores">
              Vendedores
            </NavLink>
          </Nav>

          {/* Botones */}{/*
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0 ms-lg-4">
            <Button
              variant="outline-primary"
              className="btn-nav-ghost"
            >
              Perfil
            </Button>

            <Button
              variant="primary"
              className="btn-nav-primary"
            >
              Cerrar sesión
            </Button>
          </div>*/}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
