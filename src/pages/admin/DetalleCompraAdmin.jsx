import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompraById, evaluarFinanciamiento, aprobarCompra } from '../../api/compras.api';
import { getPagosPorCompra } from '../../api/pagos.api';
import StatusBadge from '../../components/shared/StatusBadge';
import PaymentTable from '../../components/shared/PaymentTable';

const DetalleCompraAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [compra, setCompra] = useState(null);
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEvaluarModal, setShowEvaluarModal] = useState(false);
    const [showAprobarModal, setShowAprobarModal] = useState(false);
    const [evalForm, setEvalForm] = useState({ aprobado: false, comentarios: '' });
    const [aprobarForm, setAprobarForm] = useState({ aprobado: true, comentarios: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const compraData = await getCompraById(id, navigate);
                setCompra(compraData);

                const pagosData = await getPagosPorCompra(id, navigate);
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
            <Container className="d-flex justify-content-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
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
        <Container className="mt-4">
            <h2>Detalle de Compra (Admin)</h2>

            <Row className="mb-3">
                <Col>
                    <Button variant="secondary" onClick={() => navigate('/admin/compras')}>
                        ← Volver a Revisar Compras
                    </Button>
                </Col>
                <Col xs="auto">
                    <Button variant="info" onClick={() => setShowEvaluarModal(true)}>
                        Evaluar Financiamiento
                    </Button>
                    <Button variant="success" className="ms-2" onClick={() => setShowAprobarModal(true)}>
                        Aprobar Compra
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col md={8}>
                    <Card className="mb-4">
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
                    <Card>
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

            <Card className="mt-4">
                <Card.Header>
                    <h5>Pagos de Esta Compra</h5>
                </Card.Header>
                <Card.Body>
                    <PaymentTable payments={pagos} />
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
    );
};

export default DetalleCompraAdmin;