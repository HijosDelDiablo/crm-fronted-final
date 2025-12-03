// src/components/landing/PricingSection.jsx
import { Container, Row, Col, Button } from "react-bootstrap";
import "./landing.css";
import pricingImg from "../../assets/mock/ventas.jpg";

export default function PricingSection() {
  const planes = [
    {
      name: "Contado",
      badge: "Mejor precio disponible",
      price: "Desde $100,000",
      note: "Aprovecha promociones por pago de contado",
      features: [
        "Precio preferencial en unidades seleccionadas",
        "Entrega más rápida",
        "Menos trámites y papeleo",
      ],
      highlighted: false,
    },
    {
      name: "Crédito tradicional",
      badge: "Más elegido",
      price: "Enganche desde el 10%",
      note: "Plazos flexibles según tu capacidad",
      features: [
        "Simulador para ver mensualidades",
        "IA que sugiere el plazo ideal",
        "Acompañamiento durante todo el proceso",
      ],
      highlighted: true,
    },
    {
      name: "Plan flotillas / empresas",
      badge: "Para negocios y grupos",
      price: "A medida",
      note: "Condiciones especiales para empresas",
      features: [
        "Asesor dedicado para tu empresa",
        "Condiciones para múltiples unidades",
        "Renovación y recompra planificada",
      ],
      highlighted: false,
    },
  ];

  return (
    <section id="precios" className="landing-section pricing-v2">
      <Container>
        <div className="pricing-header-v2">
          <div className="pricing-text">
            <span className="pill">Formas de estrenar</span>
            <h2 className="page-title">
              Opciones claras para llevarte tu auto
            </h2>
            <p className="page-subtitle">
              Elige si quieres pagar de contado, con financiamiento o con un
              esquema especial para negocio. Nosotros te ayudamos a encontrar la
              mejor opción.
            </p>
          </div>
          <div className="pricing-hero-illustration">
            <img src={pricingImg} alt="Opciones de financiamiento" />
          </div>
        </div>

        <Row className="gy-4 justify-content-center">
          {planes.map((p, idx) => (
            <Col md={4} key={idx}>
              <div
                className={
                  "pricing-card-v2" +
                  (p.highlighted ? " pricing-card-v2--highlighted" : "")
                }
              >
                {p.highlighted && (
                  <div className="pricing-pill-highlight">Más elegido</div>
                )}

                <h3 className="pricing-title">{p.name}</h3>
                <p className="pricing-badge">{p.badge}</p>

                <div className="pricing-main">
                  <span className="pricing-price">{p.price}</span>
                  <span className="pricing-note">{p.note}</span>
                </div>

                <ul className="pricing-list">
                  {p.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </Col>
          ))}
        </Row>

        <div className="pricing-footnote-v2">
          Comparte tus datos básicos y te ayudamos a simular la mejor forma de
          estrenar tu vehículo.
        </div>
      </Container>
    </section>
  );
}
