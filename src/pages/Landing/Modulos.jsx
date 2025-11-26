// src/components/landing/ModulesSection.jsx
import { Container, Row, Col } from "react-bootstrap";
import "./landing.css";
import ventasImg from "../../assets/mock/modulos-inventario.jpg";
import inventarioImg from "../../assets/mock/modulos-ventas.jpg";
import direccionImg from "../../assets/mock/modulos-direccion.jpg";

export default function ModulesSection() {
  const modules = [
    {
      img: ventasImg,
      label: "SUV y familiares",
      title: "Espacio y seguridad para todos",
      desc: "Modelos pensados para quienes viajan en familia, necesitan cajuela amplia y quieren seguridad en carretera.",
      items: [
        "SUV compactas, medianas y de 3 filas",
        "Opciones con asistencias avanzadas",
        "Recomendaciones IA para familias"
      ],
    },
    {
      img: inventarioImg,
      label: "Ciudad & sedanes",
      title: "Eficiencia y comodidad diaria",
      desc: "Autos ideales para moverte en ciudad con buen rendimiento, tamaño práctico y confort interior.",
      items: [
        "Sedanes compactos y medianos",
        "Versiones con transmisión automática",
        "Modelos recomendados para primer auto"
      ],
    },
    {
      img: direccionImg,
      label: "Trabajo & pickups",
      title: "Cargas, ruta y trabajo duro",
      desc: "Pickups y vehículos de trabajo listos para carga, equipamiento y recorridos intensivos.",
      items: [
        "Doble cabina y chasis cabina",
        "Opciones 4x4 para campo",
        "Sugerencias IA para flotillas"
      ],
    },
  ];

  return (
    <section id="modulos" className="landing-section modules-v2">
      <Container>
        <div className="page-header text-center">
          <span className="pill">Segmentos</span>
          <h2 className="page-title">Explora por el tipo de auto que buscas</h2>
          <p className="page-subtitle">
            Elige el segmento que mejor se adapta a tu vida y desde ahí entra al
            catálogo de modelos disponibles.
          </p>
        </div>

        <Row className="gy-4">
          {modules.map((m, idx) => (
            <Col md={4} key={idx}>
              <div className="module-card-v2 h-100">
                <div className="module-img-wrapper">
                  <img src={m.img} alt={m.label} className="module-img" />
                </div>
                <div className="module-body">
                  <span className="module-chip">{m.label}</span>
                  <h3 className="module-title">{m.title}</h3>
                  <p className="module-desc">{m.desc}</p>
                  <ul className="module-list">
                    {m.items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                  {/* Aquí luego puedes convertir esto en enlace a /catalogo?segment=... */}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
