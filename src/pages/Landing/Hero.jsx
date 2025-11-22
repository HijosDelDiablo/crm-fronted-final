// Hero.jsx
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import "./hero.css";
import carro2 from "../../assets/videos/carro-hero2.mp4";

export default function Hero() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => video.pause();
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <section className="landing-hero">
      {/* VIDEO FONDO */}
      <video ref={videoRef} autoPlay muted className="hero-video">
        <source src={carro2} type="video/mp4" />
      </video>

      {/* CAPA CON DEGRADADO EN TU PALETA */}
      <div className="hero-overlay" />

      <Container className="hero-content">
        <Row className="align-items-center">
          <Col md={7}>
            <h1 className="hero-title">
              El Futuro del{" "}
              <span className="hero-title-accent">CRM Automotriz</span>
            </h1>

            <p className="hero-subtitle">
              Potenciado con <strong>Inteligencia Artificial</strong> para
              vender más, entender a tus clientes y optimizar cada proceso del
              concesionario.
            </p>

            <div className="hero-actions">
              <Button className="btn-hero" onClick={() => navigate("/login")}>
                Comenzar Ahora
              </Button>
              <button
                type="button"
                className="btn-hero-secondary"
                onClick={() => navigate("/soluciones")}
              >
                Ver Soluciones
              </button>
            </div>
          </Col>

          {/* Columna derecha: tarjeta de métricas en vez de imagen rota */}
          <Col md={5} className="d-none d-md-flex justify-content-end">
            <div className="hero-stats-card">
              <h3>IA en acción</h3>
              <p className="hero-stats-desc">
                Resultados reales en menos de 30 días.
              </p>
              <div className="hero-stats-grid">
                <div>
                  <span className="stat-label">+23%</span>
                  <span className="stat-caption">Cierres de venta</span>
                </div>
                <div>
                  <span className="stat-label">-18%</span>
                  <span className="stat-caption">Tiempo de seguimiento</span>
                </div>
                <div>
                  <span className="stat-label">24/7</span>
                  <span className="stat-caption">Monitoreo de leads</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
