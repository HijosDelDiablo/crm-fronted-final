import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Spinner } from "react-bootstrap";
import { Car, Calendar, DollarSign, Gauge, Settings, Palette, Hash } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import DashboardLayout from "../components/layout/DashboardLayaut";
import "./products.css";

export default function ViewProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/products/all");
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
            toast.error("Error al cargar los productos");
        } finally {
            setLoading(false);
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
                        <h1 className="display-5 fw-bold text-dark mb-2">
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
                                        <Badge
                                            bg={product.condicion === "Nuevo" ? "success" : "warning"}
                                            className="product-badge"
                                        >
                                            {product.condicion}
                                        </Badge>
                                    </div>

                                    <Card.Body className="product-body">
                                        <div className="mb-3">
                                            <h5 className="fw-bold mb-1">{product.marca} {product.modelo}</h5>
                                            <small className="text-muted d-block mb-2">
                                                <Calendar size={14} className="me-1" />
                                                {product.ano}
                                            </small>
                                        </div>

                                        <div className="product-details mb-3">
                                            <div className="detail-row">
                                                <DollarSign size={14} />
                                                <span className="fw-bold text-primary fs-5">
                                                    ${product.precioBase?.toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="detail-row">
                                                <Gauge size={14} />
                                                <span>{product.kilometraje?.toLocaleString()} km</span>
                                            </div>

                                            <div className="detail-row">
                                                <Settings size={14} />
                                                <span>{product.transmision}</span>
                                            </div>

                                            <div className="detail-row">
                                                <Palette size={14} />
                                                <span>{product.color}</span>
                                            </div>

                                            <div className="detail-row">
                                                <Hash size={14} />
                                                <span>{product.numPuertas} puertas</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <small className="text-muted">
                                                Tipo: {product.tipo} • Motor: {product.motor}
                                            </small>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </DashboardLayout>
    );
}