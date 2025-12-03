import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCompraById, getAllCompras } from '../../api/compras.api';
import { getPagosPorCompra } from '../../api/pagos.api';
import PaymentTable from '../../components/shared/PaymentTable';
import StatusBadge from '../../components/shared/StatusBadge';
import Sidebar from '../../components/layout/Sidebar';

const GestionPagos = () => {
    const [compraId, setCompraId] = useState('');
    const [selectedCompraId, setSelectedCompraId] = useState('');
    const [allCompras, setAllCompras] = useState([]);
    const [compra, setCompra] = useState(null);
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCompras, setLoadingCompras] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllCompras = async () => {
            try {
                const compras = await getAllCompras(navigate);
                setAllCompras(compras);
            } catch (err) {
                setError('Error al cargar las compras');
            } finally {
                setLoadingCompras(false);
            }
        };

        fetchAllCompras();
    }, [navigate]);

    const handleSearch = async () => {
        if (!selectedCompraId) {
            setError('Por favor seleccione una compra');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [compraData, pagosData] = await Promise.all([
                getCompraById(selectedCompraId, navigate),
                getPagosPorCompra(selectedCompraId, navigate)
            ]);

            console.log('Compra data:', compraData);
            console.log('Pagos data:', pagosData);

            setCompra(compraData);
            setPagos(pagosData);
        } catch (err) {
            setError('Error al buscar la compra y sus pagos');
            setCompra(null);
            setPagos([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-container">
                <Container className="mt-4">
                    <h2>Gestión de Pagos</h2>

                    {loadingCompras ? (
                        <div className="d-flex justify-content-center mt-4">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <div>
                            <Card className="mb-4 admin-card">
                                <Card.Body>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Seleccionar Compra</Form.Label>
                                        <Form.Select
                                            className="admin-input"
                                            value={selectedCompraId}
                                            onChange={(e) => setSelectedCompraId(e.target.value)}
                                            disabled={loadingCompras}
                                        >
                                            <option value="">Seleccione una compra</option>
                                            {allCompras.map((comp) => (
                                                <option key={comp._id} value={comp._id}>
                                                    ID: {comp._id} - Cliente: {comp.cliente?.nombre} - Fecha: {new Date(comp.createdAt).toLocaleDateString('es-ES')}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Button onClick={handleSearch} disabled={loading || !selectedCompraId}>
                                        {loading ? <Spinner animation="border" size="sm" /> : 'Buscar'}
                                    </Button>
                                </Card.Body>
                            </Card>

                            {error && <Alert variant="danger">{error}</Alert>}

                            {compra && (
                                <Card className="mb-4 admin-card">
                                    <Card.Header>
                                        <h5>Detalle de la Compra</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <p><strong>ID:</strong> {compra._id}</p>
                                                <p><strong>Cliente:</strong> {compra.cliente?.nombre}</p>
                                                <p><strong>Vendedor:</strong> {compra.vendedor?.nombre || 'N/A'}</p>
                                                <p><strong>Estado:</strong> <StatusBadge status={compra.status} /></p>
                                                <p><strong>Saldo Pendiente:</strong> ${compra.saldoPendiente}</p>
                                                <p><strong>Total Pagado:</strong> ${compra.totalPagado}</p>
                                                <p><strong>Monto Total Crédito:</strong> ${compra.montoTotalCredito}</p>
                                            </Col>
                                            <Col md={6}>
                                                <p><strong>Coche ID:</strong> {compra.cotizacion?.coche}</p>
                                                <p><strong>Precio Coche:</strong> ${compra.cotizacion?.precioCoche}</p>
                                                <p><strong>Enganche:</strong> ${compra.cotizacion?.enganche}</p>
                                                <p><strong>Monto Financiado:</strong> ${compra.cotizacion?.montoFinanciado}</p>
                                                <p><strong>Pago Mensual:</strong> ${compra.cotizacion?.pagoMensual}</p>
                                                <p><strong>Plazo Meses:</strong> {compra.cotizacion?.plazoMeses}</p>
                                                <p><strong>Tasa Interés:</strong> {(compra.cotizacion?.tasaInteres * 100)}%</p>
                                                <p><strong>Fecha Creación:</strong> {new Date(compra.createdAt).toLocaleDateString('es-ES')}</p>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            )}

                            {pagos.length > 0 && (
                                <Card className="admin-card">
                                    <Card.Header>
                                        <h5>Historial de Pagos</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <PaymentTable payments={pagos} />
                                    </Card.Body>
                                </Card>
                            )}

                            {compra && pagos.length === 0 && !loading && (
                                <Alert variant="info">Esta compra no tiene pagos registrados.</Alert>
                            )}
                        </div>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default GestionPagos;