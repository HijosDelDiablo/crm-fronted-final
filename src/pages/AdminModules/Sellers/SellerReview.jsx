import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Alert, Spinner, Badge } from 'react-bootstrap';
import { getSellerReviews } from '../../../api/reviews.api';
import Sidebar from '../../../components/layout/Sidebar';
import { Star } from 'lucide-react';

const SellerReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getSellerReviews(id, navigate);
                setReviews(data || []);
            } catch (err) {
                setError('Error al cargar las reseñas');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [id, navigate]);

    const renderStars = (count) => {
        return [...Array(5)].map((_, i) => (
            <Star 
                key={i} 
                size={16} 
                fill={i < count ? "#fbbf24" : "none"} 
                color={i < count ? "#fbbf24" : "#9ca3af"} 
            />
        ));
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-container">
                <Container className="mt-4">
                    <h2>Reseñas del Vendedor</h2>
                    <p className="text-muted">ID: {id}</p>

                    {loading ? (
                        <div className="text-center mt-5"><Spinner animation="border" /></div>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : reviews.length === 0 ? (
                        <Alert variant="info">Este vendedor aún no tiene reseñas.</Alert>
                    ) : (
                        <Row>
                            {reviews.map((review, idx) => (
                                <Col md={6} lg={4} key={review._id || idx} className="mb-4">
                                    <Card className="h-100 shadow-sm">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="d-flex gap-1">
                                                    {renderStars(review.puntuacion)}
                                                </div>
                                                <Badge bg="light" text="dark">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </Badge>
                                            </div>
                                            <Card.Text className="mt-3">
                                                "{review.mensaje}"
                                            </Card.Text>
                                            <div className="mt-3 pt-3 border-top">
                                                <small className="text-muted">
                                                    Por: {review.cliente?.nombre || 'Cliente Anónimo'}
                                                </small>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default SellerReview;
