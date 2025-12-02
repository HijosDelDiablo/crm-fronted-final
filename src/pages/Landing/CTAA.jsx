import { Container, Button } from "react-bootstrap";

export default function CTA() {
  return (
    <section className="landing-section text-center">
      <Container>
        <h2 style={{ fontWeight: 700 }}>¿Listo para comprar?</h2>
        <p style={{ color: "var(--text-secondary)" }}>
          La IA te ayudará en cada paso del camino. Únete a AutoBost IA hoy y
          lleva tu compra al siguiente nivel.
        </p>

        <Button
          className="btn-landing mt-3"
          onClick={() => (window.location.href = "/login")}
        >
          Comprar
        </Button>
      </Container>
    </section>
  );
}
