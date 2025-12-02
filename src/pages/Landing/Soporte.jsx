// src/components/landing/SupportSection.jsx
import { Container, Row, Col } from "react-bootstrap";
import "./landing.css";
import agent1 from "../../assets/mock/carro-hero.png";
import agent2 from "../../assets/mock/carro-hero.png";

export default function SupportSection() {
  return (
    <section id="soporte" className="landing-section support-v2">
      <Container>
        <Row className="gy-5 align-items-center">
          <Col lg={5}>
            <div className="section-intro">
              <span className="pill">Acompañamiento</span>
              <h2 className="page-title">
                Asesoría humana + IA durante todo tu proceso
              </h2>
              <p className="page-subtitle">
                No estás solo frente a una lista infinita de autos. Tienes
                asesores reales y un asistente con IA que te ayudan a elegir,
                comparar y decidir cómo estrenar.
              </p>

              <div className="support-pills">
                <span>Recomendaciones según tu perfil</span>
                <span>Respuestas sobre planes y trámites</span>
                <span>Soporte antes y después de la compra</span>
              </div>
            </div>
          </Col>

          <Col lg={7}>
            <div className="support-visual">
              <div className="support-chat-card">
                <div className="support-chat-header">
                  <div className="support-agents">
                    <img src={agent1} alt="Asesor" />
                    <img src={agent2} alt="Asesor" />
                  </div>
                  <div className="support-status">
                    <span className="dot-online" />
                    <span>Asesoría en línea</span>
                  </div>
                </div>

                <div className="support-chat-body">
                  <div className="msg msg-user">
                    Busco un auto para familia, con buen espacio y seguro.
                  </div>
                  <div className="msg msg-agent">
                    Perfecto, puedo sugerirte algunas SUV con 3 filas de asientos
                    y buenas asistencias de seguridad. ¿Tienes un rango de
                    presupuesto?
                  </div>
                  <div className="msg msg-agent">
                    También puedo mostrarte opciones de financiamiento y comparar
                    mensualidades.
                  </div>
                </div>
              </div>

              <div className="support-note-card">
                <p className="support-note-title">
                  Una experiencia guiada de principio a fin
                </p>
                <p className="support-note-text">
                  Compara modelos, resuelve dudas y cierra tu compra con
                  confianza, sabiendo que siempre hay alguien del otro lado para
                  ayudarte.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
