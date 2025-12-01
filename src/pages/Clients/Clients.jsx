import React, { useState } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CardClient from './CardClient';
import { useNavigate } from 'react-router-dom';

const Clients = () => {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data
  const clients = [
    {
      "_id": {
        "$oid": "6914e9c415ba85599272b83c"
      },
      "email": "miltonalfredopm@gmail.com",
      "nombre": "Arath Taverga",
      "telefono": "+524772685827",
      "fotoPerfil": "https://randomuser.me/api/portraits/men/52.jpg",
      "fechaNacimiento": "1957-06-09T01:08:19.923Z",
      "activo": true,
      "rol": "CLIENTE",
      "createdAt": {
        "$date": "2025-11-12T20:10:44.736Z"
      },
    },
    {
      "_id": { "$oid": "6914e9c415ba85599272b83d" },
      "email": "juan.perez@example.com",
      "nombre": "Juan Perez",
      "telefono": "+525512345678",
      "fotoPerfil": "https://randomuser.me/api/portraits/men/33.jpg",
      "fechaNacimiento": "1985-03-15T00:00:00.000Z",
      "activo": true,
      "rol": "CLIENTE",
      "createdAt": { "$date": "2025-11-10T10:00:00.000Z" }
    },
    {
      "_id": { "$oid": "6914e9c415ba85599272b83e" },
      "email": "maria.lopez@example.com",
      "nombre": "Maria Lopez",
      "telefono": "+523398765432",
      "fotoPerfil": "https://randomuser.me/api/portraits/women/44.jpg",
      "fechaNacimiento": "1992-07-22T00:00:00.000Z",
      "activo": true,
      "rol": "CLIENTE",
      "createdAt": { "$date": "2025-11-11T15:30:00.000Z" }
    },
    {
      "_id": { "$oid": "6914e9c415ba85599272b83f" },
      "email": "ana.garcia@example.com",
      "nombre": "Ana Garcia",
      "telefono": "+528187654321",
      "fotoPerfil": "https://randomuser.me/api/portraits/women/68.jpg",
      "fechaNacimiento": "1995-11-30T00:00:00.000Z",
      "activo": false,
      "rol": "CLIENTE",
      "createdAt": { "$date": "2025-11-05T09:15:00.000Z" }
    }
  ];

  const handleCardClick = (client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedClient(null);
  };

  return (
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
                <p><strong>Fecha de Registro:</strong> {new Date(selectedClient.createdAt.$date).toLocaleDateString()}</p>
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
  );
};

export default Clients;