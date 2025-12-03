import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompraById } from '../../api/compras.api';
import { getMisPagos } from '../../api/pagos.api';
import StatusBadge from '../../components/shared/StatusBadge';
import PaymentTable from '../../components/shared/PaymentTable';
import DashboardLayout from '../../components/layout/DashboardLayaut';

const DetalleCompra = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [compra, setCompra] = useState(null);
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('🔍 DetalleCompra - Iniciando fetch para compra ID:', id);

                const compraData = await getCompraById(id, navigate);
                console.log('🔍 DetalleCompra - Datos de compra recibidos:', compraData);
                setCompra(compraData);

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
                                        <p><strong>Saldo Pendiente:</strong> ${compra?.saldoPendiente?.toLocaleString('es-ES')}</p>
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
            </Container>
        </DashboardLayout>
    );
};

export default DetalleCompra;