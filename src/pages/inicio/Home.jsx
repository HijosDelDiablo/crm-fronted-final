// src/pages/DashboardHome.jsx
import { Container, Row, Col, Card, ProgressBar, Table } from "react-bootstrap";
import DashboardLayout from "../../components/layout/DashboardLayaut";
import "./home.css";

export default function Home() {
  return (
    <DashboardLayout>
      {/* Todo lo que pongas aquí se verá a la derecha del sidebar */}
      <Container fluid className="py-4 dashboard-home">
        {/* Encabezado */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
          <div>
            <h1 className="dashboard-title">Panel principal</h1>
            <p className="dashboard-subtitle mb-0">
              Resumen rápido de tus ventas, autos y actividad reciente.
            </p>
          </div>
        </div>

        {/* Métricas rápidas */}
        <Row className="g-3 mb-4">
          <Col md={3}>
            <Card className="metric-card h-100">
              <Card.Body>
                <div className="metric-label">Autos publicados</div>
                <div className="metric-value">128</div>
                <div className="metric-foot">Nuevos hoy: 6</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="metric-card h-100">
              <Card.Body>
                <div className="metric-label">Autos vendidos (mes)</div>
                <div className="metric-value">34</div>
                <ProgressBar now={68} className="metric-progress" />
                <div className="metric-foot">68% de la meta mensual</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="metric-card h-100">
              <Card.Body>
                <div className="metric-label">Leads activos</div>
                <div className="metric-value">57</div>
                <div className="metric-foot">IA: 12 con alta intención</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="metric-card h-100">
              <Card.Body>
                <div className="metric-label">Seguimientos para hoy</div>
                <div className="metric-value">19</div>
                <div className="metric-foot">No pierdas estos contactos</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Columna izquierda: resumen IA / actividad */}
          <Col lg={7}>
            <Card className="h-100 dashboard-panel">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="panel-title mb-1">Resumen IA del día</h5>
                    <p className="panel-subtitle mb-0">
                      Recomendaciones automáticas para tu siguiente movimiento.
                    </p>
                  </div>
                </div>

                <ul className="dashboard-list">
                  <li>
                    <span className="badge badge-soft">Prioridad alta</span>
                    <div className="list-text">
                      5 clientes han interactuado con tus autos SUV en las
                      últimas 24 horas. <strong>Recomendado:</strong> contacto
                      hoy mismo.
                    </div>
                  </li>
                  <li>
                    <span className="badge badge-soft">Inventario</span>
                    <div className="list-text">
                      Tu stock de sedanes compactos está al 35%.{" "}
                      <strong>Recomendado:</strong> revisar compras y campañas.
                    </div>
                  </li>
                  <li>
                    <span className="badge badge-soft">Seguimiento</span>
                    <div className="list-text">
                      7 cotizaciones enviadas hace más de 5 días sin respuesta.{" "}
                      <strong>Recomendado:</strong> hacer llamada de cierre.
                    </div>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>

          {/* Columna derecha: top autos más vendidos */}
          <Col lg={5}>
            <Card className="h-100 dashboard-panel">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="panel-title mb-1">Top autos más vendidos</h5>
                    <p className="panel-subtitle mb-0">
                      Modelos que mejor están funcionando este mes.
                    </p>
                  </div>
                  {/* Aquí luego puedes poner un select de rango de fechas */}
                </div>

                <Table
                  responsive
                  borderless
                  size="sm"
                  className="mb-0 top-cars-table"
                >
                  <thead>
                    <tr>
                      <th>Modelo</th>
                      <th className="text-end">Unidades</th>
                      <th className="text-end">Participación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Tesla Model 3</td>
                      <td className="text-end">12</td>
                      <td className="text-end">24%</td>
                    </tr>
                    <tr>
                      <td>Ford Bronco Sport</td>
                      <td className="text-end">9</td>
                      <td className="text-end">18%</td>
                    </tr>
                    <tr>
                      <td>Chevrolet Onix</td>
                      <td className="text-end">7</td>
                      <td className="text-end">14%</td>
                    </tr>
                    <tr>
                      <td>Kia Sportage</td>
                      <td className="text-end">6</td>
                      <td className="text-end">12%</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
}
