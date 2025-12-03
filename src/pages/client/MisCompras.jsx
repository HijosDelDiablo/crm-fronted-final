import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getMisCompras } from '../../api/compras.api';
import PurchaseCard from '../../components/shared/PurchaseCard';
import DashboardLayout from '../../components/layout/DashboardLayaut';

const MisCompras = () => {
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompras = async () => {
            try {
                const data = await getMisCompras(navigate);
                console.log('🔍 MisCompras - Datos recibidos de getMisCompras:', data);
                console.log('🔍 MisCompras - Tipo de dato:', typeof data);
                console.log('🔍 MisCompras - Es array:', Array.isArray(data));
                if (Array.isArray(data)) {
                    console.log('🔍 MisCompras - Número de compras:', data.length);
                    data.forEach((compra, index) => {
                        console.log(`🔍 MisCompras - Compra ${index}:`, compra);
                    });
                }
                setCompras(data);
            } catch (err) {
                console.error('❌ MisCompras - Error al cargar compras:', err);
                setError('Error al cargar las compras');
            } finally {
                setLoading(false);
            }
        };

        fetchCompras();
    }, [navigate]);

    const handleViewDetail = (id) => {
        navigate(`/cliente/compras/${id}`);
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
                <h2>Mis Compras</h2>
                {compras.length === 0 ? (
                    <Alert variant="info">No tienes compras registradas.</Alert>
                ) : (
                    <Row>
                        {compras.map((compra) => (
                            <Col md={6} lg={4} key={compra._id}>
                                <PurchaseCard
                                    purchase={compra}
                                    onViewDetail={handleViewDetail}
                                />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </DashboardLayout>
    );
};

export default MisCompras;