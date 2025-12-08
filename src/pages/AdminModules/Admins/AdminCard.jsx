import React from 'react';
import { Card } from 'react-bootstrap';
import { Calendar, User } from 'lucide-react';

const AdminCard = ({ user }) => {
    // Obtener inicial para el avatar
    const initial = user.nombre ? user.nombre.charAt(0).toUpperCase() : 'A';

    // Formatear fecha de creación
    const createdDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'Fecha no disponible';

    return (
        <Card className="h-100 shadow-sm border-0" style={{
            background: 'var(--card-bg, #fff)',
            transition: 'transform 0.2s ease-in-out'
        }}>
            <Card.Body>
                <div className="d-flex align-items-center mb-3">
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm"
                        style={{
                            width: '50px',
                            height: '50px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            color: 'white',
                            fontSize: '1.25rem',
                            fontWeight: '600'
                        }}
                    >
                        {initial}
                    </div>
                    <div className="overflow-hidden">
                        <Card.Title className="mb-0 text-truncate" title={user.nombre} style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                            {user.nombre}
                        </Card.Title>
                        <Card.Text className="text-muted text-truncate small" title={user.email}>
                            {user.email}
                        </Card.Text>
                    </div>
                </div>

                <div className="pt-3 border-top mt-2">
                    <small className="text-muted d-flex align-items-center gap-2">
                        <Calendar size={14} />
                        <span>Registrado: {createdDate}</span>
                    </small>
                </div>
            </Card.Body>
        </Card>
    );
};

export default AdminCard;
