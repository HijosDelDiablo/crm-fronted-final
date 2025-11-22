// src/pages/Login.jsx
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./auth.css";

export default function Login() {
  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: lógica de login
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

              <h1 className="auth-heading">Iniciar sesión</h1>
              <p className="auth-subheading">
                Entra a tu panel y continúa donde te quedaste.
              </p>

              <Form onSubmit={handleLogin} className="auth-form">
                <Form.Group className="mb-3" controlId="loginEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="tucorreo@concesionario.com"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2" controlId="loginPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </Form.Group>

                <div className="auth-row-between mb-3">
                  <Form.Check
                    type="checkbox"
                    id="rememberMe"
                    label="Recuérdame"
                    className="auth-check"
                  />

                  <button
                    type="button"
                    className="auth-link-ghost"
                    // onClick={() => ...}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <Button type="submit" className="btn-auth-main w-100 mb-2">
                  Entrar
                </Button>
              </Form>

              <div className="auth-divider">
                <span>¿No tienes cuenta?</span>
              </div>

              <div className="auth-switch-row">
                <span className="auth-switch-text">
                  Crea una cuenta para tu concesionario.
                </span>
                <Link to="/registro" className="auth-link-inline">
                  Regístrate
                </Link>
              </div>
            </div>

            <p className="auth-legal">
              Al continuar aceptas los Términos de uso y el Aviso de privacidad.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
