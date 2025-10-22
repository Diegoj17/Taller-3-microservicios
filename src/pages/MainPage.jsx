import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import Shipping from '../components/Shipping';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.jsx';

export default function MainPage({ initialView = 'dashboard' }) {
  const [currentView, setCurrentView] = useState(initialView);
  const navigate = useNavigate();
  const { customerData, logout, loading } = useAuth();

  // Eliminar el efecto que redirige al login
  // La protección ya está manejada por ProtectedRoute

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleNavigateToShipping = () => {
    setCurrentView('shipping');
  };

  useEffect(() => {
    if (currentView === 'dashboard') {
      document.title = 'Inicio | Supermercado Premium';
    } else if (currentView === 'shipping') {
      document.title = 'Pedido | Supermercado Premium';
    }
  }, [currentView]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Cargando...</p>
      </div>
    );
  }

  if (!customerData) {
    return null;
  }

  return (
    <div style={styles.container}>
      <Header 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout}
        customerData={customerData}
      />

      <main style={styles.mainContent}>
        {currentView === 'dashboard' && (
          <Dashboard 
            customerData={customerData} 
            onNavigateToShipping={handleNavigateToShipping} 
          />
        )}
        {currentView === 'shipping' && (
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

      <style>{keyframes}</style>
    </div>
  );
}

const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

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
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)'
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #E2E8F0',
    borderTop: '4px solid #FF5742',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#64748B',
    fontWeight: '600'
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
  }
};