import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { Plus, ShieldCheck, UserPlus } from 'lucide-react';
import Sidebar from '../../../components/layout/Sidebar';
import AdminCard from './AdminCard';
import { getUsers, createAdmin } from '../../../api/users.api';
import { notifySuccess, notifyError } from '../../../components/shared/Alerts';

const Admins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        telefono: ''
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        const data = await getUsers();
        if (data) {
            // Filtrar solo usuarios con role "admin"
            // Nota: La API puede devolver "role" o "rol", verificamos ambos por seguridad
            const adminUsers = data.filter(user => user.role === 'admin' || user.rol === 'admin');
            setAdmins(adminUsers);
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación básica
        if (!formData.nombre || !formData.email || !formData.password || !formData.telefono) {
            notifyError('Por favor complete todos los campos obligatorios');
            return;
        }

        const success = await createAdmin(formData);

        if (success) {
            notifySuccess('Administrador creado existosamente');
            setShowModal(false);
            setFormData({ nombre: '', email: '', password: '', telefono: '' });
            fetchAdmins();
        } else {
            notifyError('Error al crear administrador');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ nombre: '', email: '', password: '', telefono: '' });
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-container">
                <Container fluid className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="display-6 fw-bold mb-2">
                                <ShieldCheck className="me-2 text-primary" size={32} />
                                Administradores
                            </h1>
                            <p className="text-muted">Gestión de usuarios con privilegios de administrador</p>
                        </div>
                        <Button
                            variant="primary"
                            className="d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
                            onClick={() => setShowModal(true)}
                        >
                            <Plus size={20} />
                            Nuevo Admin
                        </Button>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Cargando administradores...</p>
                        </div>
                    ) : (
                        <>
                            {admins.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="mb-3 text-muted opacity-50">
                                        <ShieldCheck size={64} />
                                    </div>
                                    <h4>No hay administradores registrados</h4>
                                    <p className="text-muted">Utiliza el botón "Nuevo Admin" para agregar uno.</p>
                                </div>
                            ) : (
                                <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                                    {admins.map(admin => (
                                        <Col key={admin._id || admin.uid || Math.random()}>
                                            <AdminCard user={admin} />
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </>
                    )}

                    {/* Modal de Creación */}
                    <Modal show={showModal} onHide={handleCloseModal} centered>
                        <Modal.Header closeButton className="border-0 pb-0">
                            <Modal.Title className="fw-bold">
                                <UserPlus className="me-2 text-primary" size={24} />
                                Nuevo Administrador
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="pt-4">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre Completo *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        placeholder="Ej. Juan Pérez"
                                        autoFocus
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Correo Electrónico *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="correo@ejemplo.com"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Contraseña *</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        placeholder="Obligatorio"
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-end gap-2">
                                    <Button variant="light" onClick={handleCloseModal}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        Crear Administrador
                                    </Button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </Container>
            </div>
        </div>
    );
};

export default Admins;
