import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, checked } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Cargando...</p>
      </div>
    );
  }

  // Solo redirigir al login si no está autenticado Y ya terminó de cargar
  if (!isAuthenticated && !loading && checked) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const styles = {
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
  }
};

export default ProtectedRoute;