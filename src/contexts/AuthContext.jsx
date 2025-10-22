import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { AuthContext } from './AuthContextValue.jsx';

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);

  // Al montar, verificar si hay token en localStorage
  React.useEffect(() => {
    const init = async () => {
      const token = apiService.getToken();
      
      // Si no hay token, marcar como verificado y salir
      if (!token) {
        setLoading(false);
        setChecked(true);
        return;
      }

      try {
        const profile = await apiService.getProfile();
        const cliente = profile.cliente || profile.data || profile;
        
        if (cliente) {
          const clienteId = cliente.id || cliente._id;

          // Obtener datos de loyalty points
          let puntosLealtad = 0;
          try {
            const loyaltyData = await apiService.getLoyaltyPoints(cliente.email);
            puntosLealtad = loyaltyData.puntos || loyaltyData.totalPuntos || loyaltyData.points || 0;
          } catch (error) {
            console.warn('No se pudieron obtener los puntos de lealtad:', error);
          }

          // Obtener welcome package
          let welcomePackage = null;
          try {
            welcomePackage = await apiService.getWelcomePackage(cliente.email);
            if (welcomePackage) {
              const pkg = welcomePackage;
              welcomePackage = {
                descripcion: pkg.descripcion || 'Paquete de Bienvenida Premium',
                tracking: pkg.trackingNumber || pkg.tracking || pkg.id || null,
                estado: pkg.estado || pkg.status || 'pendiente',
                fechaCreacion: pkg.fechaCreacion
                  ? new Date(pkg.fechaCreacion).toLocaleDateString('es-ES')
                  : new Date().toLocaleDateString('es-ES'),
                direccion: cliente.direccion || '',
                ciudad: cliente.ciudad || '',
                codigoPostal: cliente.codigoPostal || cliente.codigo_postal || '',
                contenido: pkg.contenido || [
                  'Sanduchera eléctrica de regalo',
                  'Tarjeta de Cliente Premium',
                  'Cupón de 15% descuento en primera compra',
                  'Guía de beneficios exclusivos',
                  'Sorpresa especial'
                ]
              };
            }
          } catch (error) {
            console.warn('No se pudo obtener el welcome package:', error);
          }

          const userData = {
            id: clienteId,
            nombre: cliente.nombre || cliente.firstName || cliente.name || '',
            apellido: cliente.apellido || cliente.lastName || '',
            email: cliente.email || '',
            telefono: cliente.telefono || '',
            direccion: cliente.direccion || '',
            ciudad: cliente.ciudad || '',
            codigoPostal: cliente.codigoPostal || cliente.codigo_postal || cliente.codigo || '',
            fechaRegistro: cliente.fechaRegistro || '',
            puntosLealtad: puntosLealtad,
            genero: cliente.genero || 'hombre',
            welcomePackage: welcomePackage
          };
          setCustomerData(userData);
        } else {
          // Si no hay cliente en la respuesta pero hay token, crear datos mínimos
          const fallbackUser = {
            id: null,
            nombre: 'Usuario',
            apellido: '',
            email: '',
            puntosLealtad: 0,
            welcomePackage: null
          };
          setCustomerData(fallbackUser);
        }
      } catch (error) {
        console.warn('No se pudo obtener perfil desde token:', error);
        // Si hay error pero tenemos token, mantener al usuario autenticado
        const fallbackUser = {
          id: null,
          nombre: 'Usuario',
          apellido: '',
          email: '',
          puntosLealtad: 0,
          welcomePackage: null
        };
        setCustomerData(fallbackUser);
      } finally {
        setLoading(false);
        setChecked(true);
      }
    };

    init();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await apiService.login(credentials);
      
      if (response && response.success && response.cliente) {
        const cliente = response.cliente;
        const clienteId = cliente.id || cliente._id;

        // Obtener loyalty points
        let puntosLealtad = 0;
        try {
          const loyaltyData = await apiService.getLoyaltyPoints(cliente.email);
          puntosLealtad = loyaltyData.puntos || loyaltyData.totalPuntos || loyaltyData.points || 0;
        } catch (error) {
          console.warn('No se pudieron obtener puntos', error);
        }

        // Obtener welcome package
        let welcomePackage = null;
        try {
          const packageData = await apiService.getWelcomePackage(cliente.email);
          if (packageData) {
            welcomePackage = {
              descripcion: 'Paquete de Bienvenida Premium',
              tracking: packageData.trackingNumber,
              estado: packageData.estado,
              fechaCreacion: packageData.fechaCreacion 
                ? new Date(packageData.fechaCreacion).toLocaleDateString('es-ES')
                : new Date().toLocaleDateString('es-ES'),
              direccion: cliente.direccion || '',
              ciudad: cliente.ciudad || '',
              codigoPostal: cliente.codigoPostal || cliente.codigo_postal || '',
              contenido: [
                'Sanduchera eléctrica de regalo',
                'Tarjeta de Cliente Premium',
                'Cupón de 15% descuento en primera compra',
                'Guía de beneficios exclusivos',
                'Sorpresa especial'
              ]
            };
          }
        } catch (error) {
          console.warn('No se pudo obtener welcome package', error);
        }

        const userData = {
          id: clienteId,
          nombre: cliente.nombre || '',
          apellido: cliente.apellido || '',
          email: cliente.email || '',
          telefono: cliente.telefono || '',
          direccion: cliente.direccion || '',
          ciudad: cliente.ciudad || '',
          codigoPostal: cliente.codigoPostal || cliente.codigo_postal || cliente.codigo || '',
          fechaRegistro: cliente.fechaRegistro || '',
          puntosLealtad: puntosLealtad,
          welcomePackage: welcomePackage
        };
        
        setCustomerData(userData);
        return { success: true, message: 'Login exitoso' };
      }
      
      return { success: false, message: response?.message || 'Error en el login' };
    } catch (error) {
      return { success: false, message: error.message || 'Error al iniciar sesión' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      const key = `notif_read_${customerData?.id || 'anon'}`;
      sessionStorage.removeItem(key);
    } catch {
      // ignore sessionStorage errors
    }
    localStorage.removeItem('token');
    setCustomerData(null);
    navigate('/login');
  };

  const refreshCustomerData = async () => {
    if (!customerData?.id) return;

    try {
      let puntosLealtad = customerData.puntosLealtad;
      try {
        const loyaltyData = await apiService.getLoyaltyPoints(customerData.email);
        puntosLealtad = loyaltyData.puntos || loyaltyData.totalPuntos || loyaltyData.points || 0;
      } catch (error) {
        console.warn('No se pudieron refrescar puntos', error);
      }

      let welcomePackage = customerData.welcomePackage;
      try {
        const packageData = await apiService.getWelcomePackage(customerData.email);
        if (packageData) {
          welcomePackage = {
            descripcion: 'Paquete de Bienvenida Premium',
            tracking: packageData.trackingNumber,
            estado: packageData.estado,
            fechaCreacion: packageData.fechaCreacion 
              ? new Date(packageData.fechaCreacion).toLocaleDateString('es-ES')
              : new Date().toLocaleDateString('es-ES'),
            direccion: customerData.direccion || '',
            ciudad: customerData.ciudad || '',
            codigoPostal: customerData.codigoPostal || '',
            contenido: [
              'Sanduchera eléctrica de regalo',
              'Tarjeta de Cliente Premium',
              'Cupón de 15% descuento en primera compra',
              'Guía de beneficios exclusivos',
              'Sorpresa especial'
            ]
          };
        }
      } catch (error) {
        console.warn('No se pudo refrescar paquete', error);
      }

      setCustomerData(prev => ({
        ...prev,
        puntosLealtad,
        welcomePackage
      }));
    } catch (error) {
      console.error('Error refrescando datos:', error);
    }
  };

  const value = {
    customerData,
    login,
    logout,
    refreshCustomerData,
    loading,
    // IMPORTANTE: Considerar autenticado si hay token O customerData
    isAuthenticated: Boolean(apiService.getToken()) || Boolean(customerData),
    checked
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}