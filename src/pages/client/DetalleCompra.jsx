import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Table, Button, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompraById } from '../../api/compras.api';
import { getMisPagos, registrarPago } from '../../api/pagos.api';
import { createSellerReview } from '../../api/reviews.api';
import StatusBadge from '../../components/shared/StatusBadge';
import PaymentTable from '../../components/shared/PaymentTable';
import PaymentSchedule from '../../components/shared/PaymentSchedule';
import { calculateAmortizationSchedule } from '../../utils/amortization.util';
import DashboardLayout from '../../components/layout/DashboardLayaut';
import { Star } from 'lucide-react';
import { notifyError, notifySuccess } from '../../components/shared/Alerts';

const DetalleCompra = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [compra, setCompra] = useState(null);
    const [pagos, setPagos] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Payment Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        monto: '',
        metodoPago: 'Tarjeta', // Default for client
        notas: ''
    });
    const [paymentFile, setPaymentFile] = useState(null);
    const [submittingPayment, setSubmittingPayment] = useState(false);

    // Review Modal State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewForm, setReviewForm] = useState({ puntuacion: 5, mensaje: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('🔍 DetalleCompra - Iniciando fetch para compra ID:', id);

                const compraData = await getCompraById(id, navigate);
                console.log('🔍 DetalleCompra - Datos de compra recibidos:', compraData);
                setCompra(compraData);

                // Calcular calendario de pagos si hay datos de cotización
                if (compraData?.cotizacion) {
                    const precio = compraData.cotizacion.coche?.precioBase || 0;
                    const enganche = compraData.cotizacion.enganche || 0;
                    const principal = compraData.cotizacion.montoFinanciar || (precio - enganche);
                    // Asumiendo que tasaInteres viene como decimal (ej: 0.15 para 15%)
                    const rate = (compraData.cotizacion.tasaInteres || 0) * 100;
                    const months = compraData.cotizacion.plazoMeses || 0;

                    if (principal > 0 && months > 0) {
                        const calculatedSchedule = calculateAmortizationSchedule(principal, rate, months);
                        setSchedule(calculatedSchedule);
                    }
                }

                // Obtener todos los pagos del usuario y filtrar por compra
                console.log('🔍 DetalleCompra - Obteniendo todos los pagos del usuario...');
                const allPagosData = await getMisPagos(navigate);
                console.log('🔍 DetalleCompra - Todos los pagos del usuario:', allPagosData);
                console.log('🔍 DetalleCompra - Número total de pagos:', Array.isArray(allPagosData) ? allPagosData.length : 'No es array');

                const pagosFiltrados = Array.isArray(allPagosData)
                    ? allPagosData.filter(pago => {
                        const match = pago.compra && pago.compra._id === id;
                        console.log('🔍 DetalleCompra - Filtrando pago:', pago._id, 'compra._id:', pago.compra?._id, 'match:', match);
                        return match;
                    })
                    : [];

                console.log('🔍 DetalleCompra - Pagos filtrados para esta compra:', pagosFiltrados);
                console.log('🔍 DetalleCompra - Número de pagos filtrados:', pagosFiltrados.length);

                const totalPagadoCalculado = pagosFiltrados.reduce((total, pago) => {
                    const monto = pago.monto || 0;
                    console.log('🔍 DetalleCompra - Sumando pago:', pago._id, 'monto:', monto);
                    return total + monto;
                }, 0);
                console.log('🔍 DetalleCompra - Total pagado calculado:', totalPagadoCalculado);

                setPagos(pagosFiltrados);
            } catch (err) {
                console.error('❌ DetalleCompra - Error al cargar los detalles de la compra:', err);
                setError('Error al cargar los detalles de la compra');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setSubmittingPayment(true);
        try {
            console.log("paymentFile", paymentFile);
            await registrarPago({
                compraId: id,
                monto: parseFloat(paymentForm.monto),
                metodoPago: 'Tarjeta', // Force Card for client as per requirement
                notas: paymentForm.notas
            }, paymentFile, navigate);

            notifySuccess('Pago registrado correctamente');
            return;
            setShowPaymentModal(false);
            setPaymentForm({ monto: '', metodoPago: 'Tarjeta', notas: '' });
            setPaymentFile(null);
            // Reload data
            window.location.reload();
        } catch (err) {
            console.error('❌ DetalleCompra - Error al registrar el pago:', err);
            notifyError('Error al registrar el pago');
        } finally {
            setSubmittingPayment(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            // Intentar obtener el ID del vendedor de la compra
            const vendedorId = compra.vendedor?._id || compra.vendedor || compra.cotizacion?.vendedor;

            if (!vendedorId) {
                alert('No se encontró información del vendedor para calificar.');
                return;
            }

            await createSellerReview({
                vendedorId: vendedorId,
                mensaje: reviewForm.mensaje,
                puntuacion: reviewForm.puntuacion
            }, navigate);

            alert('¡Gracias por tu calificación!');
            setShowReviewModal(false);
            setReviewForm({ puntuacion: 5, mensaje: '' });
        } catch (err) {
            alert('Error al enviar la reseña');
        } finally {
            setSubmittingReview(false);
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

    if (!compra) {
        return (
            <DashboardLayout>
                <Container className="mt-4">
                    <Alert variant="warning">Compra no encontrada.</Alert>
                </Container>
            </DashboardLayout>
        );
    }

    const getTimelineSteps = () => {
        const steps = [
            { label: 'Cotización Aprobada', status: 'completed' },
            { label: 'Solicitud Enviada', status: 'completed' },
            { label: 'En Revisión', status: compra?.status === 'Pendiente' || compra?.status === 'En_Revision' || compra?.status === 'Aprobada' || compra?.status === 'Completada' ? 'completed' : 'pending' },
            { label: 'Aprobada', status: compra?.status === 'Pendiente' || compra?.status === 'Aprobada' || compra?.status === 'Completada' ? 'completed' : 'pending' },
            { label: 'Completada', status: compra?.status === 'Completada' ? 'completed' : 'pending' }
        ];
        return steps;
    };

    const timelineSteps = getTimelineSteps();

    return (
        <DashboardLayout>
            <Container className="mt-4">
                <h2>Detalle de Compra</h2>

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
                                        <p><strong>Estado:</strong> <StatusBadge status={compra?.status} /></p>
                                        <p><strong>Fecha de Creación:</strong> {new Date(compra?.createdAt).toLocaleDateString('es-ES')}</p>
                                        <p><strong>Saldo Pendiente:</strong> ${compra?.saldoPendiente}</p>
                                    </Col>
                                    <Col md={6}>
                                        <h6>Datos del Coche</h6>
                                        {typeof compra?.cotizacion?.coche === 'object' ? (
                                            <>
                                                <p><strong>Marca:</strong> {compra?.cotizacion?.coche?.marca}</p>
                                                <p><strong>Modelo:</strong> {compra?.cotizacion?.coche?.modelo}</p>
                                                <p><strong>Precio:</strong> ${compra?.cotizacion?.coche?.precioBase?.toLocaleString('es-ES')}</p>
                                            </>
                                        ) : (
                                            <p><strong>ID del Coche:</strong> {compra?.cotizacion?.coche}</p>
                                        )}
                                    </Col>
                                </Row>
                                {compra?.cotizacion && (
                                    <>
                                        <hr />
                                        <h6>Datos del Financiamiento</h6>
                                        <Row>
                                            <Col md={4}>
                                                <p><strong>Pago Mensual:</strong> ${compra.cotizacion.pagoMensual?.toLocaleString('es-ES')}</p>
                                            </Col>
                                            <Col md={4}>
                                                <p><strong>Plazo:</strong> {compra.cotizacion.plazoMeses} meses</p>
                                            </Col>
                                            <Col md={4}>
                                                <p><strong>Tasa:</strong> {(compra.cotizacion.tasaInteres * 100)}%</p>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Header>
                                <h5>Resumen</h5>
                            </Card.Header>
                            <Card.Body>
                                {(() => {
                                    const totalPagado = pagos.reduce((total, pago) => total + (pago.monto || 0), 0);
                                    console.log('🔍 DetalleCompra - Render: total pagado calculado:', totalPagado, 'desde pagos:', pagos);
                                    return <p><strong>Total Pagado:</strong> ${totalPagado.toLocaleString('es-ES')}</p>;
                                })()}
                                <p><strong>Próximo Pago:</strong> {compra.proximoPago ? new Date(compra.proximoPago).toLocaleDateString('es-ES') : 'N/A'}</p>
                                <div className="d-grid gap-2 mt-3">
                                    <Button variant="success" onClick={() => setShowPaymentModal(true)}>
                                        Realizar Pago (Tarjeta)
                                    </Button>
                                    {(compra.status === 'Aprobada' || compra.status === 'Completada') && (
                                        <Button variant="outline-warning" onClick={() => setShowReviewModal(true)}>
                                            <Star size={18} className="me-2" />
                                            Calificar Vendedor
                                        </Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Línea de Tiempo del Proceso */}
                <Card className="mb-4">
                    <Card.Header>
                        <h5>Estado del Proceso</h5>
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex flex-column gap-2">
                            {timelineSteps.map((step, index) => (
                                <div key={index} className="d-flex align-items-center">
                                    <div className={`badge ${step.status === 'completed' ? 'bg-success' : step.status === 'current' ? 'bg-primary' : 'bg-secondary'} me-3`}>
                                        {index + 1}
                                    </div>
                                    <span className={step.status === 'completed' ? 'text-success' : step.status === 'current' ? 'fw-bold' : 'text-muted'}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>

                <Card className="mt-4">
                    <Card.Header>
                        <h5>Pagos de Esta Compra</h5>
                    </Card.Header>
                    <Card.Body>
                        {console.log('🔍 DetalleCompra - Render: pagos a pasar a PaymentTable:', pagos)}
                        <PaymentTable payments={pagos} />
                    </Card.Body>
                </Card>



                {/* Modal Realizar Pago */}
                <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Realizar Pago con Tarjeta</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handlePaymentSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Monto a Pagar</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    required
                                    value={paymentForm.monto}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, monto: e.target.value })}
                                    placeholder="0.00"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Comprobante de Pago (Obligatorio)</Form.Label>
                                <Form.Control
                                    type="file"
                                    required
                                    onChange={(e) => setPaymentFile(e.target.files[0])}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Notas (Opcional)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={paymentForm.notas}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, notas: e.target.value })}
                                    placeholder="Ej: Mensualidad Enero"
                                />
                            </Form.Group>
                            <Alert variant="info">
                                <small>Nota: Esta es una simulación. El pago se registrará como "Tarjeta".</small>
                            </Alert>
                            <div className="d-flex justify-content-end gap-2">
                                <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" type="submit" disabled={submittingPayment}>
                                    {submittingPayment ? 'Procesando...' : 'Pagar Ahora'}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Modal Calificar Vendedor */}
                <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered className="dark-modal">
                    <Modal.Header closeButton className="bg-dark text-white border-secondary">
                        <Modal.Title>Calificar Experiencia</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-dark text-white">
                        <Form onSubmit={handleReviewSubmit}>
                            <div className="text-center mb-4">
                                <p className="mb-2">¿Cómo fue tu experiencia con el vendedor?</p>
                                <div className="d-flex justify-content-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={32}
                                            className="cursor-pointer star-rating"
                                            fill={star <= reviewForm.puntuacion ? "#fbbf24" : "none"}
                                            color={star <= reviewForm.puntuacion ? "#fbbf24" : "#6b7280"}
                                            onClick={() => setReviewForm({ ...reviewForm, puntuacion: star })}
                                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <Form.Group className="mb-3">
                                <Form.Label>Comentarios</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={reviewForm.mensaje}
                                    onChange={(e) => setReviewForm({ ...reviewForm, mensaje: e.target.value })}
                                    placeholder="Escribe tu opinión aquí..."
                                    className="bg-dark text-white border-secondary"
                                    style={{ color: 'white', backgroundColor: '#1f2937' }}
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-end gap-2">
                                <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                                    Cancelar
                                </Button>
                                <Button variant="warning" type="submit" disabled={submittingReview}>
                                    {submittingReview ? 'Enviando...' : 'Enviar Calificación'}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                <style>{`
                    .dark-modal .modal-content {
                        background-color: #1f2937;
                        border: 1px solid #374151;
                    }
                    .dark-modal .btn-close {
                        filter: invert(1) grayscale(100%) brightness(200%);
                    }
                    .star-rating:hover {
                        transform: scale(1.2);
                    }
                `}</style>
            </Container>
        </DashboardLayout>
    );
};

export default DetalleCompra;