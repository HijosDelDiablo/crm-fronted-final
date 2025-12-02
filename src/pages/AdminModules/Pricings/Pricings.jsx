import React, { useEffect, useState } from "react";
import Pricing from "./Pricing";
import { Modal, Button, Navbar } from "react-bootstrap";
import './Pricings.css';
import NavbarTop from "../../../components/layout/Navbar";
import { getPricings } from "../../../api/pricings.api";
import { getSellersWithNumClients, setSellerToClient, setSellerToPricing } from "../../../api/sellers.api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { notifyError } from "../../../components/shared/Alerts";

export default function Pricings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pricingIdFromUrl = searchParams.get('idPricing');
  const clientIdFromUrl = searchParams.get('idClient');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pricingsData, setPricings] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [showAllSellers, setShowAllSellers] = useState(false);
  const [pricingsOfClient, setPricingsOfClient] = useState([]);

  const handleClose = () => setShowModal(false);
  const handleShow = async (item) => {
    setSelectedItem(item);
    setShowModal(true);

    // Fetch sellers if needed (status is Pending/In Review and no seller assigned)
    if ((item.status === 'Pendiente' || item.status === 'En revisión') && !item.vendedor) {
      const sellersData = await getSellersWithNumClients(navigate);
      if (sellersData) {
        console.log("sellersData", sellersData);
        setSellers(sellersData);
      }
    }
  };

  const handleAssignSeller = async (seller) => {
    if (!selectedItem) return;

    // 1. Assign seller to client
    const clientData = {
      userId: selectedItem.cliente._id,
      sellerId: seller._id
    };
    await setSellerToClient(clientData, navigate);

    // 2. Assign seller to pricing
    const pricingData = {
      pricingId: selectedItem._id,
      sellerId: seller._id
    };
    const updatedPricing = await setSellerToPricing(pricingData, navigate);

    if (updatedPricing) {
      // Update local state
      const updatedItem = { ...selectedItem, vendedor: { id: seller._id, nombre: seller.nombre, fotoPerfil: seller.fotoPerfil } };
      setSelectedItem(updatedItem);

      const updatedPricings = pricingsData.map(p =>
        p._id === selectedItem._id ? updatedItem : p
      );
      setPricings(updatedPricings);
    }
  };


  const getPricingsData = async () => {
    const response = await getPricings(navigate);
    if (response) {
      setPricings(response);
    }
  };
  useEffect(() => {
    getPricingsData();
  }, []);

  useEffect(() => {
    // Solo se intenta  abrir si tenemos un ID en la URL y ya hay datos cargados
    if (pricingIdFromUrl && pricingsData.length > 0) {
      const foundPricing = pricingsData.find(p => p._id === pricingIdFromUrl);

      if (foundPricing) {
        handleShow(foundPricing); // Reutilizamos tu función handleShow para abrir el modal y cargar la data
      }
    }

    console.log("pricingsData", pricingsData);
    console.log("clientIdFromUrl", clientIdFromUrl);

    if (clientIdFromUrl && clientIdFromUrl !== "undefined" && pricingsData.length > 0) {
      //Show pricings of client
      console.log("clientIdFromUrl into if", clientIdFromUrl);
      const filtered = pricingsData.filter(p => p.cliente?._id === clientIdFromUrl);

      if (filtered.length > 0) {
        setPricingsOfClient(filtered);
      } else {
        // Only notify if we have data but no matches for this client
        // This prevents the error on initial load when pricingsData might be empty
        notifyError('No se encontraron cotizaciones para este cliente.\n Mostrando todas las cotizaciones.');
      }
    }
  }, [pricingIdFromUrl, clientIdFromUrl, pricingsData]);



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
            {(pricingsOfClient.length > 0 ? pricingsOfClient : pricingsData).map((pricing, index) => (
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
                            <span className={`badge ${selectedItem.status === 'Aprobada' ? 'bg-success' : selectedItem.status === 'Rechazada' ? 'bg-danger' : 'bg-warning'}`}>{selectedItem.vendedor ? selectedItem.status : 'Por asignar'}</span>
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
                          <div className="d-flex align-items-center p-2 border rounded h-100">
                            {selectedItem.vendedor ? (
                              <>
                                <img src={selectedItem.vendedor.fotoPerfil} alt="Seller" className="rounded-circle me-3" width="50" height="50" />
                                <div>
                                  <small className="text-muted d-block">Vendedor</small>
                                  <span className="fw-bold">{selectedItem.vendedor.nombre}</span>
                                </div>
                              </>
                            ) : (
                              <div className="w-100">
                                <div className="d-flex align-items-center mb-2">
                                  <div className="bg-secondary rounded-circle me-3 d-flex align-items-center justify-content-center text-white" style={{ width: 50, height: 50 }}>?</div>
                                  <div>
                                    <small className="text-muted d-block">Vendedor</small>
                                    <span className="fw-bold fst-italic">Por asignar</span>
                                  </div>
                                </div>

                                {(selectedItem.status === 'Pendiente' || selectedItem.status === 'En revisión') && (
                                  <div className="mt-2">
                                    <p className="mb-2 small fw-bold">Asignar Vendedor:</p>
                                    <div className="list-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                      {(showAllSellers ? sellers : sellers.slice(0, 10)).map(seller => (
                                        <button
                                          key={seller._id}
                                          type="button"
                                          className="list-group-item list-group-item-action d-flex align-items-center p-2"
                                          onClick={() => handleAssignSeller(seller)}
                                        >
                                          <img src={seller.fotoPerfil} alt={seller.nombre} className="rounded-circle me-2" width="30" height="30" />
                                          <span className="small">{seller.nombre}</span>
                                        </button>
                                      ))}
                                    </div>
                                    {sellers.length > 10 && (
                                      <button
                                        className="btn btn-link btn-sm p-0 mt-1"
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
