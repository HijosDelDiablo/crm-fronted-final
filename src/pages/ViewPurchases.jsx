import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button, Modal, Spinner, ProgressBar } from "react-bootstrap";
import { Calendar, DollarSign, CheckCircle, XCircle, Clock, AlertCircle, FileText } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import DashboardLayout from "../components/layout/DashboardLayaut";
import "../pages/Client/ClientStyles.css";

export default function ViewPurchases() {
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompra, setSelectedCompra] = useState(null);

    useEffect(() => {
        fetchCompras();
    }, []);

    const fetchCompras = async () => {
        try {
            const { data } = await api.get("/compra/mis-compras");
            setCompras(data);
        } catch (err) {
            console.error("Error fetching purchases:", err);
            toast.error("Error al cargar tus compras");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => setSelectedCompra(null);

    const getStatusConfig = (status) => {
        switch (status) {
            case "Aprobada":
            case "Completada":
                return { color: "success", icon: <CheckCircle size={16} />, text: "¡Aprobada!" };
            case "Rechazada":
                return { color: "danger", icon: <XCircle size={16} />, text: "Rechazada" };
            case "Pendiente":
            case "En revisión":
            case "Analizando Buró":
                return { color: "warning", icon: <Clock size={16} />, text: "Analizando Buró" };
            default:
                return { color: "secondary", icon: <AlertCircle size={16} />, text: "Pendiente" };
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <Spinner animation="border" variant="primary" />
                </Container>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Container fluid className="py-4">
                <h2 className="mb-4 fw-bold text-dark">Mis Solicitudes de Compra</h2>

                {compras.length === 0 ? (
                    <div className="text-center py-5 glass-panel">
                        <FileText size={64} className="text-muted mb-3" />
                        <h4>Aún no tienes solicitudes</h4>
                        <p className="text-muted">Ve al catálogo para cotizar y solicitar tu próximo auto.</p>
                        <Button href="/client/catalogo" variant="primary" className="btn-rounded mt-2">
                            Ir al Catálogo
                        </Button>
                    </div>
                ) : (
                    <Row>
                        {compras.map((compra) => {
                            const statusCfg = getStatusConfig(compra.status);
                            const coche = compra.cotizacion?.coche || {};

                            return (
                                <Col key={compra._id} md={6} lg={4} className="mb-4">
                                    <div className="product-card h-100 d-flex flex-column">
                                        <div className="product-img-container" style={{ height: "160px" }}>
                                            <img
                                                src={coche.imageUrl || "https://via.placeholder.com/400x300?text=Auto"}
                                                alt={coche.modelo}
                                                className="product-img"
                                            />
                                            <Badge bg={statusCfg.color} className="product-badge d-flex align-items-center gap-1">
                                                {statusCfg.icon} {statusCfg.text}
                                            </Badge>
                                        </div>

                                        <div className="product-body flex-grow-1">
                                            <h5 className="fw-bold mb-1">{coche.marca} {coche.modelo}</h5>
                                            <small className="text-muted mb-3 d-block">Solicitado el: {new Date(compra.createdAt).toLocaleDateString()}</small>

                                            <div className="p-3 bg-light rounded mb-3">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span>Enganche:</span>
                                                    <span className="fw-bold">${compra.cotizacion?.enganche?.toLocaleString()}</span>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <span>Mensualidad (Est):</span>
                                                    <span className="fw-bold text-primary">${compra.cotizacion?.pagoMensual?.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <Button
                                                variant={`outline-${statusCfg.color}`}
                                                className="w-100 btn-rounded mt-auto"
                                                onClick={() => setSelectedCompra(compra)}
                                            >
                                                Ver Detalles del Crédito
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                )}

                <Modal show={!!selectedCompra} onHide={handleClose} centered size="lg" className="glass-modal">
                    {selectedCompra && (
                        <>
                            <Modal.Header closeButton className={`bg-${getStatusConfig(selectedCompra.status).color} text-white`}>
                                <Modal.Title className="d-flex align-items-center gap-2">
                                    {getStatusConfig(selectedCompra.status).icon}
                                    Estado: {selectedCompra.status}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="p-4">

                                {(selectedCompra.status === 'Pendiente' || selectedCompra.status === 'En revisión') && (
                                    <div className="text-center py-4">
                                        <Spinner animation="grow" variant="warning" className="mb-3" />
                                        <h4>Analizando tu perfil financiero</h4>
                                        <p className="text-muted px-md-5">
                                            Estamos consultando tu Buró de Crédito y calculando tu capacidad de pago.
                                            Este proceso suele tardar entre 24 y 48 horas. Te notificaremos por correo.
                                        </p>
                                        <ProgressBar animated now={60} label="60%" variant="warning" className="mt-3" />
                                    </div>
                                )}

                                {(selectedCompra.status === 'Aprobada' || selectedCompra.status === 'Completada') && (
                                    <div>
                                        <div className="alert alert-success border-0 shadow-sm">
                                            <h4 className="alert-heading fw-bold">¡Felicidades! Tu crédito fue autorizado.</h4>
                                            <p>Ya puedes pasar a la agencia para firmar contrato y recoger tu unidad.</p>
                                        </div>

                                        <h6 className="fw-bold mt-4 mb-3">Condiciones Finales del Banco</h6>
                                        <Row className="g-3">
                                            <Col sm={6}>
                                                <div className="p-3 border rounded bg-light">
                                                    <small className="text-muted d-block">Monto Aprobado</small>
                                                    <h4 className="fw-bold text-success">${selectedCompra.resultadoBanco?.montoAprobado?.toLocaleString() || selectedCompra.cotizacion.montoFinanciado.toLocaleString()}</h4>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="p-3 border rounded bg-light">
                                                    <small className="text-muted d-block">Tasa de Interés Anual</small>
                                                    <h4 className="fw-bold text-dark">{((selectedCompra.resultadoBanco?.tasaInteres || 0.15) * 100).toFixed(1)}%</h4>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="p-3 border rounded bg-light">
                                                    <small className="text-muted d-block">Mensualidad Real</small>
                                                    <h5 className="fw-bold">${selectedCompra.resultadoBanco?.pagoMensual?.toLocaleString() || "Calculando..."}</h5>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="p-3 border rounded bg-light">
                                                    <small className="text-muted d-block">Plazo Autorizado</small>
                                                    <h5 className="fw-bold">{selectedCompra.resultadoBanco?.plazoAprobado || selectedCompra.cotizacion.plazoMeses} Meses</h5>
                                                </div>
                                            </Col>
                                        </Row>

                                        {selectedCompra.resultadoBanco?.condiciones && (
                                            <div className="mt-3">
                                                <strong>Condiciones:</strong>
                                                <ul>
                                                    {selectedCompra.resultadoBanco.condiciones.map((c, i) => <li key={i}>{c}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedCompra.status === 'Rechazada' && (
                                    <div className="text-center">
                                        <div className="mb-3 text-danger">
                                            <AlertCircle size={48} />
                                        </div>
                                        <h4>Solicitud No Aprobada</h4>
                                        <p className="text-muted">
                                            Lamentablemente, en este momento no podemos ofrecerte el financiamiento solicitado.
                                        </p>

                                        <div className="bg-light p-3 rounded text-start mt-4">
                                            <strong className="text-danger d-block mb-2">Motivo del rechazo:</strong>
                                            <p className="mb-0">{selectedCompra.resultadoBanco?.motivoRechazo || "No cumple con las políticas de riesgo actuales."}</p>
                                        </div>

                                        {selectedCompra.resultadoBanco?.sugerencias && (
                                            <div className="mt-3 text-start">
                                                <strong>Sugerencias para mejorar tu perfil:</strong>
                                                <ul className="text-muted small mt-1">
                                                    {selectedCompra.resultadoBanco.sugerencias.map((s, i) => <li key={i}>{s}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                            </Modal.Footer>
                        </>
                    )}
                </Modal>
            </Container>
        </DashboardLayout>
    );
}