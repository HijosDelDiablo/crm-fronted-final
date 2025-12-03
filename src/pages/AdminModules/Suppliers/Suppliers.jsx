import { useEffect, useState, useRef } from "react";
import { Spinner, Form, Modal, Button, Badge } from "react-bootstrap";
import toast from "react-hot-toast";
import api from "../../../services/api.js";
import Sidebar from "../../../components/layout/Sidebar.jsx";
import "../../../pages/suppliers.css";
import "../../../pages/suppliers-form.css";
import { useNavigate } from "react-router-dom";

export default function Suppliers() {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [form, setForm] = useState({
        nombre: "",
        contacto: "",
        telefono: "",
        email: "",
        direccion: "",
        rfc: "",
        notas: "",
        productosSuministrados: []
    });
    const [formError, setFormError] = useState("");
    const nombreInputRef = useRef(null);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/proveedores");
            console.log('status', data.status);
            if (data.status == 401) navigate('/login');
            setSuppliers(data);
        } catch (err) {
            toast.error("Error al cargar proveedores: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este proveedor?")) return;
        try {
            await api.delete(`/proveedores/${id}`);
            toast.success("Proveedor eliminado");
            setSuppliers((prev) => prev.filter((s) => s._id !== id));
        } catch (err) {
            toast.error("Error al eliminar: " + (err.response?.data?.message || err.message));
        }
    };

    const handleToggleActive = async (id) => {
        try {
            await api.patch(`/proveedores/${id}/toggle-active`);
            toast.success("Estado actualizado");
            fetchSuppliers(); // Refresh list
        } catch (err) {
            toast.error("Error al actualizar estado: " + (err.response?.data?.message || err.message));
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError("");
        try {
            if (editingSupplier) {
                await api.patch(`/proveedores/${editingSupplier._id}`, form);
                toast.success("Proveedor actualizado");
            } else {
                await api.post("/proveedores", form);
                toast.success("Proveedor creado");
            }
            setShowModal(false);
            setEditingSupplier(null);
            setForm({
                nombre: "",
                contacto: "",
                telefono: "",
                email: "",
                direccion: "",
                rfc: "",
                notas: "",
                productosSuministrados: []
            });
            fetchSuppliers();
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setFormError(msg);
            toast.error("Error: " + msg);
        }
    };

    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
        setForm({
            nombre: supplier.nombre || "",
            contacto: supplier.contacto || "",
            telefono: supplier.telefono || "",
            email: supplier.email || "",
            direccion: supplier.direccion || "",
            rfc: supplier.rfc || "",
            notas: supplier.notas || "",
            productosSuministrados: supplier.productosSuministrados || []
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingSupplier(null);
        setForm({
            nombre: "",
            contacto: "",
            telefono: "",
            email: "",
            direccion: "",
            rfc: "",
            notas: "",
            productosSuministrados: []
        });
        setFormError("");
    };

    useEffect(() => {
        if (showModal && nombreInputRef.current) {
            setTimeout(() => nombreInputRef.current.focus(), 200);
        }
    }, [showModal]);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-container">
                <div className="suppliers-container">
                    <div className="suppliers-header">
                        <h2 className="pricings-title">Proveedores</h2>
                        <button
                            className="suppliers-create-btn"
                            onClick={() => setShowModal(true)}
                        >
                            Crear proveedor
                        </button>
                    </div>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0' }}>
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <div className="suppliers-grid">
                            {suppliers.map((s) => (
                                <div key={s._id} className="supplier-card">
                                    <div className="supplier-card-body">
                                        <div className="supplier-card-title">
                                            {s.nombre}
                                            <Badge className={s.activo ? "supplier-card-badge" : "supplier-card-badge-inactive"}>{s.activo ? "Activo" : "Inactivo"}</Badge>
                                        </div>
                                        <div className="supplier-card-details">
                                            <span><b>Contacto:</b> {s.contacto}</span>
                                            <span><b>Teléfono:</b> {s.telefono}</span>
                                            <span><b>Email:</b> {s.email}</span>
                                            <span><b>RFC:</b> {s.rfc}</span>
                                            <span><b>Dirección:</b> {s.direccion}</span>
                                        </div>
                                        <div className="supplier-card-desc">{s.notas}</div>
                                        <div className="supplier-card-actions">
                                            <button className="supplier-btn-edit" onClick={() => handleEdit(s)}>Editar</button>
                                            <button className="supplier-btn-toggle" onClick={() => handleToggleActive(s._id)}>
                                                {s.activo ? "Desactivar" : "Activar"}
                                            </button>
                                            <button className="supplier-btn-delete" onClick={() => handleDelete(s._id)}>Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <Modal show={showModal} onHide={handleCloseModal} size="lg">
                        <Modal.Header closeButton className="suppliers-modal-header">
                            <Modal.Title>{editingSupplier ? "Editar proveedor" : "Crear proveedor"}</Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={handleCreate}>
                            <Modal.Body className="suppliers-modal-body">
                                {formError && (
                                    <div className="suppliers-form-error">{formError}</div>
                                )}
                                <div className="mb-6 flex flex-col gap-2">
                                    <h3 className="suppliers-form-title">Datos del proveedor</h3>
                                    <p className="suppliers-form-subtitle">Completa la información del proveedor.</p>
                                </div>
                                <div className="suppliers-form-grid">
                                    <div className="flex flex-col gap-4">
                                        <Form.Group className="suppliers-form-group">
                                            <Form.Label className="suppliers-form-label">Nombre *</Form.Label>
                                            <Form.Control name="nombre" value={form.nombre} onChange={handleChange} required ref={nombreInputRef} autoFocus className="suppliers-form-input" />
                                        </Form.Group>
                                        <Form.Group className="suppliers-form-group">
                                            <Form.Label className="suppliers-form-label">Contacto</Form.Label>
                                            <Form.Control name="contacto" value={form.contacto} onChange={handleChange} className="suppliers-form-input" />
                                        </Form.Group>
                                        <Form.Group className="suppliers-form-group">
                                            <Form.Label className="suppliers-form-label">Teléfono</Form.Label>
                                            <Form.Control name="telefono" value={form.telefono} onChange={handleChange} className="suppliers-form-input" />
                                        </Form.Group>
                                        <Form.Group className="suppliers-form-group">
                                            <Form.Label className="suppliers-form-label">Email</Form.Label>
                                            <Form.Control name="email" value={form.email} onChange={handleChange} type="email" className="suppliers-form-input" />
                                        </Form.Group>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <Form.Group className="suppliers-form-group">
                                            <Form.Label className="suppliers-form-label">Dirección</Form.Label>
                                            <Form.Control name="direccion" value={form.direccion} onChange={handleChange} className="suppliers-form-input" />
                                        </Form.Group>
                                        <Form.Group className="suppliers-form-group">
                                            <Form.Label className="suppliers-form-label">RFC</Form.Label>
                                            <Form.Control name="rfc" value={form.rfc} onChange={handleChange} className="suppliers-form-input" />
                                        </Form.Group>
                                        <Form.Group className="suppliers-form-group">
                                            <Form.Label className="suppliers-form-label">Notas</Form.Label>
                                            <Form.Control name="notas" value={form.notas} onChange={handleChange} as="textarea" className="suppliers-form-textarea" />
                                        </Form.Group>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="suppliers-modal-footer">
                                <button type="button" className="suppliers-btn-cancel" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="suppliers-btn-submit">
                                    {editingSupplier ? "Actualizar" : "Crear"}
                                </button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                </div>
            </div>
        </div>
    );
}