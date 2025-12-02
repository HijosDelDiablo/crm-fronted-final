import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CardClient from './CardClient';
import { useNavigate } from 'react-router-dom';
import { getClients } from '../../../api/clients.api';
import Sidebar from '../../../components/layout/Sidebar';
import { getSellersWithNumClients, setSellerToClient } from '../../../api/sellers.api';
import { notifySuccess } from '../../../components/shared/Alerts';

const Clients = () => {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [sellers, setSellers] = useState([]);

  // Seller Assignment State
  const [showAllSellers, setShowAllSellers] = useState(false);
  const [showAssignList, setShowAssignList] = useState(false);
  const [sellerToAssign, setSellerToAssign] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    getClientsData();
    getSellersData();
  }, []);

  const getClientsData = async () => {
    const response = await getClients(navigate);
    setClients(response);
  };

  const getSellersData = async () => {
    const response = await getSellersWithNumClients(navigate);
    setSellers(response);
  };

  const handleCardClick = (client) => {
    console.log("client", client);
    setSelectedClient(client);
    setShowModal(true);
    // Reset assignment state when opening a new client
    setShowAssignList(false);
    setShowAllSellers(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedClient(null);
    setShowAssignList(false);
    setShowAllSellers(false);
  };

  const handleShowAssignList = () => {
    setShowAssignList(true);
  };

  const handleSelectSeller = (seller) => {
    setSellerToAssign(seller);
    setShowConfirmModal(true);
  };

  const confirmAssignment = async () => {
    if (!selectedClient || !sellerToAssign) return;

    const data = {
      userId: selectedClient._id?.$oid || selectedClient._id,
      sellerId: sellerToAssign._id
    };

    const response = await setSellerToClient(data, navigate);

    if (response) {
      notifySuccess(`Vendedor ${sellerToAssign.nombre} asignado correctamente.`);

      // Update local state
      const updatedClient = {
        ...selectedClient,
        vendedorQueAtiende: {
          id: sellerToAssign._id,
          nombre: sellerToAssign.nombre,
          fotoPerfil: sellerToAssign.fotoPerfil
        }
      };

      // Update selected client and clients list
      setSelectedClient(updatedClient);
      setClients(clients.map(c =>
        (c._id?.$oid || c._id) === (updatedClient._id?.$oid || updatedClient._id) ? updatedClient : c
      ));

      // Close modals
      setShowConfirmModal(false);
      setShowAssignList(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-container">
        <Container className="mt-4">
          <h1 className="mb-4">Clientes</h1>
          <Row xs={1} md={2} lg={3} className="g-4">
            {clients.map((client) => (
              <Col key={client._id?.$oid || client._id}>
                <CardClient client={client} onClick={handleCardClick} />
              </Col>
            ))}
          </Row>

        {/* Client Details Modal */}
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
                  <p><strong>Teléfono:</strong> {selectedClient.telefono ? selectedClient.telefono : 'No especificado'}</p>
                  <p><strong>Fecha de Nacimiento:</strong> {new Date(selectedClient.fechaNacimiento).toLocaleDateString()}</p>
                  {selectedClient.createdAt ? (
                    <p><strong>Fecha de Registro:</strong> {new Date(selectedClient.createdAt.$date || selectedClient.createdAt).toLocaleDateString()}</p>
                  ) : null}
                  <p><strong>ID:</strong> {selectedClient._id?.$oid || selectedClient._id}</p>
                  <br />

                  {selectedClient.vendedorQueAtiende ? (
                    <div className="pricing-user-info seller justify-content-end">
                      <div className="pricing-user-details text-end me-2">
                        <span className="pricing-user-role">Vendedor Asignado</span>
                        <a href={`/sellers/${selectedClient.vendedorQueAtiende.id}`} className="pricing-user-name" onClick={(e) => e.stopPropagation()}>
                          {selectedClient.vendedorQueAtiende.nombre}
                        </a>
                      </div>
                      <img
                        src={selectedClient.vendedorQueAtiende.fotoPerfil}
                        alt={selectedClient.vendedorQueAtiende.nombre}
                        className="pricing-user-img"
                      />
                    </div>
                  ) : (
                    <div>
                      {!showAssignList ? (
                        <Button variant="primary" onClick={handleShowAssignList}>
                          Asignar Vendedor
                        </Button>
                      ) : (
                        <div className="mt-2">
                          <p className="mb-2 fw-bold">Selecciona un vendedor:</p>
                          <div className="list-group" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {(showAllSellers ? sellers : sellers.slice(0, 5)).map(seller => (
                              <button
                                key={seller._id}
                                type="button"
                                className="list-group-item list-group-item-action d-flex align-items-center justify-content-between p-2"
                                onClick={() => handleSelectSeller(seller)}
                              >
                                <div className="d-flex align-items-center">
                                  <img
                                    src={seller.fotoPerfil}
                                    alt={seller.nombre}
                                    className="rounded-circle me-3"
                                    width="40"
                                    height="40"
                                    style={{ objectFit: 'cover' }}
                                  />
                                  <span className="fw-medium">{seller.nombre}</span>
                                </div>
                                <span className="badge bg-light text-dark border">
                                  {seller.cantidadClientes || 0} clientes
                                </span>
                              </button>
                            ))}
                          </div>
                          {sellers.length > 5 && (
                            <button
                              className="btn btn-link btn-sm p-0 mt-2"
                              onClick={() => setShowAllSellers(!showAllSellers)}
                            >
                              {showAllSellers ? "Mostrar menos" : "Mostrar todos"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={() => navigate(`/pricings?idClient=${selectedClient?._id?.$oid || selectedClient?._id}`)}>
              Ver Cotizaciones
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Confirmation Modal */}
        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Asignación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro de que deseas asignar al vendedor <strong>{sellerToAssign?.nombre}</strong> a este cliente?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={confirmAssignment}>
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      </div>
    </div>
  );
};

export default Clients;