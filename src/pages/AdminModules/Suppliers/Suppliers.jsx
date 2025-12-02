import { useEffect, useState, useRef } from "react";
import { Spinner, Form, Modal, Button, Badge } from "react-bootstrap";
import toast from "react-hot-toast";
import api from "../../../services/api.js";
import Sidebar from "../../../components/layout/Sidebar.jsx";

export default function Suppliers() {
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
                <div className="products-container">
                    <div className="products-header">
                        <h2 className="products-title">Proveedores</h2>
                        <button
                            className="btn btn-primary"
                            style={{ fontWeight: 600, fontSize: '1.1rem', padding: '0.7em 2em', borderRadius: '0.7em', boxShadow: '0 2px 8px 0 rgba(13,110,253,0.08)' }}
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
                        <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
                            {suppliers.map((s) => (
                                <div key={s._id} className="product-card">
                                    <div className="product-card-body">
                                        <div className="product-card-title">
                                            {s.nombre}
                                            <Badge bg={s.activo ? "success" : "secondary"}>{s.activo ? "Activo" : "Inactivo"}</Badge>
                                        </div>
                                        <div className="product-card-details">
                                            <span><b>Contacto:</b> {s.contacto}</span><br />
                                            <span><b>Teléfono:</b> {s.telefono}</span><br />
                                            <span><b>Email:</b> {s.email}</span><br />
                                            <span><b>RFC:</b> {s.rfc}</span><br />
                                            <span><b>Dirección:</b> {s.direccion}</span><br />
                                            <span><b>Productos:</b> {s.productosSuministrados?.length || 0}</span>
                                        </div>
                                        <div className="product-card-desc">{s.notas}</div>
                                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleEdit(s)}>Editar</Button>
                                            <Button variant={s.activo ? "outline-warning" : "outline-success"} size="sm" onClick={() => handleToggleActive(s._id)}>
                                                {s.activo ? "Desactivar" : "Activar"}
                                            </Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(s._id)}>Eliminar</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <Modal show={showModal} onHide={handleCloseModal} size="lg">
                        <Modal.Header closeButton className="!bg-blue-600 !text-white">
                            <Modal.Title>{editingSupplier ? "Editar proveedor" : "Crear proveedor"}</Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={handleCreate}>
                            <Modal.Body className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-b-2xl p-6">
                                {formError && (
                                    <div className="bg-red-100 text-red-700 rounded px-3 py-2 mb-3 text-sm shadow">{formError}</div>
                                )}
                                <div className="mb-6 flex flex-col gap-2">
                                    <h3 className="text-2xl font-extrabold text-blue-700 mb-1 tracking-tight">Datos del proveedor</h3>
                                    <p className="text-gray-500 text-sm">Completa la información del proveedor.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-4">
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Nombre *</Form.Label>
                                            <Form.Control name="nombre" value={form.nombre} onChange={handleChange} required ref={nombreInputRef} autoFocus className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Contacto</Form.Label>
                                            <Form.Control name="contacto" value={form.contacto} onChange={handleChange} className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Teléfono</Form.Label>
                                            <Form.Control name="telefono" value={form.telefono} onChange={handleChange} className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Email</Form.Label>
                                            <Form.Control name="email" value={form.email} onChange={handleChange} type="email" className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Dirección</Form.Label>
                                            <Form.Control name="direccion" value={form.direccion} onChange={handleChange} className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">RFC</Form.Label>
                                            <Form.Control name="rfc" value={form.rfc} onChange={handleChange} className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Notas</Form.Label>
                                            <Form.Control name="notas" value={form.notas} onChange={handleChange} as="textarea" className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 min-h-[48px] shadow-sm transition-all" />
                                        </Form.Group>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button type="button" className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold" onClick={handleCloseModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                                        {editingSupplier ? "Actualizar" : "Crear"}
                                    </button>
                                </div>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                </div>
            </div>
        </div>
    );
}