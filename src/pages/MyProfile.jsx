import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Camera, FileText, Upload, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadProfilePhoto, uploadINE, uploadDomicilio, uploadIngresos, getProfile, updateProfile } from '../api/users.api';
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

    // Cargar perfil al montar el componente
    useEffect(() => {
        console.log('🔄 MyProfile: Montando componente, cargando perfil...');
        const loadProfile = async () => {
            try {
                console.log('📡 MyProfile: Llamando a getProfile...');
                const profileData = await getProfile(navigate);
                if (profileData) {
                    console.log('✅ MyProfile: Perfil obtenido:', profileData);
                    dispatch(updateUserData(profileData));
                } else {
                    console.warn('⚠️ MyProfile: No se pudo obtener el perfil');
                }
            } catch (error) {
                console.error('❌ MyProfile: Error al cargar perfil:', error);
            }
        };
        loadProfile();
    }, [dispatch, navigate]);

    // Helper para obtener URL de la imagen/archivo
    const getFileUrl = (path) => {
        console.log('🔗 MyProfile: getFileUrl llamado con path:', path);
        if (!path) {
            console.log('🔗 MyProfile: Path vacío, retornando null');
            return null;
        }
        if (path.startsWith('http')) {
            console.log('🔗 MyProfile: Path ya es URL completa:', path);
            return path;
        }
        // Special mapping for uploaded images
       
        // Ajusta la URL base según tu entorno
        const baseUrl = 'https://8rnc9otm8f.ufs.sh/f/';
        const fullUrl = `${baseUrl}${path}`;
        console.log('🔗 MyProfile: Construyendo URL:', fullUrl);
        return fullUrl;
    };

    // Función genérica para subir archivos
    const handleFileUpload = async (file, uploadFunction, setLoading) => {
        console.log('📤 MyProfile: handleFileUpload iniciado con file:', file?.name, 'tipo:', file?.type);
        if (!file) {
            console.warn('⚠️ MyProfile: No hay archivo para subir');
            return;
        }

        // Validaciones
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            console.error('❌ MyProfile: Tipo de archivo no permitido:', file.type);
            toast.error('Tipo de archivo no permitido. Solo imágenes y PDF.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            console.error('❌ MyProfile: Archivo demasiado grande:', file.size);
            toast.error('El archivo es demasiado grande (Máx 5MB)');
            return;
        }

        setLoading(true);
        console.log('⏳ MyProfile: Iniciando subida de archivo...');
        try {
            const result = await uploadFunction(file, navigate);
            if (result) {
                console.log('✅ MyProfile: Archivo subido exitosamente:', result);
                // Actualizar Redux con la respuesta (se asume que devuelve el usuario actualizado)
                dispatch(updateUserData(result));
                toast.success('Archivo actualizado correctamente');
            } else {
                console.error('❌ MyProfile: Error en respuesta de subida');
                toast.error('Error al subir el archivo');
            }
        } catch (error) {
            console.error('❌ MyProfile: Error uploading file:', error);
            toast.error('Error al subir el archivo');
        } finally {
            setLoading(false);
            console.log('🏁 MyProfile: Finalizada subida de archivo');
        }
    };

    // Handlers específicos
    const onPhotoChange = (e) => {
        console.log('📸 MyProfile: onPhotoChange activado');
        handleFileUpload(e.target.files[0], uploadProfilePhoto, setUploadingPhoto);
    };
    const onIneChange = (e) => {
        console.log('🆔 MyProfile: onIneChange activado');
        handleFileUpload(e.target.files[0], uploadINE, setUploadingIne);
    };
    const onDomicilioChange = (e) => {
        console.log('🏠 MyProfile: onDomicilioChange activado');
        handleFileUpload(e.target.files[0], uploadDomicilio, setUploadingDomicilio);
    };
    const onIngresoChange = (e) => {
        console.log('💰 MyProfile: onIngresoChange activado');
        handleFileUpload(e.target.files[0], uploadIngresos, setUploadingIngreso);
    };

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
                                        url={getFileUrl(user?.documents?.ine?.url)}
                                        onUpdate={onIneChange}
                                        loading={uploadingIne}
                                        inputRef={ineInputRef}
                                    />
                                </Col>
                                <Col md={4}>
                                    <FilePreview
                                        label="Comprobante de Ingresos"
                                        url={getFileUrl(user?.documents?.ingresos?.url)}
                                        onUpdate={onIngresoChange}
                                        loading={uploadingIngreso}
                                        inputRef={ingresoInputRef}
                                    />
                                </Col>
                                <Col md={4}>
                                    <FilePreview
                                        label="Comprobante de Domicilio"
                                        url={getFileUrl(user?.documents?.domicilio?.url)}
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
