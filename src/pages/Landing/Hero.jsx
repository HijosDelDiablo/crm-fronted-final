import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="landing-section">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h1 className="hero-title">El Futuro del CRM Automotriz</h1>
            <p className="hero-subtitle">
              Potenciado con Inteligencia Artificial para vender más, entender a
              tus clientes y optimizar cada proceso.
            </p>

            <div className="mt-4">
              <Button onClick={() => navigate("/login")}>Comenzar Ahora</Button>
            </div>
          </Col>

          <Col md={6} className="text-center">
            <img
              src="https://i.imgur.com/9q5wCeA.png"
              alt="auto"
              style={{
                maxWidth: "95%",
                filter: "drop-shadow(0px 10px 40px rgba(0,0,0,0.2))",
              }}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}
