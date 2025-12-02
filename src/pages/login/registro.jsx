import { useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import "./auth.css";

export default function Registro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Las contraseñas no coinciden");
    }
    if (formData.password.length < 6) {
      return toast.error("La contraseña debe tener al menos 6 caracteres");
    }

    setLoading(true);

    try {
      const payload = {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono
      };

      await api.post("/auth/register", payload);

      toast.success("Cuenta creada exitosamente. ¡Ahora inicia sesión!");
      
      navigate("/login");

    } catch (error) {
      console.error("Error registro:", error);
      const msg = error.response?.data?.message || "Error al registrarse";
      if (Array.isArray(msg)) {
        toast.error(msg[0]); 
      } else {
        toast.error(msg);
      }
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

              <h1 className="auth-heading">Crear cuenta</h1>
              <p className="auth-subheading">
                Regístrate para ver nuestro catálogo y cotizar autos.
              </p>

              <Form onSubmit={handleRegister} className="auth-form">
                <Form.Group className="mb-3" controlId="registerName">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    placeholder="Nombre y Apellidos"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="registerPhone">
                  <Form.Label>Teléfono Celular</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    placeholder="55 1234 5678"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Para contactarte sobre tus cotizaciones.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="registerEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="tucorreo@ejemplo.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2" controlId="registerPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="registerPasswordConfirm"
                >
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Repite tu contraseña"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button type="submit" className="btn-auth-main w-100 mb-2" disabled={loading}>
                  {loading ? <Spinner size="sm" animation="border" /> : "Crear cuenta"}
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