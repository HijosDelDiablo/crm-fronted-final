import React, { useEffect, useState } from 'react';
import { Container, Tabs, Tab, Table, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
    getComprasPendientes,
    getComprasEnRevision,
    getComprasAprobadas
} from '../../api/compras.api';
import StatusBadge from '../../components/shared/StatusBadge';

const RevisarCompras = () => {
    const [compras, setCompras] = useState({
        pendientes: [],
        enRevision: [],
        aprobadas: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompras = async () => {
            try {
                const [pendientes, enRevision, aprobadas] = await Promise.all([
                    getComprasPendientes(navigate),
                    getComprasEnRevision(navigate),
                    getComprasAprobadas(navigate)
                ]);

                setCompras({
                    pendientes,
                    enRevision,
                    aprobadas
                });
            } catch (err) {
                setError('Error al cargar las compras');
            } finally {
                setLoading(false);
            }
        };

        fetchCompras();
    }, [navigate]);

    const handleViewDetail = (id) => {
        navigate(`/admin/compras/${id}`);
    };

    const renderTable = (comprasList) => (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Vendedor</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Saldo Pendiente</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                {comprasList.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="text-center">
                            No hay compras en esta categoría
                        </td>
                    </tr>
                ) : (
                    comprasList.map((compra) => (
                        <tr key={compra._id}>
                            <td>{compra.cliente?.nombre || 'N/A'}</td>
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
                    ))
                )}
            </tbody>
        </Table>
    );

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
            <h2>Revisar Compras</h2>
            <Tabs defaultActiveKey="pendientes" className="mb-3">
                <Tab eventKey="pendientes" title="Pendientes">
                    {renderTable(compras.pendientes)}
                </Tab>
                <Tab eventKey="enRevision" title="En Revisión">
                    {renderTable(compras.enRevision)}
                </Tab>
                <Tab eventKey="aprobadas" title="Aprobadas">
                    {renderTable(compras.aprobadas)}
                </Tab>
            </Tabs>
        </Container>
    );
};

export default RevisarCompras;