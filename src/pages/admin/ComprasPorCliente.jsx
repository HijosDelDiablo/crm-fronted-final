import React, { useState } from 'react';
import { Container, Form, Button, Table, Alert, Spinner, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getComprasPorCliente } from '../../api/compras.api';
import StatusBadge from '../../components/shared/StatusBadge';

const ComprasPorCliente = () => {
    const [clienteId, setClienteId] = useState('');
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!clienteId.trim()) {
            setError('Por favor ingrese un ID de cliente');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await getComprasPorCliente(clienteId.trim(), navigate);
            setCompras(data);
        } catch (err) {
            setError('Error al buscar compras del cliente');
            setCompras([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (id) => {
        navigate(`/admin/compras/${id}`);
    };

    return (
        <Container className="mt-4">
            <h2>Compras por Cliente</h2>

            <Card className="mb-4">
                <Card.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>ID del Cliente</Form.Label>
                        <Form.Control
                            type="text"
                            value={clienteId}
                            onChange={(e) => setClienteId(e.target.value)}
                            placeholder="Ingrese el ID del cliente"
                        />
                    </Form.Group>
                    <Button onClick={handleSearch} disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Buscar Compras'}
                    </Button>
                </Card.Body>
            </Card>

            {error && <Alert variant="danger">{error}</Alert>}

            {compras.length > 0 && (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID Compra</th>
                            <th>Vendedor</th>
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
                                <td>{compra.vendedor?.nombre || 'N/A'}</td>
                                <td><StatusBadge status={compra.estado} /></td>
                                <td>{new Date(compra.fechaCreacion).toLocaleDateString('es-ES')}</td>
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

            {compras.length === 0 && !loading && !error && clienteId && (
                <Alert variant="info">No se encontraron compras para este cliente.</Alert>
            )}
        </Container>
    );
};

export default ComprasPorCliente;