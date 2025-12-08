import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMisCotizaciones } from '../../api/pricings.api';
import { iniciarProcesoCompra, getCompraPorCotizacion } from '../../api/compras.api';
import StatusBadge from '../../components/shared/StatusBadge';
import DashboardLayout from '../../components/layout/DashboardLayaut';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import './MisCotizaciones.css';

const MisCotizaciones = () => {
    const [cotizaciones, setCotizaciones] = useState([]);
    const [compras, setCompras] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showApprovedModal, setShowApprovedModal] = useState(false);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);
    const [formData, setFormData] = useState({
        ingresos: '',
        gastos: '',
        otrosDatos: ''
    });
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const token = useSelector(state => state.auth.token);

    const fetchCotizaciones = async () => {
        console.log('🔍 MisCotizaciones - Iniciando carga de cotizaciones');
        console.log('🔍 MisCotizaciones - Usuario actual:', user);

        if (!user?._id) {
            console.log('🔍 MisCotizaciones - No hay usuario ID, cancelando carga');
            return;
        }

        try {
            console.log('🔍 MisCotizaciones - Llamando API getCotizacionesAprobadasCliente');
            const data = await getMisCotizaciones(navigate);
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

    useEffect(() => {
        if (token && user?._id) {
            fetchCotizaciones();
        } else if (!token) {
            setLoading(false);
            setError('Token de autenticación no disponible');
        }
    }, [token, user]);

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

    const handleVerDetallesAprobados = (cotizacion) => {
        setSelectedCotizacion(cotizacion);
        setShowApprovedModal(true);
    };

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase() || 'pendiente';
        if (s === 'aprobada') {
            return (
                <span className="product-badge d-flex align-items-center gap-1 badge bg-success">
                    <CheckCircle size={14} /> ¡Aprobada!
                </span>
            );
        } else if (s === 'rechazada') {
            return (
                <span className="product-badge d-flex align-items-center gap-1 badge bg-danger">
                    <XCircle size={14} /> Rechazada
                </span>
            );
        } else {
            return (
                <span className="product-badge d-flex align-items-center gap-1 badge bg-warning text-dark">
                    <Clock size={14} /> Pendiente
                </span>
            );
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

    if (!token) {
        return (
            <DashboardLayout>
                <Container className="mt-4">
                    <Alert variant="warning">
                        <Alert.Heading>Autenticación requerida</Alert.Heading>
                        <p>No se puede cargar las cotizaciones porque no hay un token de autenticación válido.</p>
                        <p>Por favor, inicia sesión nuevamente.</p>
                    </Alert>
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
                        <button
                            style={{
                                borderRadius: '6px',
                                backgroundColor: '#3b82f6',
                                border: '1px solid #3b82f6',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease',
                                fontSize: '0.875rem',
                                marginTop: '1rem'
                            }}
                            onClick={() => navigate('/cliente/catalogo')}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                        >
                            Ir al Catálogo
                        </button>
                    </div>
                ) : (
                    <Row>
                        {cotizaciones.map((cotizacion) => (
                            <Col xxl={3} xl={4} lg={4} md={6} sm={12} key={cotizacion._id} className="mb-4">
                                <div className="product-card h-100 d-flex flex-column">
                                    <div className="product-img-container" style={{ height: '160px' }}>
                                        <img
                                            className="product-img"
                                            src={cotizacion.coche?.imageUrl || "https://via.placeholder.com/400x300?text=Auto"}
                                            alt={`${cotizacion.coche?.marca} ${cotizacion.coche?.modelo}`}
                                        />
                                        {getStatusBadge(cotizacion.status)}
                                    </div>
                                    <div className="product-body flex-grow-1">
                                        <h5 className="fw-bold mb-1">
                                            {cotizacion.coche?.marca} {cotizacion.coche?.modelo}
                                        </h5>
                                        <small className="text-muted mb-3 d-block">
                                            Solicitado el: {new Date(cotizacion.createdAt).toLocaleDateString('es-ES')}
                                        </small>

                                        <div className="p-3 bg-light rounded mb-3">
                                            <div className="d-flex justify-content-between mb-1">
                                                <span>Enganche:</span>
                                                <span className="fw-bold">${cotizacion.enganche?.toLocaleString('es-MX')}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span>Mensualidad (Est):</span>
                                                <span className="fw-bold text-primary">
                                                    ${cotizacion.pagoMensual?.toLocaleString('es-MX') || 'Calculando...'}
                                                </span>
                                            </div>
                                        </div>

                                        {cotizacion.status?.toLowerCase() === 'aprobada' ? (
                                            compras[cotizacion._id] ? (
                                                <button
                                                    type="button"
                                                    style={{
                                                        width: '100%',
                                                        borderRadius: '6px',
                                                        marginTop: 'auto',
                                                        backgroundColor: '#3b82f6',
                                                        border: '1px solid #3b82f6',
                                                        color: 'white',
                                                        padding: '0.5rem 1rem',
                                                        fontWeight: '500',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s ease',
                                                        fontSize: '0.875rem'
                                                    }}
                                                    onClick={() => navigate(`/cliente/compras/${compras[cotizacion._id]._id}`)}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                                                >
                                                    Ver Compra Activa
                                                </button>
                                            ) : (
                                                <div className="d-flex gap-2 mt-auto">
                                                    <button
                                                        type="button"
                                                        style={{
                                                            flexGrow: 1,
                                                            borderRadius: '6px',
                                                            border: '1px solid #10b981',
                                                            backgroundColor: 'transparent',
                                                            color: '#10b981',
                                                            padding: '0.5rem 1rem',
                                                            fontWeight: '500',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            fontSize: '0.875rem'
                                                        }}
                                                        onClick={() => handleVerDetallesAprobados(cotizacion)}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.backgroundColor = '#10b981';
                                                            e.target.style.color = 'white';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.backgroundColor = 'transparent';
                                                            e.target.style.color = '#10b981';
                                                        }}
                                                    >
                                                        Ver Detalles
                                                    </button>
                                                    <button
                                                        type="button"
                                                        style={{
                                                            flexGrow: 1,
                                                            borderRadius: '6px',
                                                            backgroundColor: '#10b981',
                                                            border: '1px solid #10b981',
                                                            color: 'white',
                                                            padding: '0.5rem 1rem',
                                                            fontWeight: '500',
                                                            cursor: 'pointer',
                                                            transition: 'background-color 0.2s ease',
                                                            fontSize: '0.875rem'
                                                        }}
                                                        onClick={() => handleIniciarCompra(cotizacion)}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                                                    >
                                                        Comprar
                                                    </button>
                                                </div>
                                            )
                                        ) : (
                                            <button
                                                type="button"
                                                className="w-100 btn-rounded mt-auto btn btn-outline-secondary"
                                                disabled
                                            >
                                                En Revisión
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}

                {/* Modal de Inicio de Compra (Formulario) */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered className="modal-custom">
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
                        <button
                            style={{
                                borderRadius: '6px',
                                backgroundColor: '#6b7280',
                                border: '1px solid #6b7280',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease',
                                fontSize: '0.875rem'
                            }}
                            onClick={() => setShowModal(false)}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
                        >
                            Cancelar
                        </button>
                        <button
                            style={{
                                borderRadius: '6px',
                                backgroundColor: '#3b82f6',
                                border: '1px solid #3b82f6',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease',
                                fontSize: '0.875rem'
                            }}
                            onClick={handleSubmitCompra}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                        >
                            Iniciar Compra
                        </button>
                    </Modal.Footer>
                </Modal>

                {/* Modal de Detalles Aprobados (Estilo Nuevo) */}
                <Modal show={showApprovedModal} onHide={() => setShowApprovedModal(false)} centered size="lg" contentClassName="modal-content-custom">
                    <div className="modal-content border-0">
                        <div className="bg-success text-white modal-header">
                            <div className="d-flex align-items-center gap-2 modal-title h4 mb-0">
                                <CheckCircle size={24} /> Estado: Aprobada
                            </div>
                            <button type="button" className="btn-close btn-close-white" onClick={() => setShowApprovedModal(false)} aria-label="Close"></button>
                        </div>
                        <div className="p-4 modal-body">
                            <div>
                                <div className="alert alert-success border-0 shadow-sm">
                                    <h4 className="alert-heading fw-bold">¡Felicidades! Tu crédito fue autorizado.</h4>
                                    <p>Ya puedes pasar a la agencia para firmar contrato y recoger tu unidad.</p>
                                </div>
                                <h6 className="fw-bold mt-4 mb-3">Condiciones Finales del Banco</h6>
                                <div className="g-3 row">
                                    <div className="col-sm-6">
                                        <div className="p-3 border rounded bg-light h-100">
                                            <small className="text-muted d-block">Monto Aprobado</small>
                                            <h4 className="fw-bold text-success">
                                                ${((selectedCotizacion?.precioCoche || 0) - (selectedCotizacion?.enganche || 0)).toLocaleString('es-MX')}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="p-3 border rounded bg-light h-100">
                                            <small className="text-muted d-block">Tasa de Interés Anual</small>
                                            <h4 className="fw-bold text-dark">15.0%</h4>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="p-3 border rounded bg-light h-100">
                                            <small className="text-muted d-block">Mensualidad Real</small>
                                            <h5 className="fw-bold">
                                                ${selectedCotizacion?.pagoMensual?.toLocaleString('es-MX') || 'Calculando...'}
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="p-3 border rounded bg-light h-100">
                                            <small className="text-muted d-block">Plazo Autorizado</small>
                                            <h5 className="fw-bold">{selectedCotizacion?.plazoMeses} Meses</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary btn-rounded" onClick={() => setShowApprovedModal(false)}>Cerrar</button>
                            <button type="button" className="btn btn-success btn-rounded" onClick={() => {
                                setShowApprovedModal(false);
                                handleIniciarCompra(selectedCotizacion);
                            }}>Continuar Compra</button>
                        </div>
                    </div>
                </Modal>
            </Container>

            <style>{`
                .product-card {
                    background-color: #1f2937;
                    border: 1px solid #374151;
                    border-radius: 8px;
                    color: white;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    overflow: hidden;
                }
                .product-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }
                .product-img-container {
                    position: relative;
                    overflow: hidden;
                    border-radius: 8px 8px 0 0;
                }
                .product-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }
                .product-img:hover {
                    transform: scale(1.05);
                }
                .product-badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background-color: #10b981 !important;
                    color: white !important;
                    border: none;
                    font-weight: 500;
                }
                .product-body {
                    padding: 1rem;
                }
                .product-body h5 {
                    color: white;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }
                .product-body small {
                    color: #9ca3af;
                    font-size: 0.875rem;
                }
                .product-body .bg-light {
                    background-color: #374151 !important;
                    border: 1px solid #4b5563;
                    color: white;
                    border-radius: 6px;
                }
                .product-body .bg-light span {
                    color: white;
                }
                .product-body .text-primary {
                    color: #3b82f6 !important;
                    font-weight: 600;
                }
                .btn-primary {
                    background-color: #3b82f6;
                    border-color: #3b82f6;
                    color: white;
                    border-radius: 6px;
                    font-weight: 500;
                    transition: background-color 0.2s ease;
                }
                .btn-primary:hover {
                    background-color: #2563eb;
                    border-color: #2563eb;
                    color: white;
                }
                .btn-outline-success {
                    border-color: #10b981;
                    color: #10b981;
                    border-radius: 6px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                .btn-outline-success:hover {
                    background-color: #10b981;
                    border-color: #10b981;
                    color: white;
                }
                .btn-success {
                    background-color: #10b981;
                    border-color: #10b981;
                    border-radius: 6px;
                    font-weight: 500;
                    transition: background-color 0.2s ease;
                }
                .btn-success:hover {
                    background-color: #059669;
                    border-color: #059669;
                }
                .btn-outline-secondary {
                    border-color: #6b7280;
                    color: #6b7280;
                    border-radius: 6px;
                    font-weight: 500;
                }
                .btn-outline-secondary:disabled {
                    background-color: #374151;
                    border-color: #4b5563;
                    color: #6b7280;
                    opacity: 0.6;
                }
                .btn-rounded {
                    border-radius: 6px !important;
                }
            `}</style>
        </DashboardLayout>
    );
};

export default MisCotizaciones;