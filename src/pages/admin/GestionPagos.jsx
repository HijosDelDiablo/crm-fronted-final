import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Spinner, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCompraById, getAllCompras } from '../../api/compras.api';
import { getPagosPorCompra, registrarPago } from '../../api/pagos.api';
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

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [pagoForm, setPagoForm] = useState({
        monto: '',
        metodoPago: 'Transferencia',
        notas: ''
    });
    const [submitting, setSubmitting] = useState(false);

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

    const handleRegistrarPago = async (e) => {
        e.preventDefault();
        if (!selectedCompraId) return;

        setSubmitting(true);
        try {
            await registrarPago({
                compraId: selectedCompraId,
                monto: parseFloat(pagoForm.monto),
                metodoPago: pagoForm.metodoPago,
                notas: pagoForm.notas
            }, navigate);

            // Recargar datos
            await handleSearch();
            setShowModal(false);
            setPagoForm({ monto: '', metodoPago: 'Transferencia', notas: '' });
            alert('Pago registrado correctamente');
        } catch (err) {
            alert('Error al registrar el pago');
        } finally {
            setSubmitting(false);
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
                                <>
                                    <div className="d-flex justify-content-end mb-3">
                                        <Button variant="success" onClick={() => setShowModal(true)}>
                                            + Registrar Nuevo Pago
                                        </Button>
                                    </div>

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
                                                    <p><strong>Saldo Pendiente:</strong> ${compra.saldoPendiente?.toLocaleString('es-ES')}</p>
                                                    <p><strong>Total Pagado:</strong> ${compra.totalPagado?.toLocaleString('es-ES')}</p>
                                                </Col>
                                                <Col md={6}>
                                                    <p><strong>Coche ID:</strong> {compra.cotizacion?.coche}</p>
                                                    <p><strong>Precio Coche:</strong> ${compra.cotizacion?.precioCoche?.toLocaleString('es-ES')}</p>
                                                    <p><strong>Enganche:</strong> ${compra.cotizacion?.enganche?.toLocaleString('es-ES')}</p>
                                                    <p><strong>Pago Mensual:</strong> ${compra.cotizacion?.pagoMensual?.toLocaleString('es-ES')}</p>
                                                    <p><strong>Plazo Meses:</strong> {compra.cotizacion?.plazoMeses}</p>
                                                    <p><strong>Fecha Creación:</strong> {new Date(compra.createdAt).toLocaleDateString('es-ES')}</p>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </>
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

                    {/* Modal Registrar Pago */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Registrar Pago</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleRegistrarPago}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Monto</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        required
                                        value={pagoForm.monto}
                                        onChange={(e) => setPagoForm({ ...pagoForm, monto: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Método de Pago</Form.Label>
                                    <Form.Select
                                        value={pagoForm.metodoPago}
                                        onChange={(e) => setPagoForm({ ...pagoForm, metodoPago: e.target.value })}
                                    >
                                        <option value="Transferencia">Transferencia</option>
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Tarjeta">Tarjeta</option>
                                        <option value="Cheque">Cheque</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Notas</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={pagoForm.notas}
                                        onChange={(e) => setPagoForm({ ...pagoForm, notas: e.target.value })}
                                    />
                                </Form.Group>
                                <div className="d-flex justify-content-end gap-2">
                                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={submitting}>
                                        {submitting ? 'Registrando...' : 'Registrar Pago'}
                                    </Button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </Container>
            </div>
        </div>
    );
};

export default GestionPagos;