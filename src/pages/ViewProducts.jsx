import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Spinner, Modal, Form } from "react-bootstrap";
import { Car, Calendar, DollarSign, Gauge, Settings, Palette, Hash } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import api from "../services/api";
import { crearCotizacion } from "../api/pricings.api";
import DashboardLayout from "../components/layout/DashboardLayaut";
import "./products.css";

export default function ViewProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({ enganchePercent: 20, plazoMeses: 12 });
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/products/tienda");
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
            toast.error("Error al cargar los productos");
        } finally {
            setLoading(false);
        }
    };

    const handleCotizar = (product) => {
        setSelectedProduct(product);
        // Reset defaults when opening modal
        setFormData({ enganchePercent: 20, plazoMeses: 12 });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
        setFormData({ enganchePercent: 20, plazoMeses: 12 });
    };

    const calculateMontoEnganche = () => {
        if (!selectedProduct) return 0;
        return (selectedProduct.precioBase * (formData.enganchePercent / 100));
    };

    const calculateMensualidad = () => {
        if (!selectedProduct) return 0;
        const montoEnganche = calculateMontoEnganche();
        const montoAFinanciar = selectedProduct.precioBase - montoEnganche;
        return montoAFinanciar / formData.plazoMeses;
    };

    const handleSubmitCotizacion = async (e) => {
        e.preventDefault();
        if (!user?._id) {
            toast.error("Usuario no identificado");
            return;
        }

        try {
            const engancheMonto = calculateMontoEnganche();
            const payload = {
                cocheId: selectedProduct._id,
                enganche: engancheMonto,
                plazoMeses: parseInt(formData.plazoMeses)
            };

            await crearCotizacion(payload, () => { });
            toast.success("Cotización creada exitosamente. Espera la aprobación del vendedor.");
            handleCloseModal();
        } catch (err) {
            toast.error("Error al crear la cotización");
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Container fluid className="py-4">
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Cargando productos...</p>
                    </div>
                </Container>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Container fluid className="py-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5">
                    <div>
                        <h1 className="display-5 fw-bold mb-2" style={{ color: 'var(--text-main)' }}>
                            <Car className="me-3 text-primary" size={40} />
                            Catálogo de Vehículos
                        </h1>
                        <p className="text-muted mb-0 fs-5">
                            Descubre el vehículo perfecto para ti
                        </p>
                    </div>
                    <div className="mt-3 mt-md-0">
                        <Badge bg="primary" className="fs-6 px-4 py-2 shadow-sm">
                            <Car size={16} className="me-2" />
                            {products.length} vehículos disponibles
                        </Badge>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-5 glass-panel">
                        <Car size={64} className="text-muted mb-3" />
                        <h4>No hay vehículos disponibles</h4>
                        <p className="text-muted">Los vehículos aparecerán aquí cuando sean agregados al sistema.</p>
                    </div>
                ) : (
                    <Row>
                        {products.map((product) => (
                            <Col key={product._id} md={6} lg={4} className="mb-4">
                                <Card className="product-card h-100">
                                    <div className="product-img-container">
                                        <img
                                            src={product.imageUrl || "https://via.placeholder.com/400x300?text=Vehículo"}
                                            alt={`${product.marca} ${product.modelo}`}
                                            className="product-img"
                                            loading="lazy"
                                        />
                                    </div>

                                    <Card.Body className="product-body">
                                        <div className="product-header mb-4">
                                            <h5 className="product-title fw-bold mb-2">{product.marca} {product.modelo}</h5>
                                            <div className="product-meta d-flex align-items-center gap-3">
                                                <small className="text-muted d-flex align-items-center">
                                                    <Calendar size={14} className="me-1" />
                                                    {product.ano}
                                                </small>
                                                <Badge
                                                    bg="success"
                                                    className="condition-badge"
                                                >
                                                    Nuevo
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="product-details mb-4">
                                            <div className="price-section mb-3">
                                                <div className="d-flex align-items-center">
                                                    <DollarSign size={16} className="text-primary me-2" />
                                                    <span className="price-amount fw-bold text-primary fs-4">
                                                        ${product.precioBase?.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="specs-grid">
                                                <div className="spec-item d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <Gauge size={14} className="me-2 text-muted" />
                                                        <span className="spec-label">Kilometraje</span>
                                                    </div>
                                                    <span className="spec-value fw-medium">{product.kilometraje?.toLocaleString()} km</span>
                                                </div>

                                                <div className="spec-item d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <Settings size={14} className="me-2 text-muted" />
                                                        <span className="spec-label">Transmisión</span>
                                                    </div>
                                                    <span className="spec-value fw-medium">{product.transmision}</span>
                                                </div>

                                                <div className="spec-item d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <Palette size={14} className="me-2 text-muted" />
                                                        <span className="spec-label">Color</span>
                                                    </div>
                                                    <span className="spec-value fw-medium">{product.color}</span>
                                                </div>

                                                <div className="spec-item d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <Hash size={14} className="me-2 text-muted" />
                                                        <span className="spec-label">Puertas</span>
                                                    </div>
                                                    <span className="spec-value fw-medium">{product.numPuertas}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="product-footer mt-auto">
                                            <div className="engine-info mb-3">
                                                <small className="text-muted">
                                                    <strong>Tipo:</strong> {product.tipo} • <strong>Motor:</strong> {product.motor}
                                                </small>
                                            </div>

                                            <button
                                                className="btn-cotizar w-100"
                                                onClick={() => handleCotizar(product)}
                                            >
                                                Cotizar Vehículo
                                            </button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            {/* Modal de Cotización */}
            <Modal show={showModal} onHide={handleCloseModal} centered dialogClassName="custom-modal" size="lg">
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                    <div className="w-100 text-center">
                        <h4 style={{ color: '#0f172a', fontWeight: '700', margin: 0 }}>ACURA FINANCE</h4>
                    </div>
                </Modal.Header>
                <Modal.Body className="px-5 py-4">
                    {selectedProduct && (
                        <>
                            <div className="text-center p-3 mb-5" style={{ background: '#020617', borderRadius: '0' }}>
                                <h5 className="text-white text-uppercase mb-1" style={{ fontWeight: 800, letterSpacing: '1px' }}>
                                    {selectedProduct.marca} {selectedProduct.modelo}
                                </h5>
                                <p className="text-white m-0 fw-bold">
                                    ${selectedProduct.precioBase?.toLocaleString()}
                                </p>
                            </div>

                            <Form onSubmit={handleSubmitCotizacion}>
                                <Row>
                                    <Col md={12} className="mb-4">
                                        <div className="slider-container">
                                            <span className="slider-label">Elige tu Enganche</span>

                                            <input
                                                type="range"
                                                className="range-slider"
                                                min="20"
                                                max="50"
                                                step="10"
                                                value={formData.enganchePercent}
                                                onChange={(e) => setFormData({ ...formData, enganchePercent: parseInt(e.target.value) })}
                                            />

                                            <div className="slider-ticks">
                                                <span className="tick-label">20</span>
                                                <span className="tick-label">30</span>
                                                <span className="tick-label">40</span>
                                                <span className="tick-label">50</span>
                                            </div>

                                            <div className="summary-box">
                                                <div className="summary-label-section">
                                                    Enganche: {formData.enganchePercent}%
                                                </div>
                                                <div className="summary-value-section">
                                                    ${calculateMontoEnganche()?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pesos
                                                </div>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col md={12} className="mb-4">
                                        <div className="slider-container">
                                            <span className="slider-label">Elige tu Plazo</span>

                                            <input
                                                type="range"
                                                className="range-slider"
                                                min="12"
                                                max="72"
                                                step="12"
                                                value={formData.plazoMeses}
                                                onChange={(e) => setFormData({ ...formData, plazoMeses: parseInt(e.target.value) })}
                                            />

                                            <div className="slider-ticks">
                                                <span className="tick-label">12</span>
                                                <span className="tick-label">24</span>
                                                <span className="tick-label">36</span>
                                                <span className="tick-label">48</span>
                                                <span className="tick-label">60</span>
                                                <span className="tick-label">72</span>
                                            </div>

                                            <div className="summary-box">
                                                <div className="summary-label-section">
                                                    Plazo: {formData.plazoMeses} meses
                                                </div>
                                                <div className="summary-value-section">
                                                    Mensualidad: ${calculateMensualidad()?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <div className="text-center mt-4">
                                    <p className="text-muted mb-4 fs-5">Déjanos tus datos y en breve nos comunicaremos contigo.</p>
                                </div>

                                <div className="modal-action-buttons">
                                    <div className="d-flex gap-3">
                                        <button
                                            type="button"
                                            className="btn-modal-secondary flex-fill"
                                            onClick={handleCloseModal}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-modal-primary flex-fill"
                                        >
                                            Crear Cotización
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </DashboardLayout>
    );
}