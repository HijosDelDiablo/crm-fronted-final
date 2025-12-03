import React from 'react';
import './Pricing.css';

const Pricing = ({ pricing, onClick }) => {
  if (!pricing) return null;
  const { coche, vendedor, cliente } = pricing;

  // Allow rendering even if coche or cliente is null, show placeholders
  // if (!coche || !cliente) {
  //   console.warn('Incomplete pricing data:', pricing);
  //   return null;
  // }

  // Format date
  const formatDate = (dateObj) => {
    if (!dateObj || !dateObj.$date) return '';
    return new Date(dateObj.$date).toLocaleDateString();
  };

  return (
    <div className="pricing-card pricing-card-horizontal" onClick={onClick}>
      {/* Product Image Section */}
      <div className="pricing-card-img-container">
        <img
          src={coche ? coche.imageUrl : "https://via.placeholder.com/300x200?text=Coche+No+Disponible"}
          alt={coche ? `${coche.marca} ${coche.modelo}` : "Coche no disponible"}
          className="pricing-card-img"
        />
        <span className={`pricing-status-badge ${pricing.status === 'Completada' ? 'bg-completed' : pricing.status === 'Aprobada' ? 'bg-success' : pricing.status === 'Rechazada' ? 'bg-danger' : 'bg-warning'}`}>
          {pricing.status}
        </span>
      </div>

      {/* Card Content Section */}
      <div className="pricing-card-body">
        <div>
          <h5 className="card-title mb-1">
            {coche ? (
              <a href={`/cars/${coche._id?.$oid}`} onClick={(e) => e.stopPropagation()} className="text-decoration-none fw-bold">
                {coche.marca} {coche.modelo}
              </a>
            ) : (
              <span className="card-text fw-bold">Coche no disponible</span>
            )}
          </h5>
          <p className="card-text small mb-2">{coche ? coche.ano : 'N/A'}</p>

          <div className="row g-1 small text-secondary">
            <div className="col-6">
              <span className="card-text">Condición:</span> {coche ? coche.condicion : 'N/A'}
            </div>
            <div className="col-6">
              <span className="card-text">Transmisión:</span> {coche ? coche.transmision : 'N/A'}
            </div>
            <div className="col-12 mt-1">
              <span className="card-text">Fecha:</span> {formatDate(pricing.fechaCreacion)}
            </div>
          </div>
        </div>

        {/* Footer - Client & Seller */}
        <div className="pricing-footer">
          {/* Client (Left) */}
          <div className="pricing-user-info">
            <img
              src={cliente ? cliente.fotoPerfil : "https://ui-avatars.com/api/?name=NA&background=random"}
              alt={cliente ? cliente.nombre : "Cliente no disponible"}
              className="pricing-user-img"
            />
            <div className="pricing-user-details">
              <span className="pricing-user-role">Cliente</span>
              {cliente ? (
                <a href={`/clientes/${cliente.id}`} className="pricing-user-name" onClick={(e) => e.stopPropagation()}>
                  {cliente.nombre}
                </a>
              ) : (
                <span className="pricing-user-name text-muted fst-italic">Cliente no disponible</span>
              )}
            </div>
          </div>

          {/* Seller (Right) */}
          <div className="pricing-user-info seller justify-content-end">
            <div className="pricing-user-details text-end me-2">
              <span className="pricing-user-role">Vendedor</span>
              {vendedor ? (
                <a href={`/sellers/${vendedor.id}`} className="pricing-user-name" onClick={(e) => e.stopPropagation()}>
                  {vendedor.nombre}
                </a>
              ) : (
                <span className="pricing-user-name text-muted fst-italic">Por asignar</span>
              )}
            </div>
            <img
              src={vendedor ? vendedor.fotoPerfil : "https://ui-avatars.com/api/?name=NA&background=random"}
              alt={vendedor ? vendedor.nombre : "No asignado"}
              className="pricing-user-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
