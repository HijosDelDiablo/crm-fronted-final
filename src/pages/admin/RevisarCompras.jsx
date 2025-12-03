import React, { useEffect, useState } from 'react';
import { Container, Tabs, Tab, Table, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
    getComprasPendientes,
    getComprasEnRevision,
    getComprasAprobadas
} from '../../api/compras.api';
import StatusBadge from '../../components/shared/StatusBadge';
import Sidebar from '../../components/layout/Sidebar';

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

    const renderTable = (comprasList, status) => (
        <Table striped bordered hover responsive className="table-dark">
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
                            <td><StatusBadge status={status} /></td>
                            <td>{new Date(compra.fechaCreacion).toLocaleDateString('es-ES')}</td>
                            <td>${compra.saldoPendiente?.toLocaleString('es-ES')}</td>
                            <td>
                                <button
                                    type="button"
                                    className="btn-sm"
                                    style={{
                                        background: '#0f172a',
                                        color: 'white',
                                        border: '1px solid #475569',
                                        borderRadius: '0.375rem',
                                        padding: '0.25rem 0.5rem',
                                        fontWeight: '500',
                                        transition: 'background 0.2s, border-color 0.2s',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleViewDetail(compra._id)}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#1e293b';
                                        e.target.style.borderColor = '#64748b';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = '#0f172a';
                                        e.target.style.borderColor = '#475569';
                                    }}
                                >
                                    Ver Detalle
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );

    if (loading) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <div className="dashboard-container">
                    <Container className="d-flex justify-content-center mt-5">
                        <Spinner animation="border" />
                    </Container>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <div className="dashboard-container">
                    <Container className="mt-4">
                        <Alert variant="danger">{error}</Alert>
                    </Container>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-container">
                <Container className="mt-4">
                    <h2>Revisar Compras</h2>
                    <Tabs defaultActiveKey="pendientes" className="mb-3">
                        <Tab eventKey="pendientes" title="Pendientes">
                            {renderTable(compras.pendientes, "Pendiente")}
                        </Tab>
                        <Tab eventKey="enRevision" title="En Revisión">
                            {renderTable(compras.enRevision, "En Revisión")}
                        </Tab>
                        <Tab eventKey="aprobadas" title="Aprobadas">
                            {renderTable(compras.aprobadas, "Aprobada")}
                        </Tab>
                    </Tabs>
                </Container>
            </div>
        </div>
    );
};

export default RevisarCompras;