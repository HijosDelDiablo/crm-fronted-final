import { useEffect, useState, useRef } from "react";
import { Spinner, Form, Modal } from "react-bootstrap";
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
        <div className="py-8 px-2 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Productos</h2>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
                    onClick={() => setShowModal(true)}
                >
                    Crear producto
                </button>
            </div>
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <Spinner animation="border" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
                    {products.map((p) => (
                        <div key={p._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden flex flex-col">
                            {p.imageUrl && (
                                <img src={p.imageUrl} alt={p.modelo} className="w-full h-56 object-cover bg-gray-100" />
                            )}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-800 flex-1">{p.marca} {p.modelo}</h3>
                                    <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded">{p.ano}</span>
                                </div>
                                <span className="text-blue-600 font-bold text-lg mb-1 block">${p.precioBase?.toLocaleString?.() || p.precioBase}</span>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">{p.condicion}</span>
                                    <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">{p.tipo}</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    <span className="block"><b>Kilometraje:</b> {p.kilometraje?.toLocaleString?.()} km</span>
                                    <span className="block"><b>Transmisión:</b> {p.transmision} <b>Motor:</b> {p.motor}</span>
                                    <span className="block"><b>Color:</b> {p.color} <b>Puertas:</b> {p.numPuertas}</span>
                                    <span className="block"><b>VIN:</b> {p.vin}</span>
                                </div>
                                <p className="text-gray-500 text-xs mt-auto">{p.descripcion}</p>
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
                            <div className="bg-red-100 text-red-700 rounded px-3 py-2 mb-3 text-sm">{formError}</div>
                        )}
                        <h3 className="text-xl font-bold text-blue-700 mb-4 col-span-2">Datos del producto</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Group className="flex flex-col gap-1">
                                <Form.Label className="font-semibold text-gray-700">Marca</Form.Label>
                                <Form.Control name="marca" value={form.marca} onChange={handleChange} required ref={marcaInputRef} autoFocus className="rounded-lg border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base py-2" />
                            </Form.Group>
                            <Form.Group className="flex flex-col gap-1">
                                <Form.Label className="font-semibold text-gray-700">Modelo</Form.Label>
                                <Form.Control name="modelo" value={form.modelo} onChange={handleChange} required className="rounded-lg border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base py-2" />
                            </Form.Group>
                            <Form.Group className="flex flex-col gap-1">
                                <Form.Label className="font-semibold text-gray-700">Año</Form.Label>
                                <Form.Control name="ano" value={form.ano} onChange={handleChange} required type="number" className="rounded-lg border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base py-2" />
                            </Form.Group>
                            <Form.Group className="flex flex-col gap-1">
                                <Form.Label className="font-semibold text-gray-700">Precio Base</Form.Label>
                                <Form.Control name="precioBase" value={form.precioBase} onChange={handleChange} required type="number" className="rounded-lg border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base py-2" />
                            </Form.Group>
                            <Form.Group className="flex flex-col gap-1">
                                <Form.Label className="font-semibold text-gray-700">Kilometraje</Form.Label>
                                <Form.Control name="kilometraje" value={form.kilometraje} onChange={handleChange} required type="number" className="rounded-lg border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base py-2" />
                            </Form.Group>
                            <Form.Group className="flex flex-col gap-1 md:col-span-2">
                                <Form.Label className="font-semibold text-gray-700">Descripción</Form.Label>
                                <Form.Control name="descripcion" value={form.descripcion} onChange={handleChange} as="textarea" className="rounded-lg border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base py-2 min-h-[48px]" />
                            </Form.Group>
                            <Form.Group className="flex flex-col gap-1">
                                <Form.Label className="font-semibold text-gray-700">Condición</Form.Label>
                                <Form.Select name="condicion" value={form.condicion} onChange={handleChange} className="rounded-lg border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base py-2">
                                    <option>Nuevo</option>
                                    <option>Usado</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="flex flex-col gap-1">
                                <Form.Label className="font-semibold text-gray-700">Tipo</Form.Label>
                                <Form.Control name="tipo" value={form.tipo} onChange={handleChange} className="rounded-lg border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base py-2" />
                            </Form.Group>
                            <Form.Group className="flex flex-col gap-1">
                                <Form.Label className="font-semibold text-gray-700">Transmisión</Form.Label>
                                <Form.Control name="transmision" value={form.transmision} onChange={handleChange} className="rounded-lg border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base py-2" />
                            </Form.Group>
                            <Form.Group className="flex flex-col gap-1">
                                <Form.Label className="font-semibold text-gray-700">Motor</Form.Label>
                                <Form.Control name="motor" value={form.motor} onChange={handleChange} className="rounded-lg border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base py-2" />
                            </Form.Group>
                            <Form.Group className="flex flex-col gap-1">
                                <Form.Label className="font-semibold text-gray-700">Color</Form.Label>
                                <Form.Control name="color" value={form.color} onChange={handleChange} className="rounded-lg border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base py-2" />
                            </Form.Group>
                            <Form.Group className="flex flex-col gap-1">
                                <Form.Label className="font-semibold text-gray-700">Número de puertas</Form.Label>
                                <Form.Control name="numPuertas" value={form.numPuertas} onChange={handleChange} type="number" className="rounded-lg border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base py-2" />
                            </Form.Group>
                            <Form.Group className="flex flex-col gap-1 md:col-span-2">
                                <Form.Label className="font-semibold text-gray-700">VIN</Form.Label>
                                <Form.Control name="vin" value={form.vin} onChange={handleChange} className="rounded-lg border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base py-2" />
                            </Form.Group>
                            <Form.Group className="flex flex-col gap-1 md:col-span-2">
                                <Form.Label className="font-semibold text-gray-700">Imagen</Form.Label>
                                <Form.Control type="file" accept="image/*" onChange={handleImageChange} className="rounded-lg border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base py-2 bg-white" />
                            </Form.Group>
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
    );
}
