// Hero.jsx
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import "./hero.css";
import carro2 from "../../assets/Videos/carro-hero2.mp4";

export default function Hero() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Remove pause on end to allow looping
    return () => { };
  }, []);

  return (
    <section className="landing-hero">
      {/* VIDEO FONDO */}
      <video ref={videoRef} autoPlay muted loop className="hero-video">
        <source src={carro2} type="video/mp4" />
      </video>

      {/* CAPA CON DEGRADADO EN TU PALETA */}
      <div className="hero-overlay" />

      <Container className="hero-content">
        <Row className="align-items-center">
          <Col md={7}>
            <h1 className="hero-title">
              Encuentra tu próximo{" "}
              <span className="hero-title-accent">auto ideal</span>
            </h1>

            <p className="hero-subtitle">
              Explora, compara y decide con confianza nuestro catálogo de vehículos nuevos y seminuevos con
              recomendaciones impulsadas por{" "}
              <strong>Inteligencia Artificial</strong>, planes flexibles y
              asesoría en cada paso.
            </p>
          </Col>

          {/* Columna derecha: tarjeta de métricas */}
          <Col md={5} className="d-none d-md-flex justify-content-end">
            <div className="hero-stats-card">
              <h3>IA en tu búsqueda</h3>
              <p className="hero-stats-desc">
                Recomendaciones según tu presupuesto y estilo de vida.
              </p>
              <div className="hero-stats-grid">
                <div>
                  <span className="stat-label">+150</span>
                  <span className="stat-caption">Modelos disponibles</span>
                </div>
                <div>
                  <span className="stat-label">24/7</span>
                  <span className="stat-caption">Asesor virtual activo</span>
                </div>
                <div>
                  <span className="stat-label">3 min</span>
                  <span className="stat-caption">
                    Promedio para recibir opciones
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
