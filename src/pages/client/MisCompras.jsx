import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getMisCompras } from '../../api/compras.api';
import PurchaseCard from '../../components/shared/PurchaseCard';
import DashboardLayout from '../../components/layout/DashboardLayaut';
import { AuthContext } from '../../context/AuthContext';
import './MisCompras.css';

const MisCompras = () => {
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagos, setPagos] = useState([]);
    const [totalPagos, setTotalPagos] = useState(0);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

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

    useEffect(() => {
        const fetchPagos = async () => {
            if (!user || !user.accessToken) return;
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/pagos/mis-pagos`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Pagos recibidos:', data);
                    setPagos(data.pagos || []);
                    setTotalPagos(data.total || 0);
                } else {
                    console.error('Error en la respuesta:', response.status);
                }
            } catch (err) {
                console.error('Error al obtener pagos:', err);
            }
        };

        fetchPagos();
    }, [user]);

    useEffect(() => {
        if (pagos) {
            console.log('Pagos recibidos:', pagos);
        }
    }, [pagos]);

    const handleViewDetail = (id) => {
        navigate(`/cliente/compras/${id}`);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="loading-container">
                    <Spinner animation="border" className="spinner-border" />
                    <p>Cargando tus compras...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h4>Error al cargar compras</h4>
                    <p>{error}</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="compras-container">
                <div className="compras-header">
                    <h2>Mis Compras</h2>
                    <p className="compras-subtitle">
                        Gestiona y revisa todas tus compras realizadas
                    </p>
                </div>
                {compras.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🛒</div>
                        <h3 className="empty-state-title">No tienes compras aún</h3>
                        <p className="empty-state-message">
                            Cuando realices tu primera compra, aparecerá aquí para que puedas
                            hacer seguimiento de tu pedido.
                        </p>
                    </div>
                ) : (
                    <Row className="g-4">
                        {compras.map((compra) => (
                            <Col xxl={3} xl={4} lg={6} md={6} sm={12} xs={12} key={compra._id}>
                                <PurchaseCard
                                    purchase={compra}
                                    onViewDetail={handleViewDetail}
                                />
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MisCompras;