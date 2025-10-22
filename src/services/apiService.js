import { clientApi } from '../api/Axios';

// URLs de los microservicios - CORREGIDO: usar VITE_ en lugar de REACT_APP_
const LOYALTY_SERVICE_URL = import.meta.env.VITE_LOYALTY_SERVICE_URL || 
  'https://loyaltypoints-microservice-production.up.railway.app';
const DELIVERY_SERVICE_URL = import.meta.env.VITE_DELIVERY_SERVICE_URL || 
  'https://packagedelivery-microservice-production.up.railway.app';

class apiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // Método genérico para hacer requests a los microservicios
  async microserviceRequest(baseUrl, endpoint, options = {}) {
    const url = `${baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Agregar token si existe
    const token = this.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || `Error en el servicio: ${endpoint}`);
      }

      return data;
    } catch (error) {
      console.error(`Microservice request failed (${endpoint}):`, error);
      throw error;
    }
  }

  // --- PACKAGE DELIVERY MICROSERVICE ---
  
  // Obtener el paquete de bienvenida por email
  async getWelcomePackage(email) {
    try {
      return await this.microserviceRequest(
        DELIVERY_SERVICE_URL,
        `/api/entregas/${email}`
      );
    } catch (error) {
      console.warn('No se pudo obtener el welcome package:', error);
      return null;
    }
  }

  // --- LOYALTY POINTS MICROSERVICE ---

  async getRealTimeLoyaltyPoints(email) {
  try {
    console.log('🔄 Obteniendo puntos en tiempo real para:', email);
    const response = await this.microserviceRequest(
      LOYALTY_SERVICE_URL, 
      `/api/puntos/${email}`
    );
    
    // Debug: ver la estructura completa de la respuesta
    console.log('🔍 Estructura completa de respuesta:', JSON.stringify(response, null, 2));
    
    // Probar diferentes formas de extraer los puntos
    let puntos = 0;
    
    if (response && typeof response === 'object') {
      // Intentar diferentes propiedades posibles
      puntos = response.puntos || 
               response.totalPuntos || 
               response.points || 
               response.data?.puntos ||
               response.puntosTotales ||
               response.total_points ||
               0;
    } else if (typeof response === 'number') {
      puntos = response;
    }
    
    console.log('🎯 Puntos extraídos:', puntos);
    return puntos;
    
  } catch (error) {
    console.error('❌ Error obteniendo puntos en tiempo real:', error);
    return 0;
  }
}
  
  async getLoyaltyPoints(email) {
    try {
      return await this.microserviceRequest(
        LOYALTY_SERVICE_URL, 
        `/api/puntos/${email}`
      );
    } catch (error) {
      console.warn('No se pudieron obtener puntos de lealtad');
      return { puntos: 0, totalPuntos: 0, points: 0 };
    }
  }

  // --- MÉTODOS EXISTENTES DEL CLIENTE SERVICE ---
  
  async register(userData) {
    try {
      // El backend del cliente service se encarga de:
      // 1. Crear el usuario
      // 2. Crear automáticamente el paquete de bienvenida
      // 3. Inicializar puntos de lealtad en 0
      const response = await clientApi.post('/api/clientes', userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error en el registro'
      );
    }
  }

  async login(credentials) {
    try {
      const response = await clientApi.post('/api/clientes/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        this.token = response.data.token;
      }
      
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message || 'Error en el login';
      
      const enhancedError = new Error(message);
      enhancedError.status = status;
      enhancedError.data = error.response?.data;
      
      throw enhancedError;
    }
  }

  async getClienteById(id) {
    try {
      const response = await clientApi.get(`/api/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      throw error;
    }
  }

  async getProfile() {
    try {
      let response = await clientApi.get('/api/clientes/me');
      if (response && response.data) return response.data;

      response = await clientApi.get('/api/clientes/profile');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo perfil del cliente:', error);
      throw error;
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.token = null;
  }
}

export default new apiService();