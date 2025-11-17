import { Container, Row, Col } from "react-bootstrap";

export default function IASection() {
  return (
    <section className="landing-section">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <div className="ia-box">
              <h2 style={{ fontWeight: 700 }}>
                IA que impulsa tu empresa
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>
                Conoce tendencias, predicciones y recomendaciones claras
                generadas por nuestro motor SBA-IA.
              </p>
            </div>
          </Col>

          <Col md={6}>
            <img
              src="https://i.imgur.com/2z9S1cg.png"
              alt="ia dashboard"
              className="img-fluid"
              style={{
                borderRadius: "22px",
                boxShadow: "var(--shadow-strong)"
              }}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}
