import { useEffect, useState, useRef } from "react";
import { Spinner, Form, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import api from "../services/api";
import "./products.css";
import Sidebar from "../components/layout/Sidebar";

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
    const [formError, setFormError] = useState("");
    const marcaInputRef = useRef(null);

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

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success("Producto eliminado");
            setProducts((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            toast.error("Error al eliminar: " + (err.response?.data?.message || err.message));
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
        setFormError("");
        setUploading(true);
        try {
            // Castear campos numéricos
            const payload = {
                ...form,
                ano: form.ano ? Number(form.ano) : undefined,
                precioBase: form.precioBase ? Number(form.precioBase) : undefined,
                kilometraje: form.kilometraje ? Number(form.kilometraje) : undefined,
                numPuertas: form.numPuertas ? Number(form.numPuertas) : undefined,
            };
            const { data } = await api.post("/products", payload);
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
            const msg = err.response?.data?.message || err.message;
            setFormError(msg);
            toast.error("Error al crear producto: " + msg);
        } finally {
            setUploading(false);
        }
    };

    // UX: enfocar primer input al abrir modal
    useEffect(() => {
        if (showModal && marcaInputRef.current) {
            setTimeout(() => marcaInputRef.current.focus(), 200);
        }
    }, [showModal]);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-container">
                <div className="products-container">
                    <div className="products-header">
                        <h2 className="products-title">Productos</h2>
                        <button
                            className="btn btn-primary"
                            style={{ fontWeight: 600, fontSize: '1.1rem', padding: '0.7em 2em', borderRadius: '0.7em', boxShadow: '0 2px 8px 0 rgba(13,110,253,0.08)' }}
                            onClick={() => setShowModal(true)}
                        >
                            Crear producto
                        </button>
                    </div>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0' }}>
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <div className="products-grid">
                            {products.map((p) => (
                                <div key={p._id} className="product-card">
                                    {p.imageUrl && (
                                        <img src={p.imageUrl} alt={p.modelo} className="product-card-img" />
                                    )}
                                    <button
                                        className="product-card-delete"
                                        title="Eliminar producto"
                                        onClick={() => handleDelete(p._id)}
                                    >
                                        &#10005;
                                    </button>
                                    <div className="product-card-body">
                                        <div className="product-card-title">
                                            {p.marca} {p.modelo}
                                            <span className="product-card-badge">{p.ano}</span>
                                        </div>
                                        <span className="product-card-price">${p.precioBase?.toLocaleString?.() || p.precioBase}</span>
                                        <div className="product-card-tags">
                                            <span className="product-card-tag">{p.condicion}</span>
                                            <span className="product-card-tag product-card-tag-gray">{p.tipo}</span>
                                        </div>
                                        <div className="product-card-details">
                                            <span><b>Kilometraje:</b> {p.kilometraje?.toLocaleString?.()} km</span><br />
                                            <span><b>Transmisión:</b> {p.transmision} <b>Motor:</b> {p.motor}</span><br />
                                            <span><b>Color:</b> {p.color} <b>Puertas:</b> {p.numPuertas}</span><br />
                                            <span><b>VIN:</b> {p.vin}</span>
                                        </div>
                                        <div className="product-card-desc">{p.descripcion}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton className="!bg-blue-600 !text-white">
                            <Modal.Title>Crear producto</Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={handleCreate}>
                            <Modal.Body className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-b-2xl p-6">
                                {formError && (
                                    <div className="bg-red-100 text-red-700 rounded px-3 py-2 mb-3 text-sm shadow">{formError}</div>
                                )}
                                <div className="mb-6 flex flex-col gap-2">
                                    <h3 className="text-2xl font-extrabold text-blue-700 mb-1 tracking-tight">Datos del producto</h3>
                                    <p className="text-gray-500 text-sm">Completa la información para crear un nuevo producto. Los campos marcados con <span className='text-red-500'>*</span> son obligatorios.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Columna 1 */}
                                    <div className="flex flex-col gap-4">
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Marca <span className="text-red-500">*</span></Form.Label>
                                            <Form.Control name="marca" value={form.marca} onChange={handleChange} required ref={marcaInputRef} autoFocus className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Modelo <span className="text-red-500">*</span></Form.Label>
                                            <Form.Control name="modelo" value={form.modelo} onChange={handleChange} required className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Año <span className="text-red-500">*</span></Form.Label>
                                            <Form.Control name="ano" value={form.ano} onChange={handleChange} required type="number" className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Precio Base <span className="text-red-500">*</span></Form.Label>
                                            <Form.Control name="precioBase" value={form.precioBase} onChange={handleChange} required type="number" className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Kilometraje <span className="text-red-500">*</span></Form.Label>
                                            <Form.Control name="kilometraje" value={form.kilometraje} onChange={handleChange} required type="number" className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Condición</Form.Label>
                                            <Form.Select name="condicion" value={form.condicion} onChange={handleChange} className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all">
                                                <option>Nuevo</option>
                                                <option>Usado</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Tipo</Form.Label>
                                            <Form.Control name="tipo" value={form.tipo} onChange={handleChange} className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                    </div>
                                    {/* Columna 2 */}
                                    <div className="flex flex-col gap-4">
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Transmisión</Form.Label>
                                            <Form.Control name="transmision" value={form.transmision} onChange={handleChange} className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Motor</Form.Label>
                                            <Form.Control name="motor" value={form.motor} onChange={handleChange} className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Color</Form.Label>
                                            <Form.Control name="color" value={form.color} onChange={handleChange} className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Número de puertas</Form.Label>
                                            <Form.Control name="numPuertas" value={form.numPuertas} onChange={handleChange} type="number" className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">VIN</Form.Label>
                                            <Form.Control name="vin" value={form.vin} onChange={handleChange} className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 shadow-sm transition-all" />
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Descripción</Form.Label>
                                            <Form.Control name="descripcion" value={form.descripcion} onChange={handleChange} as="textarea" className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 min-h-[48px] shadow-sm transition-all" />
                                        </Form.Group>
                                        <Form.Group className="flex flex-col gap-1">
                                            <Form.Label className="font-semibold text-gray-700">Imagen</Form.Label>
                                            <Form.Control type="file" accept="image/*" onChange={handleImageChange} className="rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base py-2 bg-white shadow-sm transition-all" />
                                        </Form.Group>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button type="button" className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold" onClick={() => setShowModal(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={uploading} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center min-w-[110px] justify-center disabled:opacity-60">
                                        {uploading ? (
                                            <>
                                                <Spinner size="sm" animation="border" className="me-2" /> Subiendo...
                                            </>
                                        ) : "Crear"}
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
