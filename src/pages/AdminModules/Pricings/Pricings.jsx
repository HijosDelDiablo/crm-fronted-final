import React, { useEffect, useState } from "react";
import Pricing from "./Pricing";
import { Modal, Button } from "react-bootstrap";
import "./Pricings.css";

// 👉 Usamos la Sidebar igual que en Dashboard
import Sidebar from "../../../components/layout/Sidebar";

import { getPricings } from "../../../api/pricings.api";
import {
  getSellersWithNumClients,
  setSellerToClient,
  setSellerToPricing,
} from "../../../api/sellers.api";

import { useNavigate, useSearchParams } from "react-router-dom";
import { notifyError } from "../../../components/shared/Alerts";

export default function Pricings() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const pricingIdFromUrl = searchParams.get("idPricing");
  const clientIdFromUrl = searchParams.get("idClient");

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

    if (
      (item.status === "Pendiente" || item.status === "En revisión") &&
      !item.vendedor
    ) {
      const sellersData = await getSellersWithNumClients(navigate);
      if (sellersData) {
        setSellers(sellersData);
      }
    }
  };

  const handleAssignSeller = async (seller) => {
    if (!selectedItem) return;

    await setSellerToClient(
      { userId: selectedItem.cliente._id, sellerId: seller._id },
      navigate
    );

    const updatedPricing = await setSellerToPricing(
      { pricingId: selectedItem._id, sellerId: seller._id },
      navigate
    );

    if (updatedPricing) {
      const updatedItem = {
        ...selectedItem,
        vendedor: {
          id: seller._id,
          nombre: seller.nombre,
          fotoPerfil: seller.fotoPerfil,
        },
      };

      setSelectedItem(updatedItem);
      setPricings((prev) =>
        prev.map((p) => (p._id === selectedItem._id ? updatedItem : p))
      );
    }
  };

  const getPricingsData = async () => {
    const response = await getPricings(navigate);
    if (response) setPricings(response);
  };

  useEffect(() => {
    getPricingsData();
  }, []);

  useEffect(() => {
    if (pricingIdFromUrl && pricingsData.length > 0) {
      const foundPricing = pricingsData.find(p => p._id === pricingIdFromUrl);

      if (foundPricing) {
        handleShow(foundPricing); // Reutilizamos tu función handleShow para abrir el modal y cargar la data
      }
    }

    if (clientIdFromUrl && clientIdFromUrl !== "undefined" && pricingsData.length > 0) {
      //Show pricings of client
      const filtered = pricingsData.filter(p => p.cliente?._id === clientIdFromUrl);

      if (filtered.length > 0) {
        setPricingsOfClient(filtered);
      } else if (pricingsData.length > 0) {
        notifyError("No se encontraron cotizaciones para este cliente.");
      }
    }
  }, [pricingIdFromUrl, clientIdFromUrl, pricingsData]);

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleString() : "N/A";

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);

  return (
    <div className="dashboard-layout">
      {/* 👉 Sidebar funcionando */}
      <Sidebar />

      {/* 👉 Contenedor general al estilo Dashboard */}
      <div className="dashboard-container">
        <div className="pricings-container">
          <div className="container">
            <h1 className="pricings-title">Cotizaciones Recientes</h1>

            <div className="row g-4">
              {(pricingsOfClient.length > 0
                ? pricingsOfClient
                : pricingsData
              ).map((pricing, index) => (
                <div className="col-12 col-md-6 col-lg-6 col-xl-4" key={index}>
                  <Pricing
                    pricing={pricing}
                    onClick={() => handleShow(pricing)}
                  />
                </div>
              ))}
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={handleClose} size="xl" centered>
              <Modal.Header closeButton>
                <Modal.Title>Detalles de la Cotización</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {selectedItem && (
                  <div className="container-fluid">
                    <div className="row">
                      {/* Car Details */}
                      <div className="col-md-6">
                        <h5 className="pricing-modal-section-title">Información del Coche</h5>
                        {selectedItem.coche ? (
                          <div>
                            <div className="pricing-detail-row">
                              <span className="pricing-detail-label">Marca:</span>
                              <span className="pricing-detail-value">{selectedItem.coche.marca}</span>
                            </div>
                            <div className="pricing-detail-row">
                              <span className="pricing-detail-label">Modelo:</span>
                              <span className="pricing-detail-value">{selectedItem.coche.modelo}</span>
                            </div>
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
                              <span className="pricing-detail-label">Precio:</span>
                              <span className="pricing-detail-value">{formatCurrency(selectedItem.precioCoche)}</span>
                            </div>
                            {selectedItem.coche.imageUrl && (
                              <img src={selectedItem.coche.imageUrl} alt="Coche" className="pricing-modal-img mt-3" />
                            )}
                          </div>
                        ) : (
                          <p className="text-muted">Información del coche no disponible</p>
                        )}
                      </div>

                      {/* Client Details */}
                      <div className="col-md-6">
                        <h5 className="pricing-modal-section-title">Información del Cliente</h5>
                        {selectedItem.cliente ? (
                          <div>
                            <div className="pricing-detail-row">
                              <span className="pricing-detail-label">Nombre:</span>
                              <span className="pricing-detail-value">{selectedItem.cliente.nombre}</span>
                            </div>
                            <div className="pricing-detail-row">
                              <span className="pricing-detail-label">Email:</span>
                              <span className="pricing-detail-value">{selectedItem.cliente.email || 'N/A'}</span>
                            </div>
                            <div className="pricing-detail-row">
                              <span className="pricing-detail-label">Teléfono:</span>
                              <span className="pricing-detail-value">{selectedItem.cliente.telefono || 'N/A'}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted">Información del cliente no disponible</p>
                        )}

                        <h5 className="pricing-modal-section-title">Información del Vendedor</h5>
                        {selectedItem.vendedor ? (
                          <div>
                            <div className="pricing-detail-row">
                              <span className="pricing-detail-label">Nombre:</span>
                              <span className="pricing-detail-value">{selectedItem.vendedor.nombre}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted">Vendedor no asignado</p>
                        )}
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-12">
                        <h5 className="pricing-modal-section-title">Detalles de la Cotización</h5>
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">ID:</span>
                          <span className="pricing-detail-value">{selectedItem._id}</span>
                        </div>
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Status:</span>
                          <span className="pricing-detail-value">{selectedItem.status}</span>
                        </div>
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Enganche:</span>
                          <span className="pricing-detail-value">{formatCurrency(selectedItem.enganche)}</span>
                        </div>
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Plazo (meses):</span>
                          <span className="pricing-detail-value">{selectedItem.plazoMeses}</span>
                        </div>
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Fecha de Creación:</span>
                          <span className="pricing-detail-value">{formatDate(selectedItem.fechaCreacion)}</span>
                        </div>
                        <div className="pricing-detail-row">
                          <span className="pricing-detail-label">Notas del Vendedor:</span>
                          <span className="pricing-detail-value">{selectedItem.notasVendedor || 'Sin notas'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Assign Seller Section */}
                    {(selectedItem.status === "Pendiente" || selectedItem.status === "En revisión") && !selectedItem.vendedor && (
                      <div className="row mt-3">
                        <div className="col-12">
                          <h5 className="pricing-modal-section-title">Asignar Vendedor</h5>
                          <div className="d-flex flex-wrap gap-2">
                            {sellers.slice(0, showAllSellers ? sellers.length : 3).map((seller) => (
                              <Button
                                key={seller._id}
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleAssignSeller(seller)}
                              >
                                {seller.nombre}
                              </Button>
                            ))}
                            {sellers.length > 3 && (
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => setShowAllSellers(!showAllSellers)}
                              >
                                {showAllSellers ? "Mostrar menos" : "Mostrar más"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
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
      </div>
    </div>
  );
}
