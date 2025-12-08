import { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../../redux/slices/authSlice";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  User,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
} from "lucide-react";
import "./ClientStyles.css";

export default function Perfil() {
  const { user: reduxUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    fechaNacimiento: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/user/profile");
      setFormData({
        nombre: data.nombre || "",
        email: data.email || "",
        telefono: data.telefono || "",
        direccion: data.direccion || "",
        fechaNacimiento: data.fechaNacimiento
          ? data.fechaNacimiento.split("T")[0]
          : "",
      });
      dispatch(updateUserData(data));
    } catch (error) {
      toast.error("Error al cargar perfil");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch("/user/profile", formData);
      dispatch(updateUserData(data));
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar datos");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/"))
      return toast.error("Solo se permiten imágenes");
    if (file.size > 5 * 1024 * 1024)
      return toast.error("La imagen no debe pesar más de 5MB");

    const formDataImg = new FormData();
    formDataImg.append("file", file);

    setUploading(true);
    try {
      const { data } = await api.post(
        "/user/profile/upload-photo",
        formDataImg,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(updateUserData(data));
      toast.success("Foto de perfil actualizada");
    } catch (error) {
      console.error(error);
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const getAvatarUrl = () => {
    if (!reduxUser?.fotoPerfil) return "https://via.placeholder.com/150";
    if (reduxUser.fotoPerfil.startsWith("http")) return reduxUser.fotoPerfil;
    return `${import.meta.env.VITE_APP_API_URL}${reduxUser.fotoPerfil}`;
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4 fw-bold text-dark">Mi Perfil</h2>

      <Row className="g-4">
        <Col md={4} lg={3}>
          <div className="product-card text-center p-4 h-100">
            <div className="position-relative d-inline-block mb-3">
              <div
                className="rounded-circle overflow-hidden border border-3 border-white shadow-sm"
                style={{ width: "120px", height: "120px", cursor: "pointer" }}
                onClick={handlePhotoClick}
              >
                <img
                  src={getAvatarUrl()}
                  alt="Perfil"
                  className="w-100 h-100 object-fit-cover"
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100 transition-opacity">
                  <Camera className="text-white" size={32} />
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="d-none"
                accept="image/*"
              />

              {uploading && (
                <div className="mt-2">
                  <Spinner animation="border" size="sm" variant="primary" />{" "}
                  <small>Subiendo...</small>
                </div>
              )}
            </div>

            <h5 className="fw-bold mb-1">{reduxUser?.nombre}</h5>
            <p className="text-muted small mb-3">{reduxUser?.rol}</p>

            <div className="text-start mt-4">
              <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                <Mail size={16} />{" "}
                <small className="text-truncate">{reduxUser?.email}</small>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted">
                <User size={16} /> <small>Cliente Registrado</small>
              </div>
            </div>
          </div>
        </Col>

        <Col md={8} lg={9}>
          <div className="product-card p-4 h-100">
            <h5 className="fw-bold mb-4 border-bottom pb-2">
              Información Personal
            </h5>

            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small text-muted">
                      Nombre Completo
                    </Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <User size={18} />
                      </span>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="border-start-0 ps-0"
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small text-muted">
                      Correo Electrónico
                    </Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Mail size={18} />
                      </span>
                      <Form.Control
                        type="email"
                        value={formData.email}
                        disabled
                        className="bg-light border-start-0 ps-0"
                        title="El correo no se puede editar"
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small text-muted">
                      Teléfono
                    </Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Phone size={18} />
                      </span>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="border-start-0 ps-0"
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small text-muted">
                      Fecha de Nacimiento
                    </Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Calendar size={18} />
                      </span>
                      <Form.Control
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        className="border-start-0 ps-0"
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="small text-muted">
                      Dirección
                    </Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <MapPin size={18} />
                      </span>
                      <Form.Control
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        placeholder="Calle, Número, Colonia, Ciudad"
                        className="border-start-0 ps-0"
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="btn-rounded px-4 d-flex align-items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    <Save size={18} />
                  )}
                  Guardar Cambios
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
