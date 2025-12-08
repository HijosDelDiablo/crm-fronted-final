import React, { useEffect, useState } from 'react';
import './../../styles/Auth.css';
import ButtonPrimary from '../../components/shared/ButtonPrimary';
import { loginFetch, registerFetch, googleLogin } from '../../api/auth';
import { notifyError, notifySuccess } from '../../components/shared/Alerts';
import { validateField } from './validations';
import AuthService from './AuthService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import { handleLoginResponse } from '../../utils/authUtils';

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const isRegistro = searchParams.get('registro');
  const [view, setView] = useState('login'); // 'login', 'register', 'recovery'
  const [formData, setFormData] = useState({
    email: '',
    tel: '',
    password: '',
    confirmPassword: '',
    name: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isRegistro) {
      setView('register');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    // Validar en tiempo real solo si el campo ya fue tocado
    if (touched[name]) {
      const error = validateField(name, fieldValue, view, formData);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, value, view, formData);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called, view:', view);

    // Validar todos los campos
    const newErrors = {};
    const fieldsToValidate = view === 'register'
      ? ['email', 'password', 'confirmPassword', 'name']
      : view === 'recovery'
        ? ['email']
        : ['email', 'password'];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field], view, formData);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    console.log('Validation errors:', newErrors);

    if (Object.keys(newErrors).length > 0) {
      console.log('Validation failed, not submitting');
      const errorMessages = Object.values(newErrors).join('. ');
      notifyError('Por favor corrige los errores: ' + errorMessages);
      return;
    }

    setIsLoading(true);
    console.log('Starting submission, isLoading set to true');

    try {
      if (view === 'login') {
        console.log('Calling loginFetch');
        const response = await loginFetch(formData);
        handleLoginResponse(response, navigate, dispatch, (u) => AuthService.login(u), setIsLoading);

      } else if (view === 'register') {
        console.log('Calling registerFetch with:', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        const registerResponse = await registerFetch(formData);
        console.log('registerResponse:', registerResponse);
        if (registerResponse.status) {
          setView('login');
          notifySuccess(registerResponse.message || 'Registro exitoso. Ya puedes iniciar sesión.');
        } else {
          notifyError(registerResponse.message || 'Error en el registro');
        }

      } else if (view === 'recovery') {
        console.log('Recovery:', { email: formData.email });
        notifyError('Funcionalidad de recuperación no implementada');
        setView('login');
      }
    } catch (error) {
      console.error('Error:', error.message);
      notifyError('Error en la operación: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      googleLogin();
    } catch (error) {
      console.error("Error en Google Auth: ", error);
      notifyError('Error en el inicio de sesión con Google: ' + error.message);
    }
  };

  const switchView = (newView) => {
    setView(newView);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      rememberMe: false
    });
    setErrors({});
    setTouched({});
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="logo-container">
          <div className="logo-icon">AI</div>
          <div className="logo-text">
            <span className="logo-title">Autobots IA</span>
            <span className="logo-subtitle">CRM automotriz con IA</span>
          </div>
        </div>

        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">
            {view === 'login' && 'Iniciar sesión'}
            {view === 'register' && 'Crear cuenta'}
            {view === 'recovery' && 'Recuperar contraseña'}
          </h1>
          <p className="auth-subtitle">
            {view === 'login' && 'Entra a tu panel y continúa donde te quedaste.'}
            {view === 'register' && 'Completa tus datos para registrarte.'}
            {view === 'recovery' && 'Te enviaremos un link de recuperación.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {view === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Nombre completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.name && touched.name ? 'error' : ''}
                placeholder="Tu nombre"
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.email && touched.email ? 'error' : ''}
              placeholder="tucorreo@email.com"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {view === 'register' && (
            <div className="form-group">
              <label htmlFor="tel">Teléfono</label>
              <input
                type="tel"
                id="tel"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.tel && touched.tel ? 'error' : ''}
                placeholder="47700011100"
              />
              {errors.tel && (
                <span className="error-message">{errors.tel}</span>
              )}
            </div>
          )}

          {view !== 'recovery' && (
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.password && touched.password ? 'error' : ''}
                placeholder="••••••••"
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>
          )}

          {view === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.confirmPassword && touched.confirmPassword ? 'error' : ''}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <button className="btn-nav-ghost" type="submit" disabled={isLoading}>
            {isLoading ? 'Cargando...' : (
              view === 'login' ? 'Entrar' :
                view === 'register' ? 'Registrarse' :
                  'Enviar link'
            )}
          </button>


        </form>

        {/* Footer */}
        <div className="auth-footer">
          {view === 'login' && (
            <>
              <p className="mb-2">¿No tienes cuenta?</p>
              <p>Crea una cuenta para comenzar tu experiencia. <button type="button" className="link-register" onClick={() => switchView('register')}>Regístrate</button></p>
            </>
          )}
          {view === 'register' && (
            <>
              <p>
                ¿Ya tienes cuenta?{' '}
                <button type="button" className="link-register" onClick={() => switchView('login')}>
                  Inicia sesión
                </button>
              </p>
            </>
          )}
          {view === 'recovery' && (
            <p>
              <button type="button" className="link-register" onClick={() => switchView('login')}>
                ← Volver al login
              </button>
            </p>
          )}
        </div>
        <p className="auth-legal">
          Al continuar aceptas los Términos de uso y el Aviso de privacidad.
        </p>
      </div>
    </div>
  );
};

export default Auth;