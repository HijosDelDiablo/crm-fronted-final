import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Camera, FileText, Upload, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api'; // Ajusta la ruta según tu estructura
import { updateUserData } from '../redux/slices/authSlice'; // Ajusta la ruta

const MyProfile = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Referencias para inputs de archivos
    const photoInputRef = useRef(null);
    const ineInputRef = useRef(null);
    const domicilioInputRef = useRef(null);
    const ingresoInputRef = useRef(null);

    // Estados de carga
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadingIne, setUploadingIne] = useState(false);
    const [uploadingDomicilio, setUploadingDomicilio] = useState(false);
    const [uploadingIngreso, setUploadingIngreso] = useState(false);

    // Helper para obtener URL de la imagen/archivo
    const getFileUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        // Ajusta la URL base según tu entorno
        const baseUrl = import.meta.env.VITE_APP_API_URL || 'https://crm-back-final-production.up.railway.app';
        return `${baseUrl}${path}`;
    };

    // Función genérica para subir archivos
    const handleFileUpload = async (file, endpoint, setLoading) => {
        if (!file) return;

        // Validaciones
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Tipo de archivo no permitido. Solo imágenes y PDF.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            toast.error('El archivo es demasiado grande (Máx 5MB)');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const { data } = await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Actualizar Redux con la respuesta (se asume que devuelve el usuario actualizado)
            dispatch(updateUserData(data));
            toast.success('Archivo actualizado correctamente');
        } catch (error) {
            console.error('Error uploading file:', error);
            // Mostrar mensaje de error más específico si viene del backend
            const msg = error.response?.data?.message || 'Error al subir el archivo';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // Handlers específicos
    const onPhotoChange = (e) => handleFileUpload(e.target.files[0], '/user/profile/upload-photo', setUploadingPhoto);
    const onIneChange = (e) => handleFileUpload(e.target.files[0], '/user/profile/upload-ine', setUploadingIne);
    const onDomicilioChange = (e) => handleFileUpload(e.target.files[0], '/user/profile/upload-comprobante-domicilio', setUploadingDomicilio);
    const onIngresoChange = (e) => handleFileUpload(e.target.files[0], '/user/profile/upload-comprobante-ingreso', setUploadingIngreso);

    // Componente para visualizar archivo (miniatura o link)
    const FilePreview = ({ url, label, onUpdate, loading, inputRef, accept = "image/*,application/pdf" }) => {
        const isPdf = url?.toLowerCase().endsWith('.pdf');

        return (
            <Card className="h-100 shadow-sm border-0 bg-light">
                <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                    <div className="mb-3 position-relative">
                        {url ? (
                            isPdf ? (
                                <div className="d-flex align-items-center justify-content-center bg-white rounded p-4 shadow-sm" style={{ width: '100px', height: '100px' }}>
                                    <FileText size={48} className="text-danger" />
                                </div>
                            ) : (
                                <img
                                    src={url}
                                    alt={label}
                                    className="rounded shadow-sm object-fit-cover"
                                    style={{ width: '100px', height: '100px' }}
                                />
                            )
                        ) : (
                            <div className="d-flex align-items-center justify-content-center bg-white rounded p-4 shadow-sm border border-dashed" style={{ width: '100px', height: '100px' }}>
                                <AlertCircle size={32} className="text-muted" />
                            </div>
                        )}
                    </div>

                    <h6 className="fw-bold mb-1">{label}</h6>
                    <div className="mb-3">
                        {url ? (
                            <Badge bg="success" className="d-flex align-items-center gap-1 mx-auto" style={{ width: 'fit-content' }}>
                                <CheckCircle size={12} /> Cargado
                            </Badge>
                        ) : (
                            <Badge bg="secondary" className="mx-auto">Pendiente</Badge>
                        )}
                    </div>

                    <div className="mt-auto d-flex gap-2 w-100 justify-content-center">
                        {url && (
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="d-flex align-items-center gap-1"
                                onClick={() => window.open(url, '_blank')}
                            >
                                <Eye size={14} /> Ver
                            </Button>
                        )}
                        <Button
                            variant="primary"
                            size="sm"
                            className="d-flex align-items-center gap-1"
                            onClick={() => inputRef.current?.click()}
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm" animation="border" /> : <Upload size={14} />}
                            {url ? 'Cambiar' : 'Subir'}
                        </Button>
                    </div>

                    <input
                        type="file"
                        ref={inputRef}
                        className="d-none"
                        onChange={onUpdate}
                        accept={accept}
                    />
                </Card.Body>
            </Card>
        );
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h2 className="fw-bold mb-0 pricings-title">Mi Perfil</h2>
                <Button variant="secondary" onClick={() => navigate(-1)}>
                    Return
                </Button>
            </div>

            <Row className="g-4">
                {/* Sección de Datos Personales y Foto */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm h-100 seller-card">
                        <Card.Body className="text-center p-4">
                            <div className="position-relative d-inline-block mb-4">
                                <div
                                    className="rounded-circle overflow-hidden border border-4 border-white shadow"
                                    style={{ width: '150px', height: '150px' }}
                                >
                                    <img
                                        src={getFileUrl(user?.fotoPerfil) || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"}
                                        alt="Perfil"
                                        className="w-100 h-100 object-fit-cover"
                                    />
                                </div>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="position-absolute bottom-0 end-0 rounded-circle p-2 shadow"
                                    onClick={() => photoInputRef.current?.click()}
                                    disabled={uploadingPhoto}
                                >
                                    {uploadingPhoto ? <Spinner size="sm" animation="border" /> : <Camera size={18} />}
                                </Button>
                                <input
                                    type="file"
                                    ref={photoInputRef}
                                    className="d-none"
                                    onChange={onPhotoChange}
                                    accept="image/*"
                                />
                            </div>

                            <h4 className="fw-bold mb-1">{user?.nombre}</h4>
                            <p className="text-muted mb-4">{user?.rol}</p>

                            <div className="text-start p-3 rounded seller-card">
                                <p className="mb-2 "><strong>Email:</strong> {user?.email}</p>
                                <p className="mb-0"><strong>Teléfono:</strong> {user?.telefono || 'No registrado'}</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Sección de Documentos */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm h-100 seller-card">
                        <Card.Header className="seller-card py-3 border-bottom-0">
                            <h5 className="mb-0 fw-bold">Documentación Personal</h5>
                            <small className="text-muted">Gestiona tus archivos personales (INE, Comprobantes)</small>
                        </Card.Header>
                        <Card.Body >
                            <Row className="g-4">
                                <Col md={4} >
                                    <FilePreview
                                        className="seller-card"
                                        label="INE / Identificación"
                                        url={getFileUrl(user?.uriIneFile)}
                                        onUpdate={onIneChange}
                                        loading={uploadingIne}
                                        inputRef={ineInputRef}
                                    />
                                </Col>
                                <Col md={4}>
                                    <FilePreview
                                        label="Comprobante de Ingresos"
                                        url={getFileUrl(user?.uriComprobanteIngresoFile)}
                                        onUpdate={onIngresoChange}
                                        loading={uploadingIngreso}
                                        inputRef={ingresoInputRef}
                                    />
                                </Col>
                                <Col md={4}>
                                    <FilePreview
                                        label="Comprobante de Domicilio"
                                        url={getFileUrl(user?.uriComprobanteDomicilioFile)}
                                        onUpdate={onDomicilioChange}
                                        loading={uploadingDomicilio}
                                        inputRef={domicilioInputRef}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MyProfile;
