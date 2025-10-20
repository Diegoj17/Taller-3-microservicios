import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import Shipping from '../components/Shipping';

export default function MainPage({ initialView = 'dashboard' }) {
  const [currentView, setCurrentView] = useState(initialView);
  
  // Datos de ejemplo más realistas
  const defaultCustomer = {
    id: 'CL-000011',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    email: 'carlos.rodriguez@email.com',
    telefono: '3001234567',
    direccion: 'Carrera 45 # 26-85, Bogotá',
    puntosLealtad: 0,
    fechaRegistro: '16/10/2024',
    genero: 'hombre', // 'hombre' o 'mujer'
    envio: { 
      estado: 'pendiente',
      tracking: 'PKG-583492', 
      descripcion: 'Paquete de Bienvenida Premium'
    },
    welcomePackage: { 
      tracking: 'PKG-583492', 
      descripcion: 'Paquete de Bienvenida Premium (incluye sanduchera eléctrica)', 
      contenido: [
        'Sanduchera eléctrica de regalo',
        'Tarjeta de Cliente Premium',
        'Cupón de 15% descuento en primera compra',
        '500 puntos de bonificación',
        'Guía de beneficios exclusivos',
        'Sorpresa especial'
      ], 
      fechaCreacion: '16/10/2024', 
      direccion: 'Carrera 45 # 26-85, Bogotá', 
      estimado: '20/10/2024',
      estado: 'pendiente'
    }
  };

  const [customerData, setCustomerData] = useState(defaultCustomer);

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleNavigateToShipping = () => {
    setCurrentView('shipping');
  };

  useEffect(() => {
    // Actualiza el título según la vista dentro de MainPage
    if (currentView === 'dashboard') {
      document.title = 'Inicio | Supermercado Premium';
    } else if (currentView === 'shipping') {
      document.title = 'Pedido | Supermercado Premium';
    }
  }, [currentView]);

  const handleLogout = () => {
    // Forzar recarga a /login (evita condiciones de carrera al desmontar componentes)
    window.location.href = '/login';
    // limpiar estado por si acaso (ejecuta después de la navegación)
    setTimeout(() => setCustomerData(null), 0);
  };

  return (
    <div style={styles.container}>
      <Header 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout}
        customerData={customerData}
      />

      <main style={styles.mainContent}>
        {currentView === 'dashboard' && customerData && (
          <Dashboard 
            customerData={customerData} 
            onNavigateToShipping={handleNavigateToShipping} 
          />
        )}
        {currentView === 'shipping' && customerData && (
          <Shipping customerData={customerData} />
        )}
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <span style={styles.footerText}>
            © 2025 Supermercado Premium. Todos los derechos reservados.
          </span>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)',
    display: 'flex',
    flexDirection: 'column'
  },
  mainContent: {
    flex: 1,
    padding: '1rem',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
  },
  footer: {
    background: 'linear-gradient(135deg, #455A64 0%, #37474F 100%)',
    color: 'white',
    padding: '1.5rem 1rem',
    marginTop: 'auto'
  },
  footerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  footerText: {
    fontSize: '14px',
    color: '#CBD5E1',
    fontWeight: '500'
  },
  footerLinks: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  },
  footerLink: {
    color: '#CBD5E1',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.3s ease',
    ':hover': {
      color: 'white'
    }
  }
};