import { Container, Button } from "react-bootstrap";

export default function CTA() {
  return (
    <section className="landing-section text-center">
      <Container>
        <h2 style={{ fontWeight: 700 }}>
          ¿Listo para transformar tu concesionario?
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          La IA te ayudará a vender más desde el primer día.
        </p>

        <Button
          className="btn-landing mt-3"
          onClick={() => (window.location.href = "/login")}
        >
          Acceder al Sistema
        </Button>
      </Container>
    </section>
  );
}
