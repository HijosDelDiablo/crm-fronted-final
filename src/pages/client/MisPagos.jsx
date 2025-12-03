import React, { useEffect, useState } from 'react';
import { Container, Table, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getMisPagos } from '../../api/pagos.api';
import StatusBadge from '../../components/shared/StatusBadge';

const MisPagos = () => {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc'); // desc: más reciente primero
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPagos = async () => {
            try {
                const data = await getMisPagos(navigate);
                setPagos(data);
            } catch (err) {
                setError('Error al cargar los pagos');
            } finally {
                setLoading(false);
            }
        };

        fetchPagos();
    }, [navigate]);

    const sortedPagos = [...pagos].sort((a, b) => {
        const dateA = new Date(a.fecha);
        const dateB = new Date(b.fecha);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    const toggleSort = () => {
        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2>Mis Pagos</h2>
            {pagos.length === 0 ? (
                <Alert variant="info">No tienes pagos registrados.</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Compra</th>
                            <th>Monto</th>
                            <th>Método de Pago</th>
                            <th>
                                Fecha{' '}
                                <Button variant="link" size="sm" onClick={toggleSort}>
                                    {sortOrder === 'desc' ? '↓' : '↑'}
                                </Button>
                            </th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPagos.map((pago) => (
                            <tr key={pago._id}>
                                <td>{pago.compraId || 'N/A'}</td>
                                <td>${pago.monto?.toLocaleString('es-ES')}</td>
                                <td>{pago.metodoPago}</td>
                                <td>{new Date(pago.fecha).toLocaleDateString('es-ES')}</td>
                                <td><StatusBadge status={pago.estado} /></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default MisPagos;