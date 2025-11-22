// src/pages/Registro.jsx
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./auth.css";

export default function Registro() {
  const handleRegister = (e) => {
    e.preventDefault();
    // TODO: lógica de registro
  };

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="auth-panel">
              <div className="auth-logo">
                <div className="auth-logo-mark">AI</div>
                <div className="auth-logo-text">
                  <span className="auth-logo-name">Autobots IA</span>
                  <span className="auth-logo-tagline">
                    CRM automotriz con IA
                  </span>
                </div>
              </div>

              <h1 className="auth-heading">Crear cuenta</h1>
              <p className="auth-subheading">
                Registra tu concesionario y empieza a usar Autobots IA.
              </p>

              <Form onSubmit={handleRegister} className="auth-form">
                <Form.Group className="mb-3" controlId="registerName">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre y Apellidos"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="registerDealer">
                  <Form.Label>Nombre del concesionario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej. Autobots Motors León"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="registerEmail">
                  <Form.Label>Correo de trabajo</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="tucorreo@concesionario.com"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2" controlId="registerPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="registerPasswordConfirm"
                >
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Repite tu contraseña"
                    required
                  />
                </Form.Group>

                <Button type="submit" className="btn-auth-main w-100 mb-2">
                  Crear cuenta
                </Button>
              </Form>

              <div className="auth-divider">
                <span>¿Ya tienes cuenta?</span>
              </div>

              <div className="auth-switch-row">
                <span className="auth-switch-text">
                  Vuelve a la pantalla de inicio de sesión.
                </span>
                <Link to="/login" className="auth-link-inline">
                  Inicia sesión
                </Link>
              </div>
            </div>

            <p className="auth-legal">
              Solo usaremos tus datos para configurar tu cuenta y mejorar la
              experiencia.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
