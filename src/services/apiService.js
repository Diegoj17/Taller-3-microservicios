const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const EMAIL_SERVICE_URL = import.meta.env.VITE_EMAIL_SERVICE_URL || 'http://localhost:3002';

class ApiService {
  // Cliente Service
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clients/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clients/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el login');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  async getProfile(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clients/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener el perfil');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Email Service
  async sendWelcomeEmail(emailData) {
    try {
      const response = await fetch(`${EMAIL_SERVICE_URL}/api/emails/send-welcome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error enviando email');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión con el servicio de email');
    }
  }

  async sendVerificationEmail(emailData) {
    try {
      const response = await fetch(`${EMAIL_SERVICE_URL}/api/emails/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error enviando email de verificación');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión con el servicio de email');
    }
  }
}

export default new ApiService();