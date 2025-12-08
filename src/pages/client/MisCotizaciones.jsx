import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Form, Modal } from 'react-bootstrap';
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
        if (cotizacion.status?.toLowerCase() === 'aprobada') {
            setShowApprovedModal(true);
        } else {
            // Para otros estados, podríamos mostrar un modal diferente o el mismo con diferente contenido
            // Por ahora usaremos el mismo modal pero adaptaremos el contenido
            setShowApprovedModal(true);
        }
    };

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase() || 'pendiente';

        if (s === 'aprobada' || s === 'completada') {
            return (
                <span className="d-inline-flex align-items-center gap-1 badge bg-success rounded-pill px-3 py-2">
                    <CheckCircle size={14} /> {status}
                </span>
            );
        } else if (s === 'rechazada' || s === 'cancelada') {
            return (
                <span className="d-inline-flex align-items-center gap-1 badge bg-danger rounded-pill px-3 py-2">
                    <XCircle size={14} /> {status}
                </span>
            );
        } else if (s === 'en revision' || s === 'en revisión') {
            return (
                <span className="d-inline-flex align-items-center gap-1 badge bg-info text-dark rounded-pill px-3 py-2">
                    <Clock size={14} /> En Revisión
                </span>
            );
        } else {
            return (
                <span className="d-inline-flex align-items-center gap-1 badge bg-warning text-dark rounded-pill px-3 py-2">
                    <Clock size={14} /> {status || 'Pendiente'}
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
                                color: '#e5e7eb',
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
                    <div className="table-responsive rounded-3 overflow-hidden shadow-lg">
                        <table className="table table-dark table-hover align-middle mb-0 custom-table">
                            <thead>
                                <tr>
                                    <th className="py-3 ps-4">ID</th>
                                    <th className="py-3">Vehículo</th>
                                    <th className="py-3">Fecha Solicitud</th>
                                    <th className="py-3">Enganche</th>
                                    <th className="py-3">Mensualidad</th>
                                    <th className="py-3">Estado</th>
                                    <th className="py-3 pe-4 text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cotizaciones.map((cotizacion) => (
                                    <tr key={cotizacion._id}>
                                        <td className="ps-4">
                                            <span className="text-light" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                                #{cotizacion._id}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="img-thumbnail-wrapper">
                                                    <img
                                                        src={cotizacion.coche?.imageUrl || "https://via.placeholder.com/400x300?text=Auto"}
                                                        alt={`${cotizacion.coche?.marca} ${cotizacion.coche?.modelo}`}
                                                        className="rounded-3"
                                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 fw-bold text-light">{cotizacion.coche?.marca} {cotizacion.coche?.modelo}</h6>
                                                    <small className="text-muted">{cotizacion.coche?.ano} • {cotizacion.coche?.transmision || 'Auto'}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2 text-light">
                                                <Clock size={16} className="text-muted" />
                                                {new Date(cotizacion.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="fw-medium text-light">${cotizacion.enganche?.toLocaleString('es-MX')}</span>
                                        </td>
                                        <td>
                                            <span className="fw-bold text-primary">${cotizacion.pagoMensual?.toLocaleString('es-MX') || 'Calculando...'}</span>
                                        </td>
                                        <td>
                                            {getStatusBadge(cotizacion.status)}
                                        </td>
                                        <td className="pe-4 text-end">
                                            {cotizacion.status?.toLowerCase() === 'aprobada' ? (
                                                compras[cotizacion._id] ? (
                                                    <button
                                                        type="button"
                                                        style={{
                                                            borderRadius: '6px',
                                                            backgroundColor: '#3b82f6',
                                                            border: '1px solid #3b82f6',
                                                            color: '#e5e7eb',
                                                            padding: '0.4rem 0.8rem',
                                                            fontWeight: '500',
                                                            cursor: 'pointer',
                                                            transition: 'background-color 0.2s ease',
                                                            fontSize: '0.875rem'
                                                        }}
                                                        onClick={() => navigate(`/cliente/compras/${compras[cotizacion._id]._id}`)}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                                                    >
                                                        Ver Compra
                                                    </button>
                                                ) : (
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        <button
                                                            type="button"
                                                            style={{
                                                                borderRadius: '6px',
                                                                border: '1px solid #10b981',
                                                                backgroundColor: 'transparent',
                                                                color: '#10b981',
                                                                padding: '0.4rem 0.8rem',
                                                                fontWeight: '500',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s ease',
                                                                fontSize: '0.875rem'
                                                            }}
                                                            onClick={() => handleVerDetallesAprobados(cotizacion)}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.backgroundColor = '#10b981';
                                                                e.target.style.color = '#e5e7eb';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.backgroundColor = 'transparent';
                                                                e.target.style.color = '#10b981';
                                                            }}
                                                        >
                                                            Detalles
                                                        </button>
                                                        <button
                                                            type="button"
                                                            style={{
                                                                borderRadius: '6px',
                                                                backgroundColor: '#10b981',
                                                                border: '1px solid #10b981',
                                                                color: '#e5e7eb',
                                                                padding: '0.4rem 0.8rem',
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
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button
                                                        type="button"
                                                        style={{
                                                            borderRadius: '6px',
                                                            border: '1px solid #6b7280',
                                                            backgroundColor: 'transparent',
                                                            color: '#9ca3af',
                                                            padding: '0.4rem 0.8rem',
                                                            fontWeight: '500',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            fontSize: '0.875rem'
                                                        }}
                                                        onClick={() => handleVerDetallesAprobados(cotizacion)}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.backgroundColor = '#374151';
                                                            e.target.style.color = '#e5e7eb';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.backgroundColor = 'transparent';
                                                            e.target.style.color = '#9ca3af';
                                                        }}
                                                    >
                                                        Ver Detalles
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                                color: '#e5e7eb',
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
                                color: '#e5e7eb',
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
                    <div className="modal-content border-0" style={{ backgroundColor: '#1f2937', color: '#e5e7eb' }}>
                        <div className="modal-header text-light" style={{ backgroundColor: selectedCotizacion?.status?.toLowerCase() === 'aprobada' ? '#10b981' : '#111827' }}>
                            <div className="d-flex align-items-center gap-2 modal-title h4 mb-0">
                                {selectedCotizacion?.status?.toLowerCase() === 'aprobada' ? <CheckCircle size={24} /> : <Clock size={24} />}
                                Estado: {selectedCotizacion?.status || 'Pendiente'}
                            </div>
                            <button type="button" className="btn-close" style={{ filter: 'invert(0.9)' }} onClick={() => setShowApprovedModal(false)} aria-label="Close"></button>
                        </div>
                        <div className="p-4 modal-body" style={{ backgroundColor: '#1f2937', color: '#e5e7eb' }}>
                            <div>
                                {selectedCotizacion?.status?.toLowerCase() === 'aprobada' ? (
                                    <div className="alert alert-success border-0 shadow-sm" style={{ backgroundColor: '#064e3b', color: '#d1fae5' }}>
                                        <h4 className="alert-heading fw-bold">¡Felicidades! Tu crédito fue autorizado.</h4>
                                        <p>Ya puedes pasar a la agencia para firmar contrato y recoger tu unidad.</p>
                                    </div>
                                ) : (
                                    <div className="alert alert-secondary border-0 shadow-sm" style={{ backgroundColor: '#374151', color: '#e5e7eb' }}>
                                        <h4 className="alert-heading fw-bold">Solicitud en Proceso</h4>
                                        <p>Tu solicitud está siendo evaluada por nuestros asesores. Te notificaremos pronto.</p>
                                    </div>
                                )}

                                <h6 className="fw-bold mt-4 mb-3 text-light">Detalles de la Cotización</h6>
                                <div className="g-3 row">
                                    <div className="col-sm-6">
                                        <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151' }}>
                                            <small className="text-light d-block">Vehículo</small>
                                            <h5 className="fw-bold text-light">
                                                {selectedCotizacion?.coche?.marca} {selectedCotizacion?.coche?.modelo}
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151' }}>
                                            <small className="text-light d-block">Precio Base</small>
                                            <h5 className="fw-bold text-light">
                                                ${selectedCotizacion?.coche?.precioBase?.toLocaleString('es-MX')}
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151' }}>
                                            <small className="text-light d-block">Monto a Financiar</small>
                                            <h4 className="fw-bold text-success">
                                                ${((selectedCotizacion?.precioCoche || 0) - (selectedCotizacion?.enganche || 0)).toLocaleString('es-MX')}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151' }}>
                                            <small className="text-light d-block">Tasa de Interés Anual</small>
                                            <h4 className="fw-bold text-light">15.0%</h4>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151' }}>
                                            <small className="text-light d-block">Mensualidad Estimada</small>
                                            <h5 className="fw-bold text-light">
                                                ${selectedCotizacion?.pagoMensual?.toLocaleString('es-MX') || 'Calculando...'}
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151' }}>
                                            <small className="text-light d-block">Plazo Solicitado</small>
                                            <h5 className="fw-bold text-light">{selectedCotizacion?.plazoMeses} Meses</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ backgroundColor: '#1f2937', color: '#e5e7eb' }}>
                            <button
                                type="button"
                                style={{
                                    borderRadius: '6px',
                                    backgroundColor: '#6b7280',
                                    border: '1px solid #6b7280',
                                    color: '#e5e7eb',
                                    padding: '0.5rem 1rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease',
                                    fontSize: '0.875rem'
                                }}
                                onClick={() => setShowApprovedModal(false)}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
                            >
                                Cerrar
                            </button>
                            {selectedCotizacion?.status?.toLowerCase() === 'aprobada' && (
                                <button
                                    type="button"
                                    style={{
                                        borderRadius: '6px',
                                        backgroundColor: '#10b981',
                                        border: '1px solid #10b981',
                                        color: '#e5e7eb',
                                        padding: '0.5rem 1rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s ease',
                                        fontSize: '0.875rem'
                                    }}
                                    onClick={() => {
                                        setShowApprovedModal(false);
                                        handleIniciarCompra(selectedCotizacion);
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                                >
                                    Continuar Compra
                                </button>
                            )}
                        </div>
                    </div>
                </Modal>
            </Container>

            <style>{`
                /* Table Styles */
                .custom-table {
                    background-color: #1f2937;
                    color: #e5e7eb;
                    border-collapse: separate;
                    border-spacing: 0;
                }
                .custom-table thead th {
                    background-color: #111827;
                    color: #9ca3af;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 0.05em;
                    border-bottom: 1px solid #374151;
                }
                .custom-table tbody tr {
                    transition: background-color 0.2s ease;
                }
                .custom-table tbody tr:hover {
                    background-color: #374151;
                }
                .custom-table td {
                    border-bottom: 1px solid #374151;
                    vertical-align: middle;
                    color: #d1d5db;
                }
                .custom-table tbody tr:last-child td {
                    border-bottom: none;
                }
                .img-thumbnail-wrapper {
                    width: 60px;
                    height: 60px;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid #374151;
                }
                
                /* Empty State Dark Mode Override */
                .empty-state {
                    background: linear-gradient(135deg, #1f2937 0%, #111827 100%) !important;
                    color: #9ca3af !important;
                    border: 1px solid #374151;
                }
                .empty-state-title {
                    color: #f3f4f6 !important;
                }

                /* Card Styles (Legacy/Mobile if needed) */
                .product-card {
                    background-color: #1f2937;
                    border: 1px solid #374151;
                    border-radius: 8px;
                    color: #e5e7eb;
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
                    color: #e5e7eb !important;
                    border: none;
                    font-weight: 500;
                }
                .product-body {
                    padding: 1rem;
                }
                .product-body h5 {
                    color: #e5e7eb;
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
                    color: #e5e7eb;
                    border-radius: 6px;
                }
                .product-body .bg-light span {
                    color: #e5e7eb;
                }
                .product-body .text-primary {
                    color: #3b82f6 !important;
                    font-weight: 600;
                }
                .btn-primary {
                    background-color: #3b82f6;
                    border-color: #3b82f6;
                    color: #e5e7eb;
                    border-radius: 6px;
                    font-weight: 500;
                    transition: background-color 0.2s ease;
                }
                .btn-primary:hover {
                    background-color: #2563eb;
                    border-color: #2563eb;
                    color: #e5e7eb;
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
                    color: #e5e7eb;
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