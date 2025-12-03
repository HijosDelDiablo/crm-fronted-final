import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { Car, Star, TrendingUp, Users } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../services/api";
import DashboardLayout from "../components/layout/DashboardLayaut";
import "../pages/products.css";

export default function DashboardHome() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchRandomProducts();
    }, []);

    const fetchRandomProducts = async () => {
        try {
            const { data } = await api.get("/products/all");
            // Get 3 random products
            const shuffled = data.sort(() => 0.5 - Math.random());
            const randomProducts = shuffled.slice(0, 3);
            setProducts(randomProducts);
        } catch (err) {
            console.error("Error fetching products:", err);
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
                        <p className="mt-2">Cargando...</p>
                    </div>
                </Container>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Container fluid className="py-4">
                {/* Welcome Section */}
                <div className="mb-5">
                    <div className="text-center mb-4">
                        <h1 className="display-4 fw-bold text-white mb-3">
                            ¡Bienvenido a Autobots IA! 👋
                        </h1>
                        <p className="lead text-muted mb-4">
                            {user?.nombre ? `Hola ${user.nombre},` : "Hola,"} estamos encantados de tenerte aquí.
                            Explora nuestro catálogo de vehículos y encuentra el auto de tus sueños.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <Row className="g-4 mb-5">
                        <Col md={3}>
                            <Card className="text-center border-0 shadow-sm h-100 bg-dark">
                                <Card.Body className="py-4">
                                    <Car size={40} className="text-primary mb-3" />
                                    <h3 className="fw-bold text-primary mb-1">{products.length > 0 ? products.length : "50+"}</h3>
                                    <p className="text-white mb-0">Vehículos Disponibles</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-center border-0 shadow-sm h-100 bg-dark">
                                <Card.Body className="py-4">
                                    <Star size={40} className="text-warning mb-3" />
                                    <h3 className="fw-bold text-warning mb-1">4.8</h3>
                                    <p className="text-white mb-0">Calificación Promedio</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-center border-0 shadow-sm h-100 bg-dark">
                                <Card.Body className="py-4">
                                    <TrendingUp size={40} className="text-success mb-3" />
                                    <h3 className="fw-bold text-success mb-1">98%</h3>
                                    <p className="text-white mb-0">Satisfacción del Cliente</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-center border-0 shadow-sm h-100 bg-dark">
                                <Card.Body className="py-4">
                                    <Users size={40} className="text-info mb-3" />
                                    <h3 className="fw-bold text-info mb-1">24/7</h3>
                                    <p className="text-white mb-0">Atención al Cliente</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Featured Products Section */}
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold text-white mb-0">
                            <Car className="me-2 text-primary" />
                            Vehículos Destacados
                        </h2>
                        <a href="/panel/carros" className="btn btn-outline-primary">
                            Ver Todos los Vehículos
                        </a>
                    </div>

                    {products.length === 0 ? (
                        <Alert variant="info" className="text-center py-5">
                            <Car size={48} className="mb-3 text-muted" />
                            <h5>No hay vehículos disponibles en este momento</h5>
                            <p className="mb-0">Estamos trabajando para agregar más opciones a nuestro catálogo.</p>
                        </Alert>
                    ) : (
                        <Row>
                            {products.map((product) => (
                                <Col key={product._id} md={6} lg={4} className="mb-4">
                                    <Card className="product-card h-100 shadow-sm border-0">
                                        <div className="product-img-container">
                                            <img
                                                src={product.imageUrl || "https://via.placeholder.com/400x300?text=Vehículo"}
                                                alt={`${product.marca} ${product.modelo}`}
                                                className="product-img"
                                            />
                                            <div className="product-badge bg-primary">
                                                Destacado
                                            </div>
                                        </div>

                                        <Card.Body className="product-body d-flex flex-column">
                                            <div className="mb-3">
                                                <h5 className="fw-bold mb-1">{product.marca} {product.modelo}</h5>
                                                <small className="text-muted d-block mb-2">
                                                    {product.ano} • {product.kilometraje?.toLocaleString()} km
                                                </small>
                                            </div>

                                            <div className="product-details mb-3">
                                                <div className="detail-row">
                                                    <span className="fw-bold text-primary fs-5">
                                                        ${product.precioBase?.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="detail-row">
                                                    <small className="text-muted">
                                                        {product.transmision} • {product.tipo} • {product.color}
                                                    </small>
                                                </div>
                                            </div>

                                            <div className="mt-auto">
                                                <a
                                                    href={`/client/catalogo`}
                                                    className="btn btn-dark-blue w-100"
                                                >
                                                    Ver Detalles
                                                </a>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            </Container>
        </DashboardLayout>
    );
}