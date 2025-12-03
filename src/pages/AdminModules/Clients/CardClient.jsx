import React from "react";
import { Card } from "react-bootstrap";

const CardClient = ({ client, onClick }) => {
  return (
    <Card
      className="h-100 shadow-sm seller-card"
      style={{ cursor: "pointer", transition: "transform 0.2s" }}
      onClick={() => onClick(client)}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Card.Img
        variant="top"
        src={client.fotoPerfil}
        alt={client.nombre}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>{client.nombre}</Card.Title>
        <Card.Text className="text-muted">{client.email}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CardClient;
