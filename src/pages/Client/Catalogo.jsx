import { useEffect, useState } from "react";
import api from "../../services/api";
import { Container, Row, Col, Modal, Form, Button, Badge, Table, InputGroup } from "react-bootstrap";
import { ShoppingCart, FileText, Info, CheckCircle, Car, Search, Filter, X, TrendingUp, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import "./ClientStyles.css";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [selectedAuto, setSelectedAuto] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCondicion, setFilterCondicion] = useState("Todos");

  const [enganche, setEnganche] = useState(0);
  const [plazo, setPlazo] = useState(48);
  const [modalType, setModalType] = useState(null);

  const [financialData, setFinancialData] = useState({
    ingresoMensual: "",
    gastosMensuales: "",
    otrosIngresos: 0,
    deudasActuales: 0
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const { data } = await api.get("/products/tienda");
      setProductos(data);
    } catch (error) {
      toast.error("Error cargando el catálogo");
    } finally {
      setLoading(false);
    }
  };

  const filteredProductos = productos.filter(auto => {
    const matchSearch = `${auto.marca} ${auto.modelo}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCondicion = filterCondicion === "Todos" || auto.condicion === filterCondicion;
    return matchSearch && matchCondicion;
  });

    const handleCotizar = async () => {
    if (enganche >= selectedAuto.precioBase)
      return toast.error("El enganche debe ser menor al precio");

    try {
      const payload = {
        cocheId: selectedAuto._id,
        enganche: Number(enganche),
        plazoMeses: Number(plazo)
      };

      const { data } = await api.post("/cotizacion", payload);

      if (modalType === "cotizar") {
        toast.success("¡Cotización creada.", { duration: 5000 });
        handleClose();
      }

      return data._id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al cotizar");
      return null;
    }
  };

  const handleComprar = async () => {
    const cotizacionId = await handleCotizar();
    if (!cotizacionId) return;

    try {
      const compraPayload = {
        cotizacionId,
        datosFinancieros: {
          ingresoMensual: Number(financialData.ingresoMensual),
          gastosMensuales: Number(financialData.gastosMensuales),
          otrosIngresos: Number(financialData.otrosIngresos),
          deudasActuales: Number(financialData.deudasActuales)
        }
      };

      await api.post("/compra", compraPayload);
      toast.success("Solicitud enviada. Consultaremos tu Buró.", { duration: 6000 });
      handleClose();
    } catch {
      toast.error("Error al procesar la solicitud de compra");
    }
  };


    const openModal = (auto, type) => {
    setSelectedAuto(auto);
    setModalType(type);
    setEnganche(auto.precioBase * 0.20);
  };

  const handleClose = () => {
    setSelectedAuto(null);
    setModalType(null);
  };

  return (
    <Container fluid className="py-4 catalog-container">
      <div className="catalog-header mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h2 className="fw-bold text-dark mb-1 catalog-title">Vehículos Disponibles</h2>
            <p className="text-muted mb-0">{filteredProductos.length} vehículos encontrados</p>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <InputGroup className="search-bar">
              <InputGroup.Text className="bg-white border-end-0">
                <Search size={18} className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                placeholder="Buscar marca o modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-start-0 ps-0"
              />
              {searchTerm && (
                <Button variant="link" className="text-muted" onClick={() => setSearchTerm("")}>
                  <X size={18} />
                </Button>
              )}
            </InputGroup>

            <div className="filter-buttons">
              {["Todos", "Nuevo", "Seminuevo"].map(cond => (
                <Button
                  key={cond}
                  variant={filterCondicion === cond ? "primary" : "outline-secondary"}
                  size="sm"
                  className="btn-rounded px-3"
                  onClick={() => setFilterCondicion(cond)}
                >
                  <Filter size={14} className="me-1" />
                  {cond}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Row className="g-4">
        {filteredProductos.map(auto => (
          <Col key={auto._id} md={6} lg={4} xl={3}>
            <div className="product-card h-100">
              <div className="product-img-container">
                <img src={auto.imageUrl} className="product-img" alt="auto" />
                <Badge bg="primary" className="product-badge">{auto.condicion}</Badge>

                {auto.condicion === "Seminuevo" && (
                  <div className="offer-badge">
                    <TrendingUp size={14} /><span>Oferta</span>
                  </div>
                )}
              </div>

              <div className="product-body">
                <div className="product-header mb-3">
                  <h5 className="fw-bold mb-1">{auto.marca} {auto.modelo}</h5>
                  <Badge bg="light" text="dark">{auto.ano}</Badge>
                </div>

                <h4 className="price-tag mb-3">${auto.precioBase.toLocaleString()}<span className="price-currency">MXN</span></h4>

                <div className="product-specs mb-3">
                  <div className="spec-item"><Car size={14} /><small>{auto.transmision}</small></div>
                  <div className="spec-item"><Calendar size={14} /><small>{auto.kilometraje.toLocaleString()} km</small></div>
                </div>

                <div className="product-actions">
                  <Button variant="light" className="btn-action-secondary" onClick={() => openModal(auto, 'detalle')}>
                    <Info size={18} /><span>Detalles</span>
                  </Button>

                  <div className="d-flex gap-2 flex-fill">
                    <Button variant="outline-primary" className="btn-action flex-fill" onClick={() => openModal(auto, 'cotizar')}>
                      <FileText size={18} />
                    </Button>
                    <Button variant="primary" className="btn-action flex-fill" onClick={() => openModal(auto, 'comprar')}>
                      <ShoppingCart size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {selectedAuto && (
        <Modal show onHide={handleClose} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">
              {modalType === "detalle" && "Detalles del Vehículo"}
              {modalType === "cotizar" && "Cotizar Vehículo"}
              {modalType === "comprar" && "Solicitud de Compra"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {modalType === "detalle" && (
              <div>
                <h4 className="fw-bold mb-3">{selectedAuto.marca} {selectedAuto.modelo}</h4>

                <img
                  src={selectedAuto.imageUrl}
                  alt="auto"
                  className="w-100 rounded mb-3"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />

                <Row className="g-3">
                  <Col md={6}>
                    <p><strong>Condición:</strong> {selectedAuto.condicion}</p>
                    <p><strong>Año:</strong> {selectedAuto.ano}</p>
                    <p><strong>Transmisión:</strong> {selectedAuto.transmision}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Kilometraje:</strong> {selectedAuto.kilometraje.toLocaleString()} km</p>
                    <p><strong>Color:</strong> {selectedAuto.color}</p>
                    <p><strong>Motor:</strong> {selectedAuto.motor}</p>
                  </Col>
                </Row>

                <h4 className="fw-bold mt-3">Precio</h4>
                <h3 className="text-primary fw-bold">
                  ${selectedAuto.precioBase.toLocaleString()} MXN
                </h3>
              </div>
            )}

            {(modalType === "cotizar" || modalType === "comprar") && (
              <>
                <h4 className="fw-bold mb-3">
                  {selectedAuto.marca} {selectedAuto.modelo}
                </h4>

                <p className="text-muted">
                  Precio base: <strong>${selectedAuto.precioBase.toLocaleString()} MXN</strong>
                </p>

                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Enganche (mínimo 20%)</Form.Label>
                      <Form.Control
                        type="number"
                        value={enganche}
                        min={selectedAuto.precioBase * 0.2}
                        max={selectedAuto.precioBase - 1}
                        onChange={(e) => setEnganche(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Plazo (meses)</Form.Label>
                      <Form.Select value={plazo} onChange={(e) => setPlazo(Number(e.target.value))}>
                        {[12, 24, 36, 48].map(p => (
                          <option key={p} value={p}>{p} meses</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {enganche > 0 && (
                  <div className="bg-light p-3 rounded border mt-2">
                    <h5 className="fw-bold">Resumen Aproximado</h5>
                    <p className="mb-1">Enganche: ${enganche.toLocaleString()}</p>

                    <p className="mb-1">
                      Monto a financiar: <strong>
                        ${(selectedAuto.precioBase - enganche).toLocaleString()}
                      </strong>
                    </p>

                    <p className="fw-bold text-primary">
                      Mensualidad estimada: ${( (selectedAuto.precioBase - enganche) / plazo ).toLocaleString(undefined, { maximumFractionDigits: 0 }) } MXN
                    </p>
                  </div>
                )}

                {modalType === "comprar" && (
                  <>
                    <hr className="my-4" />
                    <h4 className="fw-bold mb-3">Datos Financieros</h4>

                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Ingreso Mensual</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Ej: 18000"
                            value={financialData.ingresoMensual}
                            onChange={(e) =>
                              setFinancialData({ ...financialData, ingresoMensual: e.target.value })
                            }
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Gastos Mensuales</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Ej: 6000"
                            value={financialData.gastosMensuales}
                            onChange={(e) =>
                              setFinancialData({ ...financialData, gastosMensuales: e.target.value })
                            }
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Otros Ingresos</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Opcional"
                            value={financialData.otrosIngresos}
                            onChange={(e) =>
                              setFinancialData({ ...financialData, otrosIngresos: e.target.value })
                            }
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Deudas Actuales</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Ej: 2000"
                            value={financialData.deudasActuales}
                            onChange={(e) =>
                              setFinancialData({ ...financialData, deudasActuales: e.target.value })
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}
              </>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>

            {modalType === "cotizar" && (
              <Button variant="primary" onClick={handleCotizar}>
                <FileText size={18} className="me-2" /> Generar Cotización
              </Button>
            )}

            {modalType === "comprar" && (
              <Button variant="success" onClick={handleComprar}>
                <CheckCircle size={18} className="me-2" /> Enviar Solicitud
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}