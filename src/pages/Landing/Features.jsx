import { Container, Row, Col } from "react-bootstrap";

export default function Features() {
  const items = [
    {
      title: "IA Predictiva",
      desc: "La IA identifica clientes listos para comprar."
    },
    {
      title: "Gestión de Autos",
      desc: "Control total del catálogo de vehículos."
    },
    {
      title: "Cotizaciones Inteligentes",
      desc: "Crea y envía cotizaciones claras y profesionales."
    },
    {
      title: "Panel Analítico",
      desc: "KPI automotrices con precisión empresarial."
    }
  ];

  return (
    <section className="landing-section">
      <Container>
        <Row>
          {items.map((i, idx) => (
            <Col md={3} key={idx} className="mb-3">
              <div className="card-glass h-100">
                <h4>{i.title}</h4>
                <p style={{ color: "var(--text-secondary)" }}>{i.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
