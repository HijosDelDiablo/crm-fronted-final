import React from 'react';
import { useParams } from 'react-router-dom';
import NavbarTop from '../../../components/layout/Navbar';
import { Container } from 'react-bootstrap';

const SellerReview = () => {
    const { id } = useParams();
    return (
        <>
            <NavbarTop />
            <Container className="mt-4">
                <h1>Reseñas del Vendedor</h1>
                <p>Mostrando reseñas para el vendedor ID: {id}</p>
                {/* Future implementation */}
            </Container>
        </>
    );
};

export default SellerReview;
