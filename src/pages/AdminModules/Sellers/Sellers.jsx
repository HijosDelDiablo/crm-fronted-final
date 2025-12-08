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
                                                <Badge bg={selectedSeller.activo ? 'success' : 'secondary'}>
                                                    {selectedSeller.activo ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 w-100">
                                            <h5>Información Personal</h5>
                                            <p><strong>Email:</strong> {selectedSeller.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
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
