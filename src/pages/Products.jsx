import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Form, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import api from "../services/api";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        marca: "",
        modelo: "",
        ano: "",
        precioBase: "",
        kilometraje: "",
        descripcion: "",
        condicion: "Nuevo",
        tipo: "",
        transmision: "",
        motor: "",
        color: "",
        numPuertas: "",
        vin: ""
    });
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/products/all");
            setProducts(data);
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    toast.error("No autorizado. Inicia sesión como administrador.");
                } else if (err.response.status === 403) {
                    toast.error("Acceso prohibido. No tienes permisos de administrador.");
                } else {
                    toast.error("Error al cargar productos: " + (err.response.data?.message || err.message));
                }
            } else {
                toast.error("Error de red al cargar productos");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post("/products", form);
            if (image) {
                const formData = new FormData();
                formData.append("file", image);
                await api.post(`/products/${data._id}/upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }
            toast.success("Producto creado");
            setShowModal(false);
            setForm({
                marca: "",
                modelo: "",
                ano: "",
                precioBase: "",
                kilometraje: "",
                descripcion: "",
                condicion: "Nuevo",
                tipo: "",
                transmision: "",
                motor: "",
                color: "",
                numPuertas: "",
                vin: ""
            });
            setImage(null);
            fetchProducts();
        } catch (err) {
            toast.error("Error al crear producto");
        }
    };

    return (
        <Container className="py-4">
            <Row className="mb-3">
                <Col>
                    <h2>Productos</h2>
                </Col>
                <Col className="text-end">
                    <Button onClick={() => setShowModal(true)}>Crear producto</Button>
                </Col>
            </Row>
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Row>
                    {products.map((p) => (
                        <Col md={4} key={p._id} className="mb-4">
                            <Card>
                                {p.imageUrl && (
                                    <Card.Img variant="top" src={p.imageUrl} style={{ height: 200, objectFit: "cover" }} />
                                )}
                                <Card.Body>
                                    <Card.Title>{p.marca} {p.modelo} ({p.ano})</Card.Title>
                                    <Card.Text>
                                        <strong>Precio:</strong> ${p.precioBase}<br />
                                        <strong>Kilometraje:</strong> {p.kilometraje} km<br />
                                        <strong>Condición:</strong> {p.condicion}<br />
                                        <strong>Tipo:</strong> {p.tipo}<br />
                                        <strong>Transmisión:</strong> {p.transmision}<br />
                                        <strong>Motor:</strong> {p.motor}<br />
                                        <strong>Color:</strong> {p.color}<br />
                                        <strong>Puertas:</strong> {p.numPuertas}<br />
                                        <strong>VIN:</strong> {p.vin}<br />
                                        <strong>Descripción:</strong> {p.descripcion}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear producto</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreate}>
                    <Modal.Body>
                        <Form.Group className="mb-2">
                            <Form.Label>Marca</Form.Label>
                            <Form.Control name="marca" value={form.marca} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Modelo</Form.Label>
                            <Form.Control name="modelo" value={form.modelo} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Año</Form.Label>
                            <Form.Control name="ano" value={form.ano} onChange={handleChange} required type="number" />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Precio Base</Form.Label>
                            <Form.Control name="precioBase" value={form.precioBase} onChange={handleChange} required type="number" />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Kilometraje</Form.Label>
                            <Form.Control name="kilometraje" value={form.kilometraje} onChange={handleChange} required type="number" />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control name="descripcion" value={form.descripcion} onChange={handleChange} as="textarea" />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Condición</Form.Label>
                            <Form.Select name="condicion" value={form.condicion} onChange={handleChange}>
                                <option>Nuevo</option>
                                <option>Usado</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control name="tipo" value={form.tipo} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Transmisión</Form.Label>
                            <Form.Control name="transmision" value={form.transmision} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Motor</Form.Label>
                            <Form.Control name="motor" value={form.motor} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Color</Form.Label>
                            <Form.Control name="color" value={form.color} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Número de puertas</Form.Label>
                            <Form.Control name="numPuertas" value={form.numPuertas} onChange={handleChange} type="number" />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>VIN</Form.Label>
                            <Form.Control name="vin" value={form.vin} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Imagen</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={uploading}>
                            {uploading ? "Subiendo..." : "Crear"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
