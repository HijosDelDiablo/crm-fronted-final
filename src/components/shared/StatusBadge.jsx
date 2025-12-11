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
            case 'cancelada':
                return 'danger';
            case 'registrado':
                return 'secondary';
            default:
                return 'light';
        }
    };

    const getShortStatus = (status) => {
        switch (status?.toLowerCase()) {
            case 'pendiente':
                return 'Pend.';
            case 'en revisión':
            case 'en revision':
                return 'En Rev.';
            case 'aprobada':
                return 'Aprob.';
            case 'completada':
                return 'Compl.';
            case 'rechazada':
                return 'Rech.';
            case 'registrado':
                return 'Reg.';
            default:
                return status || 'Desconocido';
        }
    };

    return (
        <Badge bg={getVariant(status)} className="text-capitalize status-badge-full">
            <span className="status-text-full">{status || 'Desconocido'}</span>
            <span className="status-text-short">{getShortStatus(status)}</span>
        </Badge>
    );
};

export default StatusBadge;