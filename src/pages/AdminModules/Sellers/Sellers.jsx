import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Modal, Button, ListGroup, Image, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Seller from './Seller';
import { getCompleteInfoSeller, desactivateSeller, activateSeller } from '../../../api/sellers.api';
import Sidebar from '../../../components/layout/Sidebar';
import { notifyError, notifySuccess } from '../../../components/shared/Alerts';
import { Star } from 'lucide-react';

const Sellers = () => {
    const navigate = useNavigate();
    const [sellers, setSellers] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        const data = await getCompleteInfoSeller(navigate);
        console.log("data", data);

        if (data) setSellers(data);
    };

    const handleCardClick = (seller) => {
        setSelectedSeller(seller);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedSeller(null);
    };

    const handleDeactivate = async () => {
        if (!selectedSeller) return;
        const response = await desactivateSeller(selectedSeller._id, navigate);
        if (response) {
            notifySuccess('Vendedor desactivado correctamente');
            fetchSellers(); // Refresh list
            setShowConfirmModal(false);
            handleClose();
        }
    };

    const handleActivate = async () => {
        if (!selectedSeller) return;
        const response = await activateSeller(selectedSeller._id, navigate);
        if (response) {
            notifySuccess('Vendedor activado correctamente');
            fetchSellers(); // Refresh list
            setShowConfirmModal(false);
            handleClose();
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-container">
                <Container className="mt-4">
                    <h1 className="pricings-title">Vendedores</h1>
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {sellers.map(seller => (
                            <Col key={seller._id}>
                                <Seller seller={seller} onClick={handleCardClick} />
                            </Col>
                        ))}
                    </Row>

                    {/* Detail Modal */}
                    <Modal show={showModal} onHide={handleClose} size="lg" centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Información del Vendedor</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedSeller && (
                                <div className="d-flex flex-column gap-4">
                                    {/* Header Info */}
                                    <div className="d-flex flex-column flex-md-row gap-4 align-items-center align-items-md-start">
                                        <div className="text-center">
                                            <Image
                                                src={selectedSeller.fotoPerfil}
                                                roundedCircle
                                                thumbnail
                                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                            />
                                            <h4 className="mt-3">{selectedSeller.nombre}</h4>
                                            <div className="mb-2">
                                                <Badge bg="warning" text="dark" className="me-2 d-inline-flex align-items-center gap-1">
                                                    {selectedSeller.promedioEstrellas?.toFixed(1) || 0} <Star size={14} fill="currentColor" />
                                                </Badge>
                                                <Badge bg={selectedSeller.activo ? 'success' : 'secondary'}>
                                                    {selectedSeller.activo ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 w-100">
                                            <h5>Información Personal</h5>
                                            <p><strong>Email:</strong> {selectedSeller.email}</p>
                                            <p><strong>Teléfono:</strong> {selectedSeller.telefono || 'No especificado'}</p>
                                            <p><strong>Fecha de Nacimiento:</strong> {selectedSeller.fechaNacimiento ? new Date(selectedSeller.fechaNacimiento).toLocaleDateString() : 'No especificada'}</p>
                                            <p><strong>Fecha de Registro:</strong> {selectedSeller.createdAt ? new Date(selectedSeller.createdAt).toLocaleDateString() : 'No especificada'}</p>
                                        </div>
                                    </div>

                                    {/* Reviews Section */}
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h5>Últimas Reseñas</h5>
                                            <Button variant="link" onClick={() => navigate(`/seller-reviews/${selectedSeller._id}`)}>
                                                Ver todas
                                            </Button>
                                        </div>
                                        <ListGroup>
                                            {selectedSeller.reviews?.slice(0, 3).map((review, idx) => (
                                                <ListGroup.Item key={idx}>
                                                    <div className="d-flex justify-content-between">
                                                        <strong>{review.clienteName || 'Cliente'}</strong>
                                                        <div className="d-flex align-items-center gap-1">{review.rating} <Star size={14} className="text-warning" fill="currentColor" /></div>
                                                    </div>
                                                    <p className="mb-0 text-muted small">{review.comentario}</p>
                                                </ListGroup.Item>
                                            ))}
                                            {(!selectedSeller.reviews || selectedSeller.reviews.length === 0) && (
                                                <p className="text-muted">No hay reseñas disponibles.</p>
                                            )}
                                        </ListGroup>
                                    </div>

                                    {/* Clients Section */}
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h5>Clientes Asignados</h5>
                                            <Button variant="link" onClick={() => navigate(`/clientes?idSeller=${selectedSeller._id}`)}>
                                                Ver todos
                                            </Button>
                                        </div>
                                        <ListGroup horizontal className="overflow-auto">
                                            {selectedSeller.clientesMuestra?.slice(0, 3).map((client, idx) => (
                                                <ListGroup.Item key={idx} className="border-0 text-center" style={{ minWidth: '100px' }}>
                                                    <Image
                                                        src={client.fotoPerfil}
                                                        roundedCircle
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    />
                                                    <div className="small mt-1 text-truncate" style={{ maxWidth: '100px' }}>
                                                        {client.nombre}
                                                    </div>
                                                </ListGroup.Item>
                                            ))}
                                            {(!selectedSeller.clientesMuestra || selectedSeller.clientesMuestra.length === 0) && (
                                                <p className="text-muted">No tiene clientes asignados.</p>
                                            )}
                                        </ListGroup>
                                    </div>
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setShowConfirmModal(true)} disabled={!selectedSeller?.activo}>
                                Desactivar Vendedor
                            </Button>
                            <Button variant="success" onClick={() => setShowConfirmModal(true)} disabled={selectedSeller?.activo}>
                                Activar Vendedor
                            </Button>
                            <Button variant="secondary" onClick={handleClose}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Confirmation Modal */}
                    <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Desactivación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            ¿Estás seguro de que deseas desactivar al vendedor <strong>{selectedSeller?.nombre}</strong>?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={handleDeactivate}>
                                Desactivar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    {/* Confirmation Modal */}
                    <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Activación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            ¿Estás seguro de que deseas activar al vendedor <strong>{selectedSeller?.nombre}</strong>?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={handleActivate}>
                                Activar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </div>
        </div>
    );
};

export default Sellers;
