import React from 'react';
import { Card, Button } from 'react-bootstrap';
import StatusBadge from './StatusBadge';

const PurchaseCard = ({ purchase, onViewDetail }) => {
    const {
        _id,
        status, // Cambiado de 'estado' a 'status'
        saldoPendiente,
        createdAt,
        montoTotalCredito,
        totalPagado,
        vendedor,
        cotizacion // Información de la cotización
    } = purchase;

    // Debug logging
    console.log('🔍 PurchaseCard - Status recibido:', status);
    console.log('🔍 PurchaseCard - Cotización:', cotizacion);
    console.log('🔍 PurchaseCard - Purchase completo:', purchase);

    // Función para obtener el nombre del coche
    const getCarName = () => {
        if (!cotizacion?.coche) return 'Vehículo no especificado';

        // Si coche es un string (ID), mostrar ID
        if (typeof cotizacion.coche === 'string') {
            return `Vehículo ID: ${cotizacion.coche}`;
        }

        // Si coche es un objeto con marca y modelo
        if (cotizacion.coche.marca && cotizacion.coche.modelo) {
            return `${cotizacion.coche.marca} ${cotizacion.coche.modelo}`;
        }

        // Si tiene otras propiedades
        if (cotizacion.coche.nombre) return cotizacion.coche.nombre;
        if (cotizacion.coche.modelo) return cotizacion.coche.modelo;

        return 'Vehículo';
    };

    return (
        <Card className="purchase-card">
            <Card.Body className="purchase-card-body">
                <div className="purchase-card-header">
                    <div>
                        <h5 className="purchase-card-title">
                            {getCarName()}
                        </h5>
                        <div className="purchase-card-info">
                            ID: {_id}
                        </div>
                        <div className="purchase-card-info">
                            Creado: {new Date(createdAt).toLocaleDateString('es-ES')}
                        </div>
                    </div>
                    <div className="status-badge-container">
                        <StatusBadge status={status} />
                    </div>
                </div>

                <div className="purchase-card-details">
                    <div className="purchase-card-detail">
                        <span className="purchase-card-label">Saldo Pendiente</span>
                        <span className="purchase-card-value">
                            ${saldoPendiente?.toLocaleString('es-ES') || 'N/A'}
                        </span>
                    </div>
                    {montoTotalCredito && (
                        <div className="purchase-card-detail">
                            <span className="purchase-card-label">Monto Total Crédito</span>
                            <span className="purchase-card-value">
                                ${montoTotalCredito?.toLocaleString('es-ES')}
                            </span>
                        </div>
                    )}
                    {totalPagado && (
                        <div className="purchase-card-detail">
                            <span className="purchase-card-label">Total Pagado</span>
                            <span className="purchase-card-value">
                                ${totalPagado?.toLocaleString('es-ES')}
                            </span>
                        </div>
                    )}
                    {vendedor && (
                        <div className="purchase-card-detail">
                            <span className="purchase-card-label">Vendedor</span>
                            <span className="purchase-card-value">
                                {vendedor.nombre || vendedor.email}
                            </span>
                        </div>
                    )}
                </div>

                <Button
                    className="btn-view-detail"
                    onClick={() => onViewDetail(_id)}
                >
                    Ver Detalle
                </Button>
            </Card.Body>
        </Card>
    );
};

export default PurchaseCard;