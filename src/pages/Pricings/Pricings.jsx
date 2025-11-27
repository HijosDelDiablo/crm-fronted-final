import React, { useEffect, useState } from "react";
import Pricing from "./Pricing";
import { Modal, Button, Navbar } from "react-bootstrap";
import './Pricings.css';
import NavbarTop from "../../components/layout/Navbar";
import { getPricings } from "../../api/pricings.api";

export default function Pricings() {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  //const [pricingsData, setPricings] = useState([]);

  const handleClose = () => setShowModal(false);
  const handleShow = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };
  useEffect(() => {
    getPricingsData();
  }, []);
  
  const getPricingsData = async () => {
    const response = await getPricings();
    if (response) {
      console.log('response', response);
      //setPricings(response);
    }
  };

  // Mock Data
  const pricingsData = [
    {
      _id: { $oid: "691e21852163b6aded369fea" },
      product: {
        _id: { $oid: "prod1" },
        marca: "Volvo",
        modelo: "X3",
        ano: 2022,
        descripcion: "Unidad Volvo X3 en excelente estado, lista para entrega inmediata.",
        condicion: "Nuevo",
        tipo: "SUV",
        transmision: "DCT",
        motor: "2.5L",
        imageUrl: "https://picsum.photos/id/1/300/200",
      },
      pricing: {
        _id: { $oid: "price1" },
        precioCoche: 1053000,
        enganche: 368550,
        plazoMeses: 24,
        tasaInteres: 0.15,
        pagoMensual: 33186.69,
        montoFinanciado: 684450,
        totalPagado: 1165030.47,
        status: "Rechazada",
        fechaCreacion: { $date: "2025-11-19T19:59:02.021Z" },
        fechaAprobacion: { $date: "2025-11-19T19:59:02.021Z" },
      },
      seller: {
        id: "sel1",
        name: "Carlos Vendedor",
        image: "https://i.pravatar.cc/150?u=sel1",
      },
      client: {
        id: "cli1",
        name: "Juan Cliente",
        image: "https://i.pravatar.cc/150?u=cli1",
      },
    },
    {
      _id: { $oid: "691e21852163b6aded369feb" },
      product: {
        _id: { $oid: "prod2" },
        marca: "BMW",
        modelo: "X5",
        ano: 2023,
        descripcion: "BMW X5 de lujo, con todos los accesorios incluidos.",
        condicion: "Usado",
        tipo: "SUV",
        transmision: "Automática",
        motor: "3.0L Turbo",
        imageUrl: "https://picsum.photos/id/2/300/200",
      },
      pricing: {
        _id: { $oid: "price2" },
        precioCoche: 1500000,
        enganche: 500000,
        plazoMeses: 36,
        tasaInteres: 0.12,
        pagoMensual: 35000.00,
        montoFinanciado: 1000000,
        totalPagado: 1760000.00,
        status: "Aprobada",
        fechaCreacion: { $date: "2025-11-20T10:00:00.000Z" },
        fechaAprobacion: { $date: "2025-11-21T11:00:00.000Z" },
      },
      seller: {
        id: "sel2",
        name: "Ana Vendedora",
        image: "https://i.pravatar.cc/150?u=sel2",
      },
      client: {
        id: "cli2",
        name: "Maria Cliente",
        image: "https://i.pravatar.cc/150?u=cli2",
      },
    },
    {
      _id: { $oid: "691e21852163b6aded369fec" },
      product: {
        _id: { $oid: "prod3" },
        marca: "Audi",
        modelo: "Q7",
        ano: 2024,
        descripcion: "Audi Q7 último modelo, tecnología híbrida.",
        condicion: "Nuevo",
        tipo: "SUV",
        transmision: "Tiptronic",
        motor: "3.0L V6",
        imageUrl: "https://picsum.photos/id/3/300/200",
      },
      pricing: {
        _id: { $oid: "price3" },
        precioCoche: 1800000,
        enganche: 600000,
        plazoMeses: 48,
        tasaInteres: 0.10,
        pagoMensual: 30000.00,
        montoFinanciado: 1200000,
        totalPagado: 2040000.00,
        status: "Pendiente",
        fechaCreacion: { $date: "2025-11-22T14:30:00.000Z" },
        fechaAprobacion: null,
      },
      seller: {
        id: "sel3",
        name: "Pedro Vendedor",
        image: "https://i.pravatar.cc/150?u=sel3",
      },
      client: {
        id: "cli3",
        name: "Luis Cliente",
        image: "https://i.pravatar.cc/150?u=cli3",
      },
    },
  ];

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
          {pricingsData.map((item, index) => (
            <div className="col-12 col-md-6 col-lg-6 col-xl-4" key={index}>
              <Pricing 
                data={item} 
                onClick={() => handleShow(item)} 
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
                      src={selectedItem.product.imageUrl} 
                      alt={selectedItem.product.modelo} 
                      className="pricing-modal-img mb-3"
                    />
                    <h4 className="mb-2">{selectedItem.product.marca} {selectedItem.product.modelo}</h4>
                    <p className="text-muted">{selectedItem.product.descripcion}</p>
                    
                    <h5 className="pricing-modal-section-title">Especificaciones</h5>
                    <div className="pricing-detail-row">
                      <span className="pricing-detail-label">Año:</span>
                      <span className="pricing-detail-value">{selectedItem.product.ano}</span>
                    </div>
                    <div className="pricing-detail-row">
                      <span className="pricing-detail-label">Condición:</span>
                      <span className="pricing-detail-value">{selectedItem.product.condicion}</span>
                    </div>
                    <div className="pricing-detail-row">
                      <span className="pricing-detail-label">Transmisión:</span>
                      <span className="pricing-detail-value">{selectedItem.product.transmision}</span>
                    </div>
                    <div className="pricing-detail-row">
                      <span className="pricing-detail-label">Motor:</span>
                      <span className="pricing-detail-value">{selectedItem.product.motor}</span>
                    </div>
                  </div>

                  {/* Right Column: Financials & People */}
                  <div className="col-lg-7">
                    <h5 className="pricing-modal-section-title">Detalles Financieros</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Precio Coche:</span>
                          <span className="pricing-detail-value">{formatCurrency(selectedItem.pricing.precioCoche)}</span>
                        </div>
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Enganche:</span>
                          <span className="pricing-detail-value">{formatCurrency(selectedItem.pricing.enganche)}</span>
                        </div>
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Monto Financiado:</span>
                          <span className="pricing-detail-value">{formatCurrency(selectedItem.pricing.montoFinanciado)}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Plazo:</span>
                          <span className="pricing-detail-value">{selectedItem.pricing.plazoMeses} meses</span>
                        </div>
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Tasa Interés:</span>
                          <span className="pricing-detail-value">{(selectedItem.pricing.tasaInteres * 100).toFixed(2)}%</span>
                        </div>
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Pago Mensual:</span>
                          <span className="pricing-detail-value text-primary">{formatCurrency(selectedItem.pricing.pagoMensual)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-light rounded">
                       <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold fs-5">Total a Pagar:</span>
                          <span className="fw-bold fs-5 text-success">{formatCurrency(selectedItem.pricing.totalPagado)}</span>
                       </div>
                    </div>

                    <h5 className="pricing-modal-section-title">Estado y Fechas</h5>
                    <div className="row">
                       <div className="col-md-6">
                          <div className="pricing-detail-row">
                            <span className="pricing-detail-label">Status:</span>
                            <span className={`badge ${selectedItem.pricing.status === 'Aprobada' ? 'bg-success' : selectedItem.pricing.status === 'Rechazada' ? 'bg-danger' : 'bg-warning'}`}>{selectedItem.pricing.status}</span>
                          </div>
                       </div>
                       <div className="col-md-6">
                          <div className="pricing-detail-row">
                            <span className="pricing-detail-label">Fecha Creación:</span>
                            <span className="pricing-detail-value">{formatDate(selectedItem.pricing.fechaCreacion?.$date)}</span>
                          </div>
                       </div>
                    </div>

                    <h5 className="pricing-modal-section-title">Participantes</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-2 border rounded">
                          <img src={selectedItem.client.image} alt="Client" className="rounded-circle me-3" width="50" height="50" />
                          <div>
                            <small className="text-muted d-block">Cliente</small>
                            <span className="fw-bold">{selectedItem.client.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-2 border rounded">
                          <img src={selectedItem.seller.image} alt="Seller" className="rounded-circle me-3" width="50" height="50" />
                          <div>
                            <small className="text-muted d-block">Vendedor</small>
                            <span className="fw-bold">{selectedItem.seller.name}</span>
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
