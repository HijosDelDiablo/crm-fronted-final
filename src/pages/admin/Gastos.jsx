import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createGasto, getGastos, getTotalGastos } from '../../api/gastos.api';
import Sidebar from '../../components/layout/Sidebar';

const Gastos = () => {
    const [gastos, setGastos] = useState([]);
    const [totalGastos, setTotalGastos] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        concepto: '',
        monto: '',
        categoria: 'Servicios',
        fechaGasto: new Date().toISOString().split('T')[0]
    });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [gastosData, totalData] = await Promise.all([
                getGastos(navigate),
                getTotalGastos(navigate)
            ]);
            setGastos(gastosData || []);
            setTotalGastos(totalData?.total || 0);
        } catch (err) {
            setError('Error al cargar los gastos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createGasto({
                ...form,
                monto: parseFloat(form.monto)
            }, navigate);
            
            setForm({
                concepto: '',
                monto: '',
                categoria: 'Servicios',
                fechaGasto: new Date().toISOString().split('T')[0]
            });
            alert('Gasto registrado correctamente');
            fetchData();
        } catch (err) {
            alert('Error al registrar el gasto');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-container">
                <Container className="mt-4">
                    <h2>Gestión de Gastos</h2>
                    
                    <Row className="mb-4">
                        <Col md={4}>
                            <Card className="admin-card">
                                <Card.Header><h5>Registrar Nuevo Gasto</h5></Card.Header>
                                <Card.Body>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Concepto</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                required 
                                                value={form.concepto}
                                                onChange={e => setForm({...form, concepto: e.target.value})}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Monto</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                step="0.01" 
                                                required 
                                                value={form.monto}
                                                onChange={e => setForm({...form, monto: e.target.value})}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Categoría</Form.Label>
                                            <Form.Select 
                                                value={form.categoria}
                                                onChange={e => setForm({...form, categoria: e.target.value})}
                                            >
                                                <option value="Servicios">Servicios</option>
                                                <option value="Mantenimiento">Mantenimiento</option>
                                                <option value="Nómina">Nómina</option>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Otros">Otros</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Fecha</Form.Label>
                                            <Form.Control 
                                                type="date" 
                                                required 
                                                value={form.fechaGasto}
                                                onChange={e => setForm({...form, fechaGasto: e.target.value})}
                                            />
                                        </Form.Group>
                                        <Button variant="primary" type="submit" disabled={submitting} className="w-100">
                                            {submitting ? 'Registrando...' : 'Registrar Gasto'}
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={8}>
                            <Card className="admin-card mb-3">
                                <Card.Body>
                                    <h4>Total Gastos: ${totalGastos.toLocaleString('es-MX')}</h4>
                                </Card.Body>
                            </Card>

                            <Card className="admin-card">
                                <Card.Header><h5>Historial de Gastos</h5></Card.Header>
                                <Card.Body>
                                    {loading ? (
                                        <div className="text-center"><Spinner animation="border" /></div>
                                    ) : (
                                        <Table striped bordered hover responsive className="table-dark">
                                            <thead>
                                                <tr>
                                                    <th>Fecha</th>
                                                    <th>Concepto</th>
                                                    <th>Categoría</th>
                                                    <th>Monto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {gastos.length === 0 ? (
                                                    <tr><td colSpan="4" className="text-center">No hay gastos registrados</td></tr>
                                                ) : (
                                                    gastos.map((gasto, idx) => (
                                                        <tr key={gasto._id || idx}>
                                                            <td>{new Date(gasto.fechaGasto).toLocaleDateString('es-ES')}</td>
                                                            <td>{gasto.concepto}</td>
                                                            <td>{gasto.categoria}</td>
                                                            <td>${gasto.monto.toLocaleString('es-MX')}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </Table>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Gastos;
