import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button, Modal, Spinner, ProgressBar } from "react-bootstrap";
import { Calendar, DollarSign, CheckCircle, XCircle, Clock, AlertCircle, FileText } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { getProductById } from "../../api/products.api";
import "./ClientStyles.css";
import Sidebar from "../../components/layout/Sidebar";
import AIChatWidget from "../../components/chat/AIChatWidget";
import DashboardLayout from "../../components/layout/DashboardLayaut";

export default function MisCompras() {
    const [compras, setCompras] = useState([]);
    const [cars, setCars] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedCompra, setSelectedCompra] = useState(null);

    useEffect(() => {
        fetchCompras();
    }, []);

    const fetchCompras = async () => {
        try {
            const { data } = await api.get("/compra/mis-compras");
            console.log("Datos de compras recibidos:", data);
            setCompras(data);

            // Fetch car details for each compra
            const carPromises = data.map(async (compra) => {
                if (compra.cotizacion?.coche && typeof compra.cotizacion.coche === 'string') {
                    try {
                        const carData = await getProductById(compra.cotizacion.coche);
                        return { id: compra.cotizacion.coche, data: carData };
                    } catch (error) {
                        console.error("Error fetching car:", error);
                        return { id: compra.cotizacion.coche, data: null };
                    }
                }
                return null;
            });

            const carResults = await Promise.all(carPromises);
            const carsMap = {};
            carResults.forEach(result => {
                if (result) {
                    carsMap[result.id] = result.data;
                }
            });
            setCars(carsMap);
        } catch (error) {
            console.error(error);
            toast.error("No pudimos cargar tu historial de compras");
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case "Aprobada":
                return { color: "success", icon: <CheckCircle size={16} />, text: "¡Aprobada!" };
            case "Completada":
                return { color: "success", icon: <CheckCircle size={16} />, text: "¡Completada!" };
            case "Rechazada":
            case "Cancelada":
                return { color: "danger", icon: <XCircle size={16} />, text: "Rechazada" };
            case "En revisión":
                return { color: "warning", icon: <Clock size={16} />, text: "Analizando Buró" };
            default:
                return { color: "secondary", icon: <AlertCircle size={16} />, text: "Pendiente" };
        }
    };

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase() || 'pendiente';

        if (s === 'aprobada') {
            return (
                <span className="d-inline-flex align-items-center gap-1 badge bg-success rounded-pill px-3 py-2">
                    <CheckCircle size={14} /> ¡Aprobada!
                </span>
            );
        } else if (s === 'completada') {
            return (
                <span className="d-inline-flex align-items-center gap-1 badge bg-success rounded-pill px-3 py-2">
                    <CheckCircle size={14} /> ¡Completada!
                </span>
            );
        } else if (s === 'rechazada' || s === 'cancelada') {
            return (
                <span className="d-inline-flex align-items-center gap-1 badge bg-danger rounded-pill px-3 py-2">
                    <XCircle size={14} /> Rechazada
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

    const handleClose = () => setSelectedCompra(null);

    if (loading) {
        return (
            <DashboardLayout>
                <Container className="d-flex justify-content-center mt-5">
                    <Spinner animation="border" />
                </Container>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Container className="compras-container">
                <div className="compras-header">
                    <h2>Mis Solicitudes de Compra</h2>
                    <p className="compras-subtitle">
                        Gestiona todas tus solicitudes de financiamiento de vehículos
                    </p>
                </div>

                {compras.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3 className="empty-state-title">No tienes solicitudes</h3>
                        <p className="empty-state-message">
                            Ve al catálogo para cotizar y solicitar tu próximo auto
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
                            onClick={() => window.location.href = '/client/catalogo'}
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
                                {compras.map((compra) => {
                                    const statusCfg = getStatusConfig(compra.status);
                                    const coche = cars[compra.cotizacion?.coche] || {};

                                    return (
                                        <tr key={compra._id}>
                                            <td className="ps-4">
                                                <span className="text-light" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                                    #{compra._id}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="img-thumbnail-wrapper">
                                                        <img
                                                            src={coche.imageUrl || "https://via.placeholder.com/400x300?text=Auto"}
                                                            alt={`${coche.marca} ${coche.modelo}`}
                                                            className="rounded-3"
                                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-0 fw-bold text-light">{coche.marca} {coche.modelo}</h6>
                                                        <small className="text-muted">{coche.ano} • {coche.transmision || 'Auto'}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2 text-light">
                                                    <Clock size={16} className="text-muted" />
                                                    {new Date(compra.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="fw-medium text-light">${compra.cotizacion?.enganche?.toLocaleString('es-MX')}</span>
                                            </td>
                                            <td>
                                                <span className="fw-bold text-primary">${compra.cotizacion?.pagoMensual?.toLocaleString('es-MX') || 'Calculando...'}</span>
                                            </td>
                                            <td>
                                                {getStatusBadge(compra.status)}
                                            </td>
                                            <td className="pe-4 text-end">
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
                                                    onClick={() => setSelectedCompra(compra)}
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
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal de Detalles */}
                <Modal show={!!selectedCompra} onHide={handleClose} centered size="lg" contentClassName="modal-content-custom">
                    <div className="modal-content border-0" style={{ backgroundColor: '#1f2937', color: '#e5e7eb' }}>
                        <div className="modal-header text-light" style={{ backgroundColor: selectedCompra ? (getStatusConfig(selectedCompra.status).color === 'success' ? '#10b981' : getStatusConfig(selectedCompra.status).color === 'danger' ? '#ef4444' : '#f59e0b') : '#111827' }}>
                            <div className="d-flex align-items-center gap-2 modal-title h4 mb-0">
                                {selectedCompra && getStatusConfig(selectedCompra.status).icon}
                                Estado: {selectedCompra?.status || 'Pendiente'}
                            </div>
                            <button type="button" className="btn-close" style={{ filter: 'invert(0.9)' }} onClick={handleClose} aria-label="Close"></button>
                        </div>
                        <div className="p-4 modal-body" style={{ backgroundColor: '#1f2937', color: '#e5e7eb', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            {selectedCompra && (
                                <div>
                                    {(selectedCompra.status === 'Pendiente' || selectedCompra.status === 'En revisión') && (
                                        <div className="text-center py-4">
                                            <Spinner animation="grow" style={{ color: '#f59e0b' }} className="mb-3" />
                                            <h4 className="text-light mb-3" style={{ fontWeight: '600', color: '#e5e7eb' }}>Analizando tu perfil financiero</h4>
                                            <p className="text-muted px-md-5" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                                                Estamos consultando tu Buró de Crédito y calculando tu capacidad de pago.
                                                Este proceso suele tardar entre 24 y 48 horas. Te notificaremos por correo.
                                            </p>
                                            <ProgressBar animated now={60} label="60%" style={{ backgroundColor: '#374151' }} className="mt-3" />
                                        </div>
                                    )}

                                    {(selectedCompra.status === 'Aprobada') && (
                                        <div>
                                            <div className="alert alert-success border-0 shadow-sm" style={{ backgroundColor: '#064e3b', color: '#d1fae5', borderRadius: '8px', padding: '1rem' }}>
                                                <h4 className="alert-heading fw-bold" style={{ color: '#d1fae5', marginBottom: '0.5rem' }}>¡Felicidades! Tu crédito fue autorizado.</h4>
                                                <p style={{ color: '#a7f3d0', marginBottom: '0', fontSize: '0.9rem' }}>Ya puedes pasar a la agencia para firmar contrato y recoger tu unidad.</p>
                                            </div>

                                            <h6 className="fw-bold mt-4 mb-3 text-light" style={{ color: '#e5e7eb', fontSize: '1.1rem', fontWeight: '600' }}>Condiciones Finales del Banco</h6>
                                            <div className="g-3 row">
                                                <div className="col-sm-6">
                                                    <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}>
                                                        <small className="text-light d-block" style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monto Aprobado</small>
                                                        <h4 className="fw-bold text-success" style={{ color: '#10b981', fontSize: '1.2rem', marginTop: '0.25rem' }}>${selectedCompra.resultadoBanco?.montoAprobado?.toLocaleString('es-MX') || selectedCompra.cotizacion.montoFinanciado.toLocaleString()}</h4>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}>
                                                        <small className="text-light d-block" style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tasa de Interés Anual</small>
                                                        <h4 className="fw-bold text-light" style={{ color: '#e5e7eb', fontSize: '1.2rem', marginTop: '0.25rem' }}>{((selectedCompra.resultadoBanco?.tasaInteres || 0.15) * 100).toFixed(1)}%</h4>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}>
                                                        <small className="text-light d-block" style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Saldo Pendiente</small>
                                                        <h5 className="fw-bold text-light" style={{ color: '#e5e7eb', fontSize: '1.1rem', marginTop: '0.25rem' }}>${selectedCompra.saldoPendiente?.toLocaleString('es-MX') || "Calculando..."}</h5>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}>
                                                        <small className="text-light d-block" style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Plazo Autorizado</small>
                                                        <h5 className="fw-bold text-light" style={{ color: '#e5e7eb', fontSize: '1.1rem', marginTop: '0.25rem' }}>{selectedCompra.resultadoBanco?.plazoAprobado || selectedCompra.cotizacion.plazoMeses} Meses</h5>
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedCompra.resultadoBanco?.condiciones && (
                                                <div className="mt-3">
                                                    <strong className="text-light" style={{ color: '#e5e7eb', fontWeight: '600' }}>Condiciones:</strong>
                                                    <ul className="text-light mt-2" style={{ color: '#d1d5db', paddingLeft: '1.5rem' }}>
                                                        {selectedCompra.resultadoBanco.condiciones.map((c, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{c}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {(selectedCompra.status === 'Completada') && (
                                        <div>
                                            <div className="alert alert-success border-0 shadow-sm" style={{ backgroundColor: '#064e3b', color: '#d1fae5', borderRadius: '8px', padding: '1rem' }}>
                                                <h4 className="alert-heading fw-bold" style={{ color: '#d1fae5', marginBottom: '0.5rem' }}>¡Compra Completada!</h4>
                                                <p style={{ color: '#a7f3d0', marginBottom: '0', fontSize: '0.9rem' }}>Has pagado completamente tu vehículo. ¡Felicidades por tu nueva adquisición!</p>
                                            </div>

                                            {/* Car Details */}
                                            {(() => {
                                                const coche = cars[selectedCompra.cotizacion?.coche] || {};
                                                return (
                                                    <div className="mb-4">
                                                        <h6 className="fw-bold text-light mb-3" style={{ color: '#e5e7eb', fontSize: '1.1rem', fontWeight: '600' }}>Detalles del Vehículo</h6>
                                                        <div className="row g-3">
                                                            <div className="col-md-6">
                                                                <div className="p-3 border rounded" style={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}>
                                                                    <div className="d-flex align-items-center gap-3">
                                                                        <img
                                                                            src={coche.imageUrl || "https://via.placeholder.com/400x300?text=Auto"}
                                                                            alt={`${coche.marca} ${coche.modelo}`}
                                                                            className="rounded"
                                                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                                        />
                                                                        <div>
                                                                            <h6 className="mb-1 text-light" style={{ color: '#e5e7eb', fontSize: '1rem', fontWeight: '600' }}>{coche.marca} {coche.modelo}</h6>
                                                                            <small className="text-muted" style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{coche.ano} • {coche.transmision} • {coche.kilometraje?.toLocaleString()} km</small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}>
                                                                    <small className="text-light d-block" style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>VIN</small>
                                                                    <span className="text-light fw-medium" style={{ color: '#e5e7eb', fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all' }}>{coche.vin}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}

                                            <h6 className="fw-bold mt-4 mb-3 text-light" style={{ color: '#e5e7eb', fontSize: '1.1rem', fontWeight: '600' }}>Resumen Financiero</h6>
                                            <div className="g-3 row">
                                                <div className="col-sm-6">
                                                    <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}>
                                                        <small className="text-light d-block" style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Precio del Vehículo</small>
                                                        <h4 className="fw-bold text-success" style={{ color: '#10b981', fontSize: '1.2rem', marginTop: '0.25rem' }}>${selectedCompra.cotizacion?.precioCoche?.toLocaleString('es-MX')}</h4>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}>
                                                        <small className="text-light d-block" style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Enganche Pagado</small>
                                                        <h4 className="fw-bold text-light" style={{ color: '#e5e7eb', fontSize: '1.2rem', marginTop: '0.25rem' }}>${selectedCompra.cotizacion?.enganche?.toLocaleString('es-MX')}</h4>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}>
                                                        <small className="text-light d-block" style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monto Financiado</small>
                                                        <h5 className="fw-bold text-light" style={{ color: '#e5e7eb', fontSize: '1.1rem', marginTop: '0.25rem' }}>${selectedCompra.cotizacion?.montoFinanciado?.toLocaleString('es-MX')}</h5>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}>
                                                        <small className="text-light d-block" style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Pagado</small>
                                                        <h5 className="fw-bold text-success" style={{ color: '#10b981', fontSize: '1.1rem', marginTop: '0.25rem' }}>${selectedCompra.totalPagado?.toLocaleString('es-MX')}</h5>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}>
                                                        <small className="text-light d-block" style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Saldo Pendiente</small>
                                                        <h5 className="fw-bold text-light" style={{ color: '#e5e7eb', fontSize: '1.1rem', marginTop: '0.25rem' }}>${selectedCompra.saldoPendiente?.toLocaleString('es-MX') || "0"}</h5>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="p-3 border rounded h-100" style={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}>
                                                        <small className="text-light d-block" style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha de Compra</small>
                                                        <h5 className="fw-bold text-light" style={{ color: '#e5e7eb', fontSize: '1.1rem', marginTop: '0.25rem' }}>{new Date(selectedCompra.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</h5>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 p-3 border rounded" style={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}>
                                                <h6 className="fw-bold text-light mb-2" style={{ color: '#e5e7eb', fontSize: '1rem', fontWeight: '600' }}>Información del Vendedor</h6>
                                                <p className="text-light mb-1" style={{ color: '#d1d5db', marginBottom: '0.25rem' }}><strong style={{ color: '#e5e7eb' }}>Nombre:</strong> {selectedCompra.vendedor?.nombre}</p>
                                                <p className="text-light mb-0" style={{ color: '#d1d5db' }}><strong style={{ color: '#e5e7eb' }}>Email:</strong> {selectedCompra.vendedor?.email}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedCompra.status === 'Rechazada' && (
                                        <div className="text-center">
                                            <div className="mb-3 text-danger">
                                                <AlertCircle size={48} />
                                            </div>
                                            <h4 className="text-light" style={{ color: '#e5e7eb', fontWeight: '600', marginBottom: '1rem' }}>Solicitud No Aprobada</h4>
                                            <p className="text-muted" style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                                Lamentablemente, en este momento no podemos ofrecerte el financiamiento solicitado.
                                            </p>

                                            <div className="p-3 rounded text-start mt-4" style={{ backgroundColor: '#374151', borderRadius: '8px' }}>
                                                <strong className="text-danger d-block mb-2" style={{ color: '#ef4444', fontWeight: '600' }}>Motivo del rechazo:</strong>
                                                <p className="mb-0 text-light" style={{ color: '#d1d5db' }}>{selectedCompra.resultadoBanco?.motivoRechazo || "No cumple con las políticas de riesgo actuales."}</p>
                                            </div>

                                            {selectedCompra.resultadoBanco?.sugerencias && (
                                                <div className="mt-3 text-start">
                                                    <strong className="text-light" style={{ color: '#e5e7eb', fontWeight: '600' }}>Sugerencias para mejorar tu perfil:</strong>
                                                    <ul className="text-muted small mt-1" style={{ color: '#9ca3af', paddingLeft: '1.5rem' }}>
                                                        {selectedCompra.resultadoBanco.sugerencias.map((s, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{s}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
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
                                onClick={handleClose}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
                            >
                                Cerrar
                            </button>
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

        /* Container Styles */
        .compras-container {
          padding: 2rem 0;
        }
        .compras-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .compras-header h2 {
          color: #e5e7eb;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .compras-subtitle {
          color: #9ca3af;
          font-size: 1rem;
        }
      `}</style>
        </DashboardLayout>
    );
}