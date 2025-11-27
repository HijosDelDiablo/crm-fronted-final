import React from 'react';
import './Pricing.css';

const Pricing = ({ data, onClick }) => {
  const { product, pricing, seller, client } = data;

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
          src={product.imageUrl} 
          alt={`${product.marca} ${product.modelo}`} 
          className="pricing-card-img"
        />
        <span className={`pricing-status-badge ${pricing.status === 'Aprobada' ? 'bg-success' : pricing.status === 'Rechazada' ? 'bg-danger' : 'bg-warning'}`}>
          {pricing.status}
        </span>
      </div>

      {/* Card Content Section */}
      <div className="pricing-card-body">
        <div>
          <h5 className="card-title mb-1">
            <a href={`/cars/${product._id?.$oid}`} onClick={(e) => e.stopPropagation()} className="text-decoration-none text-dark fw-bold">
              {product.marca} {product.modelo}
            </a>
          </h5>
          <p className="text-muted small mb-2">{product.ano}</p>

          <div className="row g-1 small text-secondary">
            <div className="col-6">
              <span className="fw-bold">Condición:</span> {product.condicion}
            </div>
            <div className="col-6">
              <span className="fw-bold">Transmisión:</span> {product.transmision}
            </div>
            <div className="col-12 mt-1">
              <span className="fw-bold">Fecha:</span> {formatDate(pricing.fechaCreacion)}
            </div>
          </div>
        </div>

        {/* Footer - Client & Seller */}
        <div className="pricing-footer">
          {/* Client (Left) */}
          <div className="pricing-user-info">
            <img 
              src={client.image} 
              alt={client.name} 
              className="pricing-user-img"
            />
            <div className="pricing-user-details">
              <span className="pricing-user-role">Cliente</span>
              <a href={`/clients/${client.id}`} className="pricing-user-name" onClick={(e) => e.stopPropagation()}>
                {client.name}
              </a>
            </div>
          </div>

          {/* Seller (Right) */}
          <div className="pricing-user-info seller justify-content-end">
             <div className="pricing-user-details text-end me-2">
              <span className="pricing-user-role">Vendedor</span>
              <a href={`/sellers/${seller.id}`} className="pricing-user-name" onClick={(e) => e.stopPropagation()}>
                {seller.name}
              </a>
            </div>
            <img 
              src={seller.image} 
              alt={seller.name} 
              className="pricing-user-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
