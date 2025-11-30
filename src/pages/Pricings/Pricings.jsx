import React, { useEffect, useState } from "react";
import Pricing from "./Pricing";
import { Modal, Button, Navbar } from "react-bootstrap";
import './Pricings.css';
import NavbarTop from "../../components/layout/Navbar";
import { getPricings } from "../../api/pricings.api";
import { useNavigate } from "react-router-dom";

export default function Pricings() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pricingsData, setPricings] = useState([]);

  const handleClose = () => setShowModal(false);
  const handleShow = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };
  useEffect(() => {
    getPricingsData();
  }, []);
  
  const getPricingsData = async () => {
    const response = await getPricings(navigate);
    if (response) {
      console.log('response', response);
      setPricings(response);
    }
  };

 

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };

  return (
    <>
    <NavbarTop />
    <div className="pricings-container">
      <div className="container">
        <h1 className="pricings-title">Cotizaciones Recientes</h1>
        
        <div className="row g-4">
          {pricingsData.map((pricing, index) => (
            <div className="col-12 col-md-6 col-lg-6 col-xl-4" key={index}>
              <Pricing 
                pricing={pricing} 
                onClick={() => handleShow(pricing)} 
              />
            </div>
          ))}
        </div>

        {/* Bootstrap Modal */}
        <Modal show={showModal} onHide={handleClose} size="xl" centered>
          <Modal.Header closeButton>
            <Modal.Title>Detalles de la Cotización</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedItem && (
              <div className="container-fluid">
                <div className="row">
                  {/* Left Column: Image & Basic Info */}
                  <div className="col-lg-5 mb-4 mb-lg-0">
                    <img 
                      src={selectedItem.coche.imageUrl} 
                      alt={selectedItem.coche.modelo} 
                      className="pricing-modal-img mb-3"
                    />
                    <h4 className="mb-2">{selectedItem.coche.marca} {selectedItem.coche.modelo}</h4>
                    <p className="text-muted">{selectedItem.coche.descripcion}</p>
                    
                    <h5 className="pricing-modal-section-title">Especificaciones</h5>
                    <div className="pricing-detail-row">
                      <span className="pricing-detail-label">Año:</span>
                      <span className="pricing-detail-value">{selectedItem.coche.ano}</span>
                    </div>
                    <div className="pricing-detail-row">
                      <span className="pricing-detail-label">Condición:</span>
                      <span className="pricing-detail-value">{selectedItem.coche.condicion}</span>
                    </div>
                    <div className="pricing-detail-row">
                      <span className="pricing-detail-label">Transmisión:</span>
                      <span className="pricing-detail-value">{selectedItem.coche.transmision}</span>
                    </div>
                    <div className="pricing-detail-row">
                      <span className="pricing-detail-label">Motor:</span>
                      <span className="pricing-detail-value">{selectedItem.coche.motor}</span>
                    </div>
                  </div>

                  {/* Right Column: Financials & People */}
                  <div className="col-lg-7">
                    <h5 className="pricing-modal-section-title">Detalles Financieros</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Precio Coche:</span>
                          <span className="pricing-detail-value">{formatCurrency(selectedItem.precioCoche)}</span>
                        </div>
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Enganche:</span>
                          <span className="pricing-detail-value">{formatCurrency(selectedItem.enganche)}</span>
                        </div>
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Monto Financiado:</span>
                          <span className="pricing-detail-value">{formatCurrency(selectedItem.montoFinanciado)}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Plazo:</span>
                          <span className="pricing-detail-value">{selectedItem.plazoMeses} meses</span>
                        </div>
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Tasa Interés:</span>
                          <span className="pricing-detail-value">{(selectedItem.tasaInteres * 100).toFixed(2)}%</span>
                        </div>
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Pago Mensual:</span>
                          <span className="pricing-detail-value text-primary">{formatCurrency(selectedItem.pagoMensual)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-light rounded">
                       <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold fs-5">Total a Pagar:</span>
                          <span className="fw-bold fs-5 text-success">${formatCurrency(selectedItem.totalPagado)}</span>
                       </div>
                    </div>

                    <h5 className="pricing-modal-section-title">Estado y Fechas</h5>
                    <div className="row">
                       <div className="col-md-6">
                          <div className="pricing-detail-row">
                            <span className="pricing-detail-label">Status:</span>
                            <span className={`badge ${selectedItem.status === 'Aprobada' ? 'bg-success' : selectedItem.status === 'Rechazada' ? 'bg-danger' : 'bg-warning'}`}>{selectedItem.status}</span>
                          </div>
                       </div>
                       <div className="col-md-6">
                          <div className="pricing-detail-row">
                            <span className="pricing-detail-label">Fecha Creación:</span>
                            <span className="pricing-detail-value">{formatDate(selectedItem.fechaCreacion)}</span>
                          </div>
                       </div>
                    </div>

                    <h5 className="pricing-modal-section-title">Participantes</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-2 border rounded">
                          <img src={selectedItem.cliente.fotoPerfil} alt="Client" className="rounded-circle me-3" width="50" height="50" />
                          <div>
                            <small className="text-muted d-block">Cliente</small>
                            <span className="fw-bold">{selectedItem.cliente.nombre}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-2 border rounded">
                          <img src={selectedItem.vendedor.fotoPerfil} alt="Seller" className="rounded-circle me-3" width="50" height="50" />
                          <div>
                            <small className="text-muted d-block">Vendedor</small>
                            <span className="fw-bold">{selectedItem.vendedor.nombre}</span>
                          </div>
                        </div>
                      </div>
                    </div>

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
      </div>
    </div>
    </>
  );
}
