import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCotizacionesAprobadasCliente } from '../../api/pricings.api';
import { iniciarProcesoCompra } from '../../api/compras.api';
import StatusBadge from '../../components/shared/StatusBadge';
import DashboardLayout from '../../components/layout/DashboardLayaut';

const MisCotizaciones = () => {
    const [cotizaciones, setCotizaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);
    const [formData, setFormData] = useState({
        ingresos: '',
        gastos: '',
        otrosDatos: ''
    });
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        const fetchCotizaciones = async () => {
            if (!user?._id) return;

            try {
                const data = await getCotizacionesAprobadasCliente(user._id, navigate);
                setCotizaciones(data);
            } catch (err) {
                setError('Error al cargar las cotizaciones');
            } finally {
                setLoading(false);
            }
        };

        fetchCotizaciones();
    }, [user, navigate]); const handleIniciarCompra = (cotizacion) => {
        setSelectedCotizacion(cotizacion);
        setShowModal(true);
    };

    const handleSubmitCompra = async () => {
        if (!selectedCotizacion) return;

        try {
            const payload = {
                cotizacionId: selectedCotizacion._id,
                datosFinancieros: {
                    ingresos: parseFloat(formData.ingresos),
                    gastos: parseFloat(formData.gastos),
                    otrosDatos: formData.otrosDatos
                }
            };

            await iniciarProcesoCompra(payload, navigate);
            alert('Proceso de compra iniciado exitosamente');
            setShowModal(false);
            setFormData({ ingresos: '', gastos: '', otrosDatos: '' });
            // Opcional: recargar cotizaciones o navegar a compras
        } catch (err) {
            alert('Error al iniciar el proceso de compra');
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Container className="d-flex justify-content-center mt-5">
                    <Spinner animation="border" />
                </Container>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <Container className="mt-4">
                    <Alert variant="danger">{error}</Alert>
                </Container>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Container className="mt-4">
                <h2>Mis Cotizaciones Aprobadas</h2>
                {cotizaciones.length === 0 ? (
                    <Alert variant="info">No tienes cotizaciones aprobadas.</Alert>
                ) : (
                    <Row>
                        {cotizaciones.map((cotizacion) => (
                            <Col md={6} lg={4} key={cotizacion._id}>
                                <Card className="mb-3 shadow-sm">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h6 className="mb-1">
                                                    {cotizacion.coche?.marca} {cotizacion.coche?.modelo}
                                                </h6>
                                                <small className="text-muted">
                                                    ID: {cotizacion._id}
                                                </small>
                                            </div>
                                            <StatusBadge status={cotizacion.estado} />
                                        </div>
                                        <p className="mb-1">
                                            <strong>Plazo:</strong> {cotizacion.plazo} meses
                                        </p>
                                        <p className="mb-1">
                                            <strong>Pago Mensual:</strong> ${cotizacion.pagoMensual?.toLocaleString('es-ES')}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Total Pagado:</strong> ${cotizacion.totalPagado?.toLocaleString('es-ES')}
                                        </p>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => handleIniciarCompra(cotizacion)}
                                        >
                                            Iniciar Proceso de Compra
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Iniciar Proceso de Compra</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Ingresos Mensuales</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.ingresos}
                                    onChange={(e) => setFormData({ ...formData, ingresos: e.target.value })}
                                    placeholder="Ingrese sus ingresos mensuales"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Gastos Mensuales</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.gastos}
                                    onChange={(e) => setFormData({ ...formData, gastos: e.target.value })}
                                    placeholder="Ingrese sus gastos mensuales"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Otros Datos</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.otrosDatos}
                                    onChange={(e) => setFormData({ ...formData, otrosDatos: e.target.value })}
                                    placeholder="Información adicional relevante"
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleSubmitCompra}>
                            Iniciar Compra
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </DashboardLayout>
    );
};

export default MisCotizaciones;