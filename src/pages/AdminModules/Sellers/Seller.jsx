import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Star } from 'lucide-react';

const Seller = ({ seller, onClick }) => {
    return (
        <Card
            className="h-100 shadow-sm seller-card"
            style={{ cursor: 'pointer' }}
            onClick={() => onClick(seller)}
        >
            <Card.Img
                variant="top"
                src={seller.fotoPerfil}
                alt={seller.nombre}
                style={{ height: '200px', objectFit: 'cover' }}
            />
            <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                    {seller.nombre}
                    <Badge bg="warning" text="dark" className="d-flex align-items-center gap-1">
                        {seller.promedioEstrellas?.toFixed(1) || 0} <Star size={14} fill="currentColor" />
                    </Badge>
                </Card.Title>
                <Card.Text className="text-muted">
                    {seller.email}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default Seller;
