// AuthService.js

class AuthService {
  constructor() {
    this.subscribers = [];
    this.user = null;

    // Cargar usuario del localStorage al iniciar
    const saved = localStorage.getItem("user");
    if (saved) {
      this.user = JSON.parse(saved);
    }
  }

  // Notifica a todos los componentes suscritos
  notify() {
    this.subscribers.forEach((callback) => callback(this.user));
  }

  // Permite que el AuthContextProvider se suscriba
  subscribe(callback) {
    this.subscribers.push(callback);

    // Ejecuta inmediatamente con el usuario actual
    callback(this.user);

    return () => {
      this.subscribers = this.subscribers.filter((fn) => fn !== callback);
    };
  }

  login(userData) {
    this.user = userData;
    localStorage.setItem("user", JSON.stringify(userData));
    this.notify();
  }

  logout() {
    this.user = null;
    localStorage.removeItem("user");
    this.notify();
  }

  getUser() {
    return this.user;
  }

  isAuthenticated() {
    return !!this.user;
  }
}

// Exportamos una sola instancia
export default new AuthService();
