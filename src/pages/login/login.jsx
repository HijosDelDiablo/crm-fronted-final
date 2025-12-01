import { useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { loginSuccess } from "../../redux/slices/authSlice";
import api from "../../services/api";
import "./auth.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.type]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return toast.error("Por favor completa todos los campos");
    }

    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", formData);

      if (data.accessToken) {
        dispatch(loginSuccess({ user: data.user, token: data.accessToken }));
        
        toast.success(`¡Bienvenido, ${data.user.nombre}!`);

        if (data.user.rol === "CLIENTE") {
          navigate("/client/catalogo");
        } else {
          navigate("/dashboard");
        }
      } else if (data.redirect) {
        toast("Autenticación de dos pasos requerida");
        // Aquí se haria la redireccion a una pantalla de ingresar código
      }

    } catch (error) {
      console.error("Login error:", error);
      const msg = error.response?.data?.message || "Error al iniciar sesión";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
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
                    placeholder="tucorreo@ejemplo.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-2" controlId="loginPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
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
                    onClick={() => toast("Contacta al administrador para restablecer", { icon: "ℹ️" })}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <Button type="submit" className="btn-auth-main w-100 mb-2" disabled={loading}>
                  {loading ? <Spinner size="sm" animation="border" /> : "Entrar"}
                </Button>
              </Form>

              <div className="auth-divider">
                <span>¿No tienes cuenta?</span>
              </div>

              <div className="auth-switch-row">
                <span className="auth-switch-text">
                  Crea una cuenta para ver autos.
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