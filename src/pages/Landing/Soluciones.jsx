// src/components/landing/SolutionsSection.jsx
import { Container, Row, Col } from "react-bootstrap";
import "./landing.css";
import dashboardImg from "../../assets/mock/soluciones-com.jpg";

export default function SolutionsSection() {
  const soluciones = [
    {
      title: "Encuentra por estilo de vida",
      desc: "¿Familia, ciudad o trabajo? Filtra por uso principal y te mostramos solo los autos que encajan contigo.",
      pill: "Por necesidades",
    },
    {
      title: "IA que sugiere el mejor match",
      desc: "Nuestra IA cruza tu presupuesto, tipo de manejo y número de pasajeros para sugerir los modelos ideales.",
      pill: "IA en tu búsqueda",
    },
    {
      title: "Vista 360° de cada vehículo",
      desc: "Ficha completa con fotos, video, equipamiento, historial y opciones de financiamiento en un solo lugar.",
      pill: "Detalle del auto",
    },
  ];

  return (
    <section id="soluciones" className="landing-section solutions-v2">
      <Container>
        <Row className="align-items-center gy-5">
          <Col lg={6}>
            <div className="section-intro">
              <span className="pill">Cómo te ayudamos a elegir</span>
              <h2 className="page-title">
                Explora, compara y decide con confianza
              </h2>
              <p className="page-subtitle">
                No es solo una lista de autos. Es una experiencia guiada para
                que encuentres el vehículo correcto, con la tecnología y el
                soporte que necesitas.
              </p>
            </div>

            <div className="solutions-cards">
              {soluciones.map((s, idx) => (
                <div key={idx} className="solutions-card">
                  <div className="solutions-card-pill">{s.pill}</div>
                  <h3 className="solutions-card-title">{s.title}</h3>
                  <p className="solutions-card-desc">{s.desc}</p>
                  <button className="solutions-card-btn">Saber más</button>
                </div>
              ))}
            </div>
          </Col>

          <Col lg={6}>
            <div className="solutions-mockup-wrapper">
              <div className="solutions-mockup-bg" />
              <img
                src={dashboardImg}
                alt="Catálogo de autos y comparador"
                className="solutions-mockup-img"
              />

              {/* Tarjeta flotante extra */}
              <div className="solutions-floating-card">
                <p className="floating-title">Resumen de tu búsqueda</p>
                <div className="floating-metrics">
                  <div>
                    <span className="floating-label">Autos sugeridos</span>
                    <span className="floating-value">12</span>
                  </div>
                  <div>
                    <span className="floating-label">Desde</span>
                    <span className="floating-value">$289,900</span>
                  </div>
                  <div>
                    <span className="floating-label">Segmentos</span>
                    <span className="floating-value">SUV, Sedán</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
