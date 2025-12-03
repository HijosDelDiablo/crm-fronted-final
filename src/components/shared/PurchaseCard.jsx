import React from 'react';
import { Card, Button } from 'react-bootstrap';
import StatusBadge from './StatusBadge';

const PurchaseCard = ({ purchase, onViewDetail }) => {
    const { _id, coche, estado, saldoPendiente, fechaCreacion } = purchase;

    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h6 className="mb-1">
                            {coche?.marca} {coche?.modelo}
                        </h6>
                        <small className="text-muted">
                            ID: {_id} | Creado: {new Date(fechaCreacion).toLocaleDateString('es-ES')}
                        </small>
                    </div>
                    <StatusBadge status={estado} />
                </div>
                <p className="mb-2">
                    <strong>Saldo pendiente:</strong> ${saldoPendiente?.toLocaleString('es-ES') || 'N/A'}
                </p>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onViewDetail(_id)}
                >
                    Ver Detalle
                </Button>
            </Card.Body>
        </Card>
    );
};

export default PurchaseCard;