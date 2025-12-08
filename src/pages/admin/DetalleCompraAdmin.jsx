import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompraById, evaluarFinanciamiento, aprobarCompra } from '../../api/compras.api';
import { getPagosPorCompra } from '../../api/pagos.api';
import StatusBadge from '../../components/shared/StatusBadge';
import PaymentTable from '../../components/shared/PaymentTable';
import PaymentSchedule from '../../components/shared/PaymentSchedule';
import { calculateAmortizationSchedule } from '../../utils/amortization.util';
import Sidebar from '../../components/layout/Sidebar';

const DetalleCompraAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [compra, setCompra] = useState(null);
    const [pagos, setPagos] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEvaluarModal, setShowEvaluarModal] = useState(false);
    const [showAprobarModal, setShowAprobarModal] = useState(false);
    const [evalForm, setEvalForm] = useState({ aprobado: false, comentarios: '' });
    const [aprobarForm, setAprobarForm] = useState({ aprobado: true, comentarios: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(`🔍 DetalleCompraAdmin - Fetching compra with ID: ${id}`);
                const compraData = await getCompraById(id, navigate);
                console.log(`✅ DetalleCompraAdmin - Compra data received:`, compraData);
                setCompra(compraData);

                if (compraData?.cotizacion) {
                    const precio = compraData.cotizacion.coche?.precioBase || 0;
                    const enganche = compraData.cotizacion.enganche || 0;
                    const principal = compraData.cotizacion.montoFinanciar || (precio - enganche);
                    const rate = (compraData.cotizacion.tasaInteres || 0) * 100; 
                    const months = compraData.cotizacion.plazoMeses || 0;

                    if (principal > 0 && months > 0) {
                        const calculatedSchedule = calculateAmortizationSchedule(principal, rate, months);
                        setSchedule(calculatedSchedule);
                    }
                }

                const pagosData = await getPagosPorCompra(id, navigate);
                console.log(`✅ DetalleCompraAdmin - Pagos data received:`, pagosData);
                setPagos(pagosData);
            } catch (err) {
                setError('Error al cargar los detalles de la compra');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleEvaluar = async () => {
        try {
            await evaluarFinanciamiento(id, evalForm, navigate);
            alert('Evaluación realizada exitosamente');
            setShowEvaluarModal(false);
            // Recargar datos
            window.location.reload();
        } catch (err) {
            alert('Error al evaluar financiamiento');
        }
    };

    const handleAprobar = async () => {
        try {
            await aprobarCompra(id, aprobarForm, navigate);
            alert('Compra aprobada exitosamente');
            setShowAprobarModal(false);
            // Recargar datos
            window.location.reload();
        } catch (err) {
            alert('Error al aprobar compra');
        }
    };

    if (loading) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <div className="dashboard-container">
                    <Container className="d-flex justify-content-center mt-5">
                        <Spinner animation="border" />
                    </Container>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <div className="dashboard-container">
                    <Container className="mt-4">
                        <Alert variant="danger">{error}</Alert>
                    </Container>
                </div>
            </div>
        );
    }

    if (!compra) {
        return (
            <Container className="mt-4">
                <Alert variant="warning">Compra no encontrada.</Alert>
            </Container>
        );
    }

    const { cotizacion, cliente, vendedor, status, saldoPendiente, createdAt } = compra;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-container">
                <Container className="mt-4">
                    <h2>Detalle de Compra (Admin)</h2>

                    <Row className="mb-3">
                        <Col>
                            <Button variant="secondary" onClick={() => navigate('/admin/compras')}>
                                ← Volver a Revisar Compras
                            </Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={8}>
                            <Card className="mb-4 admin-card">
                                <Card.Header>
                                    <h5>Información de la Compra</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <p><strong>ID:</strong> {compra._id}</p>
                                            <p><strong>Estado:</strong> <StatusBadge status={status} /></p>
                                            <p><strong>Fecha de Creación:</strong> {new Date(createdAt).toLocaleDateString('es-ES')}</p>
                                            <p><strong>Saldo Pendiente:</strong> ${saldoPendiente}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>Cliente:</strong> {cliente?.nombre}</p>
                                            <p><strong>Vendedor:</strong> {vendedor?.nombre || 'N/A'}</p>
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col md={6}>
                                            <h6>Datos del Coche</h6>
                                            {typeof cotizacion?.coche === 'object' ? (
                                                <>
                                                    <p><strong>Marca:</strong> {cotizacion?.coche?.marca}</p>
                                                    <p><strong>Modelo:</strong> {cotizacion?.coche?.modelo}</p>
                                                    <p><strong>Precio:</strong> ${cotizacion?.coche?.precioBase?.toLocaleString('es-ES')}</p>
                                                </>
                                            ) : (
                                                <p><strong>ID del Coche:</strong> {cotizacion?.coche}</p>
                                            )}
                                        </Col>
                                        {cotizacion && (
                                            <Col md={6}>
                                                <h6>Datos del Financiamiento</h6>
                                                <p><strong>Pago Mensual:</strong> ${cotizacion.pagoMensual?.toLocaleString('es-ES')}</p>
                                                <p><strong>Plazo:</strong> {cotizacion.plazoMeses} meses</p>
                                                <p><strong>Tasa:</strong> {(cotizacion.tasaInteres * 100)}%</p>
                                            </Col>
                                        )}
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="admin-card">
                                <Card.Header>
                                    <h5>Resumen</h5>
                                </Card.Header>
                                <Card.Body>
                                    <p><strong>Total Pagado:</strong> ${(compra.totalPagado || 0).toLocaleString('es-ES')}</p>
                                    <p><strong>Próximo Pago:</strong> {compra.proximoPago ? new Date(compra.proximoPago).toLocaleDateString('es-ES') : 'N/A'}</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Card className="mt-4 admin-card">
                        <Card.Header>
                            <h5>Pagos de Esta Compra</h5>
                        </Card.Header>
                        <Card.Body>
                            <PaymentTable payments={pagos} />
                        </Card.Body>
                    </Card>

                    <Card className="mt-4 mb-5 admin-card">
                        <Card.Header>
                            <h5>Calendario de Pagos (Proyección)</h5>
                        </Card.Header>
                        <Card.Body>
                            <PaymentSchedule schedule={schedule} />
                        </Card.Body>
                    </Card>

                    {/* Modal Evaluar Financiamiento */}
                    <Modal show={showEvaluarModal} onHide={() => setShowEvaluarModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Evaluar Financiamiento</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Aprobado</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        checked={evalForm.aprobado}
                                        onChange={(e) => setEvalForm({ ...evalForm, aprobado: e.target.checked })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Comentarios</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={evalForm.comentarios}
                                        onChange={(e) => setEvalForm({ ...evalForm, comentarios: e.target.value })}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEvaluarModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={handleEvaluar}>
                                Evaluar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Modal Aprobar Compra */}
                    <Modal show={showAprobarModal} onHide={() => setShowAprobarModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Aprobar Compra</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Aprobado</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        checked={aprobarForm.aprobado}
                                        onChange={(e) => setAprobarForm({ ...aprobarForm, aprobado: e.target.checked })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Comentarios</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={aprobarForm.comentarios}
                                        onChange={(e) => setAprobarForm({ ...aprobarForm, comentarios: e.target.value })}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowAprobarModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={handleAprobar}>
                                Aprobar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </div>
        </div>
    );
};

export default DetalleCompraAdmin;