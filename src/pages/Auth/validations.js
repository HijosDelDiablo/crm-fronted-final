export const validateField = (name, value, view, formData) => {
  if(view === 'login') return '';
    let error = '';

    switch (name) {
      case 'email':
        if (!value) {
          error = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Email inválido';
        }
        break;
      case 'password':
        if (!value) {
          error = 'La contraseña es requerida';
        } else if (value.length < 8) {
          error = 'Mínimo 8 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Debe incluir mayúscula, minúscula y número';
        }
        break;
      case 'confirmPassword':
        if (view === 'register' && value !== formData.password) {
          error = 'Las contraseñas no coinciden';
        }
        break;
      case 'name':
        if (view === 'register' && !value) {
          error = 'El nombre es requerido';
        } else if (value && value.length < 2) {
          error = 'Mínimo 2 caracteres';
        }
        break;
      default:
        break;
    }

    return error;
  };