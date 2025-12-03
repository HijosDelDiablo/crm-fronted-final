import React from 'react';
import { Badge } from 'react-bootstrap';

const StatusBadge = ({ status }) => {
    const getVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'pendiente':
                return 'warning';
            case 'en revisión':
            case 'en revision':
                return 'info';
            case 'aprobada':
                return 'success';
            case 'completada':
                return 'primary';
            case 'rechazada':
                return 'danger';
            case 'registrado':
                return 'secondary';
            default:
                return 'light';
        }
    };

    return (
        <Badge bg={getVariant(status)} className="text-capitalize">
            {status || 'Desconocido'}
        </Badge>
    );
};

export default StatusBadge;