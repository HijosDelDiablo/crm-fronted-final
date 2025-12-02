import React, { useEffect, useState } from 'react';
import './../../styles/Auth.css';
import ButtonPrimary from '../../components/shared/ButtonPrimary';
import { loginFetch, registerFetch } from '../../api/auth';
import { notifyError, notifySuccess } from '../../components/shared/Alerts';
import { validateField } from './validations';
import AuthService from './AuthService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleLoginResponse } from '../../utils/authUtils';

const Auth = () => {
  const navigate = useNavigate();
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

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      if (view === 'login') {
        const response = await loginFetch(formData);
        handleLoginResponse(response, navigate, (u) => AuthService.login(u), setIsLoading);

      } else if (view === 'register') {
        console.log('Register:', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        if (await registerFetch(formData)) {
          setView('login');
          notifySuccess('Registro exitoso. Ya puedes, iniciar sesión.');
        };

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
    //  GOOGLE AUTH IMPLEMENTATION
    console.log('Google Auth iniciado');
    try {
      navigate(import.meta.env.VITE_URL_API_AUTH + '/googleInWeb');
    } catch (error) {
      console.error("Error en loginGoogleFetch: ", error);
      notifyError('Error en el inicio de sesión: ' + error.message);
    }
    //notifyError('Funcionalidad de Google Auth no implementada');
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
              {errors.name && touched.name && (
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
            {errors.email && touched.email && (
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
              {errors.tel && touched.tel && (
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
              {errors.password && touched.password && (
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
              {errors.confirmPassword && touched.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          {view === 'login' && (
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Recuérdame</span>
              </label>
              <button
                type="button"
                className="forgot-password"
                onClick={() => switchView('recovery')}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}
          <ButtonPrimary btnType="submit" isDisabled={isLoading} text={
            isLoading ? 'Cargando...' : (
              view === 'login' ? 'Entrar' :
                view === 'register' ? 'Registrarse' :
                  'Enviar link'
            )
          } />

        </form>

        {/* Google Auth - Solo en login y register */}
        {view !== 'recovery' && (
          <>
            <div className="divider">
              <span>o continúa con</span>
            </div>

            <button type="button" className="btn-google" onClick={handleGoogleAuth}>
              <svg width="20" height="20" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" />
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
              </svg>
              Google
            </button>
          </>
        )}

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