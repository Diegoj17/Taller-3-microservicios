import { clientApi} from '../api/Axios';

class apiService {
  // Cliente Service - REGISTER
  async register(userData) {
    try {
      const response = await clientApi.post('/api/clients/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error en el registro'
      );
    }
  }

  // Cliente Service - LOGIN
  async login(credentials) {
    try {
      const response = await clientApi.post('/api/clients/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error en el login'
      );
    }
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Método para obtener el token
  getToken() {
    return localStorage.getItem('token');
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}

export default new apiService();