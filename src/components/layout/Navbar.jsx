import { Navbar, Container } from "react-bootstrap";
import "./Navbar.css";

export default function NavbarTop() {
  return (
    <Navbar expand="lg" className="navbar-glass">
      <Container>
        <Navbar.Brand className="brand">
          <span className="brand-dot"></span> CarAI Manager
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
