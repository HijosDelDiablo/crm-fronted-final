import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCotizacionesAprobadasCliente } from '../../api/pricings.api';
import { iniciarProcesoCompra, getCompraPorCotizacion } from '../../api/compras.api';
import StatusBadge from '../../components/shared/StatusBadge';
import DashboardLayout from '../../components/layout/DashboardLayaut';
import './MisCotizaciones.css';

const MisCotizaciones = () => {
    const [cotizaciones, setCotizaciones] = useState([]);
    const [compras, setCompras] = useState({});
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
            console.log('🔍 MisCotizaciones - Iniciando carga de cotizaciones');
            console.log('🔍 MisCotizaciones - Usuario actual:', user);

            if (!user?._id) {
                console.log('🔍 MisCotizaciones - No hay usuario ID, cancelando carga');
                return;
            }

            try {
                console.log('🔍 MisCotizaciones - Llamando API getCotizacionesAprobadasCliente');
                const data = await getCotizacionesAprobadasCliente(user._id, navigate);
                console.log('🔍 MisCotizaciones - Datos recibidos:', data);

                // Asegurar que sea un array
                const cotizacionesArray = Array.isArray(data) ? data : [data];
                console.log('🔍 MisCotizaciones - Número de cotizaciones:', cotizacionesArray.length);

                setCotizaciones(cotizacionesArray);

                // Fetch purchases for approved quotes
                const comprasMap = {};
                for (const cotizacion of cotizacionesArray) {
                    if (cotizacion.status?.toLowerCase() === 'aprobada') {
                        try {
                            console.log('🔍 MisCotizaciones - Buscando compra para cotización:', cotizacion._id);
                            const compra = await getCompraPorCotizacion(cotizacion._id, navigate);
                            if (compra) {
                                comprasMap[cotizacion._id] = compra;
                                console.log('🔍 MisCotizaciones - Compra encontrada:', compra);
                            }
                        } catch (err) {
                            console.log('🔍 MisCotizaciones - No hay compra para cotización:', cotizacion._id);
                        }
                    }
                }
                setCompras(comprasMap);
            } catch (err) {
                console.error('❌ MisCotizaciones - Error al cargar cotizaciones:', err);
                setError('Error al cargar las cotizaciones');
            } finally {
                setLoading(false);
                console.log('🔍 MisCotizaciones - Carga completada');
            }
        };

        fetchCotizaciones();
    }, [user, navigate]);

    const handleIniciarCompra = (cotizacion) => {
        console.log('🔍 MisCotizaciones - Iniciando compra para cotización:', cotizacion);
        setSelectedCotizacion(cotizacion);
        setShowModal(true);
    };

    const handleSubmitCompra = async () => {
        if (!selectedCotizacion) {
            console.log('❌ MisCotizaciones - No hay cotización seleccionada');
            return;
        }

        console.log('🔍 MisCotizaciones - Enviando formulario de compra');
        console.log('🔍 MisCotizaciones - Cotización seleccionada:', selectedCotizacion);
        console.log('🔍 MisCotizaciones - Datos del formulario:', formData);

        try {
            const payload = {
                cotizacionId: selectedCotizacion._id,
                datosFinancieros: {
                    ingresos: parseFloat(formData.ingresos),
                    gastos: parseFloat(formData.gastos),
                    otrosDatos: formData.otrosDatos
                }
            };

            console.log('🔍 MisCotizaciones - Payload a enviar:', payload);

            await iniciarProcesoCompra(payload, navigate);

            console.log('✅ MisCotizaciones - Proceso de compra iniciado exitosamente');
            alert('Proceso de compra iniciado exitosamente');

            setShowModal(false);
            setFormData({ ingresos: '', gastos: '', otrosDatos: '' });
            // Opcional: recargar cotizaciones o navegar a compras
        } catch (err) {
            console.error('❌ MisCotizaciones - Error al iniciar proceso de compra:', err);
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

    if (loading) {
        return (
            <DashboardLayout>
                <Container className="cotizaciones-container">
                    <div className="loading-container">
                        <Spinner animation="border" className="loading-spinner" />
                        <p>Cargando tus cotizaciones...</p>
                    </div>
                </Container>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <Container className="cotizaciones-container">
                    <div className="error-container">
                        <div className="error-icon">⚠️</div>
                        <Alert variant="danger">{error}</Alert>
                    </div>
                </Container>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Container className="cotizaciones-container">
                <div className="cotizaciones-header">
                    <h2>Mis Cotizaciones</h2>
                    <p className="cotizaciones-subtitle">
                        Gestiona todas tus solicitudes de cotización de vehículos
                    </p>
                </div>

                {cotizaciones.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3 className="empty-state-title">No tienes cotizaciones</h3>
                        <p className="empty-state-message">
                            Visita nuestro catálogo para crear tu primera cotización
                        </p>
                    </div>
                ) : (
                    <Row>
                        {cotizaciones.map((cotizacion) => (
                            <Col md={6} lg={4} key={cotizacion._id} className="mb-4">
                                <Card className="cotizacion-card">
                                    <Card.Header className="cotizacion-card-header">
                                        <div className="cotizacion-info">
                                            <div className="cotizacion-title">
                                                {cotizacion.coche?.marca} {cotizacion.coche?.modelo}
                                            </div>
                                            <div className="cotizacion-id">
                                                ID: {cotizacion._id}
                                            </div>
                                        </div>
                                    </Card.Header>

                                    <Card.Body className="cotizacion-card-body">
                                        <div className="status-badge-container">
                                            <StatusBadge status={cotizacion.status} />
                                        </div>

                                        <div className="cotizacion-details">
                                            <div className="cotizacion-detail">
                                                <span className="cotizacion-label">Enganche:</span>
                                                <span className="cotizacion-value">
                                                    ${cotizacion.enganche?.toLocaleString('es-ES')}
                                                </span>
                                            </div>
                                            <div className="cotizacion-detail">
                                                <span className="cotizacion-label">Plazo:</span>
                                                <span className="cotizacion-value">
                                                    {cotizacion.plazoMeses} meses
                                                </span>
                                            </div>
                                            <div className="cotizacion-detail">
                                                <span className="cotizacion-label">Fecha:</span>
                                                <span className="cotizacion-value">
                                                    {new Date(cotizacion.createdAt).toLocaleDateString('es-ES')}
                                                </span>
                                            </div>
                                        </div>

                                        {cotizacion.status?.toLowerCase() === 'aprobada' && (
                                            compras[cotizacion._id] ? (
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => navigate(`/cliente/compras/${compras[cotizacion._id]._id}`)}
                                                    className="btn-ver-compra"
                                                >
                                                    Ver Compra
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleIniciarCompra(cotizacion)}
                                                    className="btn-iniciar-compra"
                                                >
                                                    Iniciar Proceso de Compra
                                                </Button>
                                            )
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Iniciar Proceso de Compra</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedCotizacion && (
                            <div className="mb-3 p-3 bg-light rounded">
                                <h6 className="mb-2">Cotización Seleccionada:</h6>
                                <p className="mb-1">
                                    <strong>Vehículo:</strong> {selectedCotizacion.coche?.marca} {selectedCotizacion.coche?.modelo}
                                </p>
                                <p className="mb-1">
                                    <strong>Enganche:</strong> ${selectedCotizacion.enganche?.toLocaleString('es-ES')}
                                </p>
                                <p className="mb-0">
                                    <strong>Plazo:</strong> {selectedCotizacion.plazoMeses} meses
                                </p>
                            </div>
                        )}

                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Ingresos Mensuales</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.ingresos}
                                    onChange={(e) => setFormData({ ...formData, ingresos: e.target.value })}
                                    placeholder="Ingrese sus ingresos mensuales"
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Gastos Mensuales</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.gastos}
                                    onChange={(e) => setFormData({ ...formData, gastos: e.target.value })}
                                    placeholder="Ingrese sus gastos mensuales"
                                    required
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
                        <Button
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                            className="btn-modal-cancel"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmitCompra}
                            className="btn-modal-confirm"
                        >
                            Iniciar Compra
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </DashboardLayout>
    );
};

export default MisCotizaciones;