import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCompraById } from '../../api/compras.api';
import { getPagosPorCompra } from '../../api/pagos.api';
import PaymentTable from '../../components/shared/PaymentTable';
import StatusBadge from '../../components/shared/StatusBadge';
import Sidebar from '../../components/layout/Sidebar';

const GestionPagos = () => {
    const [compraId, setCompraId] = useState('');
    const [compra, setCompra] = useState(null);
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!compraId.trim()) {
            setError('Por favor ingrese un ID de compra');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [compraData, pagosData] = await Promise.all([
                getCompraById(compraId.trim(), navigate),
                getPagosPorCompra(compraId.trim(), navigate)
            ]);

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

                    <Card className="mb-4 admin-card">
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>ID de la Compra</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="admin-input"
                                    value={compraId}
                                    onChange={(e) => setCompraId(e.target.value)}
                                    placeholder="Ingrese el ID de la compra"
                                />
                            </Form.Group>
                            <Button onClick={handleSearch} disabled={loading}>
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
                                        <p><strong>Estado:</strong> <StatusBadge status={compra.estado} /></p>
                                    </Col>
                                    <Col md={6}>
                                        <p><strong>Coche:</strong> {compra.coche?.marca} {compra.coche?.modelo}</p>
                                        <p><strong>Saldo Pendiente:</strong> ${compra.saldoPendiente}</p>
                                        <p><strong>Fecha:</strong> {new Date(compra.fechaCreacion).toLocaleDateString('es-ES')}</p>
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
                </Container>
            </div>
        </div>
    );
};

export default GestionPagos;