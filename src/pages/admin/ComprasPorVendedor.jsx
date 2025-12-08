import React, { useState } from 'react';
import { Container, Form, Button, Table, Alert, Spinner, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getComprasPorVendedor } from '../../api/compras.api';
import StatusBadge from '../../components/shared/StatusBadge';
import Sidebar from '../../components/layout/Sidebar';

const ComprasPorVendedor = () => {
    const [vendedorId, setVendedorId] = useState('');
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!vendedorId.trim()) {
            setError('Por favor ingrese un ID de vendedor');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await getComprasPorVendedor(vendedorId.trim(), navigate);
            setCompras(data);
        } catch (err) {
            setError('Error al buscar compras del vendedor');
            setCompras([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (id) => {
        navigate(`/admin/compras/${id}`);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-container">
                <Container className="mt-4">
                    <h2>Compras por Vendedor</h2>

                    <Card className="mb-4 admin-card">
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>ID del Vendedor</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={vendedorId}
                                    onChange={(e) => setVendedorId(e.target.value)}
                                    placeholder="Ingrese el ID del vendedor"
                                    className="admin-input"
                                />
                            </Form.Group>
                            <Button onClick={handleSearch} disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Buscar Compras'}
                            </Button>
                        </Card.Body>
                    </Card>

                    {error && <Alert variant="danger">{error}</Alert>}

                    {compras.length > 0 && (
                        <Table striped bordered hover responsive className="table-dark">
                            <thead>
                                <tr>
                                    <th>ID Compra</th>
                                    <th>Cliente</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                    <th>Saldo Pendiente</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {compras.map((compra) => (
                                    <tr key={compra._id}>
                                        <td>{compra._id}</td>
                                        <td>{compra.cliente?.nombre || 'N/A'}</td>
                                        <td><StatusBadge status={compra.status || compra.estado} /></td>
                                        <td>{new Date(compra.fechaCreacion || compra.createdAt).toLocaleDateString('es-ES')}</td>
                                        <td>${compra.saldoPendiente?.toLocaleString('es-ES')}</td>
                                        <td>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleViewDetail(compra._id)}
                                            >
                                                Ver Detalle
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}

                    {compras.length === 0 && !loading && !error && vendedorId && (
                        <Alert variant="info">No se encontraron compras para este vendedor.</Alert>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default ComprasPorVendedor;