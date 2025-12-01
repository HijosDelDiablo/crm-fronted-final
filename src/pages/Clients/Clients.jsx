import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CardClient from './CardClient';
import { useNavigate } from 'react-router-dom';
import { getClients } from '../../api/clients.api';
import NavbarTop from '../../components/layout/Navbar';

const Clients = () => {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    getClientsData();
  }, []);

  const getClientsData = async () => {
    const response = await getClients(navigate);
    setClients(response);
  };



  const handleCardClick = (client) => {
    console.log("client", client);
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedClient(null);
  };

  return (
    <>
      <NavbarTop />
      <Container className="mt-4">
        <h1 className="mb-4">Clientes</h1>
        <Row xs={1} md={2} lg={3} className="g-4">
          {clients.map((client) => (
            <Col key={client._id.$oid}>
              <CardClient client={client} onClick={handleCardClick} />
            </Col>
          ))}
        </Row>

        <Modal show={showModal} onHide={handleClose} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Información del Cliente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedClient && (
              <div className="d-flex flex-column flex-md-row gap-4">
                <div className="text-center">
                  <img
                    src={selectedClient.fotoPerfil}
                    alt={selectedClient.nombre}
                    className="rounded-circle img-thumbnail"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                  <h4 className="mt-3">{selectedClient.nombre}</h4>
                  <span className={`badge ${selectedClient.activo ? 'bg-success' : 'bg-secondary'}`}>
                    {selectedClient.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex-grow-1">
                  <p><strong>Email:</strong> {selectedClient.email}</p>
                  <p><strong>Teléfono:</strong> {selectedClient.telefono}</p>
                  <p><strong>Rol:</strong> {selectedClient.rol}</p>
                  <p><strong>Fecha de Nacimiento:</strong> {new Date(selectedClient.fechaNacimiento).toLocaleDateString()}</p>
                  {selectedClient.createdAt.$date ? (<p><strong>Fecha de Registro:</strong> {new Date(selectedClient.createdAt.$date).toLocaleDateString()}</p>) : null}
                  <p><strong>ID:</strong> {selectedClient._id.$oid}</p>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={() => navigate(`/pricings?idClient=${selectedClient?._id?.$oid}`)}>
              Ver Cotizaciones
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Clients;