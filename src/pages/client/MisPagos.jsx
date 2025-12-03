import React, { useEffect, useState } from 'react';
import { Container, Table, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getMisPagos } from '../../api/pagos.api';
import StatusBadge from '../../components/shared/StatusBadge';
import DashboardLayout from '../../components/layout/DashboardLayaut';

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
                setPagos(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Error al cargar los pagos');
                setPagos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPagos();
    }, [navigate]);

    const sortedPagos = Array.isArray(pagos) ? [...pagos].sort((a, b) => {
        const dateA = new Date(a.fecha);
        const dateB = new Date(b.fecha);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    }) : [];

    const toggleSort = () => {
        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
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

    return (
        <DashboardLayout>
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
                            {sortedPagos.map((pago) => {
                                // Función para obtener el nombre de la compra/coche
                                const getCompraInfo = () => {
                                    if (!pago.compra) return 'N/A';

                                    // Si la compra tiene información del coche
                                    if (pago.compra.cotizacion?.coche) {
                                        const coche = pago.compra.cotizacion.coche;
                                        if (typeof coche === 'object' && coche.marca && coche.modelo) {
                                            return `${coche.marca} ${coche.modelo}`;
                                        }
                                        if (typeof coche === 'object' && coche.nombre) {
                                            return coche.nombre;
                                        }
                                        if (typeof coche === 'string') {
                                            return `ID: ${coche}`;
                                        }
                                    }

                                    // Si no hay info del coche, mostrar ID de compra de manera legible
                                    return `Compra #${pago.compra._id?.slice(-6)}`;
                                };

                                return (
                                    <tr key={pago._id}>
                                        <td>{getCompraInfo()}</td>
                                        <td>${pago.monto?.toLocaleString('es-ES')}</td>
                                        <td>{pago.metodoPago}</td>
                                        <td>{new Date(pago.fecha).toLocaleDateString('es-ES')}</td>
                                        <td><StatusBadge status={pago.status} /></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                )}
            </Container>
        </DashboardLayout>
    );
};

export default MisPagos;