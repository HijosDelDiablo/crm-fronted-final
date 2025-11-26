// src/components/landing/TopCarsSection.jsx
import { Container, Row, Col, Button } from "react-bootstrap";
import "./landing.css";

import car1 from "../../assets/carros/Mazda.jpg";
import car2 from "../../assets/carros/Honda.jpg";
import car3 from "../../assets/carros/Toyota.jpg";

export default function TopCarsSection() {
  const topCars = [
    {
      img: car1,
      label: "SUV",
      model: "Mazda CX-5 2024",
      desc: "Confort, seguridad y rendimiento ideal para familia.",
      stats: { ventas: "523", price: "$489,900", rating: "4.8" },
    },
    {
      img: car2,
      label: "Sedán",
      model: "Honda Civic 2024",
      desc: "Equilibrio perfecto entre ciudad y carretera.",
      stats: { ventas: "478", price: "$429,000", rating: "4.7" },
    },
    {
      img: car3,
      label: "Pickup",
      model: "Toyota Hilux 2024",
      desc: "Fuerza, capacidad y durabilidad comprobada.",
      stats: { ventas: "441", price: "$619,900", rating: "4.9" },
    },
  ];

  return (
    <section id="carros" className="landing-section topcars-v2">
      <Container>
        <div className="page-header text-center">
          <span className="pill">Más Vendidos</span>
          <h2 className="page-title">Top Autos del Mes</h2>
          <p className="page-subtitle">
            Los modelos que más personas están eligiendo. Descubre por qué son
            los favoritos.
          </p>
        </div>

        <Row className="gy-4">
          {topCars.map((car, i) => (
            <Col md={4} key={i}>
              <div className="topcar-card h-100">
                <div className="topcar-img-wrapper">
                  <img src={car.img} alt={car.model} className="topcar-img" />
                </div>

                <div className="topcar-body">
                  <span className="topcar-chip">{car.label}</span>
                  <h3 className="topcar-title">{car.model}</h3>
                  <p className="topcar-desc">{car.desc}</p>

                  <div className="topcar-stats">
                    <div>
                      <span className="stat-label">Ventas</span>
                      <span className="stat-value">{car.stats.ventas}</span>
                    </div>
                    <div>
                      <span className="stat-label">Precio</span>
                      <span className="stat-value">{car.stats.price}</span>
                    </div>
                    <div>
                      <span className="stat-label">Rating</span>
                      <span className="stat-value">{car.stats.rating}⭐</span>
                    </div>
                  </div>

                  <Button className="btn-topcar">Ver detalles</Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-4">
          <Button className="btn-hero" href="/catalogo">
            Ver catálogo completo
          </Button>
        </div>
      </Container>
    </section>
  );
}
