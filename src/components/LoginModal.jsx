import React from 'react';
import { CheckCircle, User, Mail } from 'lucide-react';
import Modal from './Modal';

const LoginModal = ({ isOpen, onClose, userData }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      type="success"
      title="¡Bienvenido de Nuevo!"
    >
      <div style={loginModalStyles.content}>
        <div style={loginModalStyles.welcomeText}>
          Hola <strong>{userData?.firstName}</strong>, has iniciado sesión correctamente.
        </div>
        
        <div style={loginModalStyles.userInfo}>
          <div style={loginModalStyles.infoItem}>
            <User size={18} style={loginModalStyles.infoIcon} />
            <span>{userData?.firstName} {userData?.lastName}</span>
          </div>
          <div style={loginModalStyles.infoItem}>
            <Mail size={18} style={loginModalStyles.infoIcon} />
            <span>{userData?.email}</span>
          </div>
        </div>

        <div style={loginModalStyles.features}>
          <div style={loginModalStyles.featureItem}>
            <CheckCircle size={16} style={loginModalStyles.featureIcon} />
            <span>Acceso a tu perfil completo</span>
          </div>
          <div style={loginModalStyles.featureItem}>
            <CheckCircle size={16} style={loginModalStyles.featureIcon} />
            <span>Historial de compras</span>
          </div>
          <div style={loginModalStyles.featureItem}>
            <CheckCircle size={16} style={loginModalStyles.featureIcon} />
            <span>Puntos de fidelidad</span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={loginModalStyles.continueButton}
        >
          Continuar
        </button>
      </div>
    </Modal>
  );
};

const loginModalStyles = {
  content: {
    padding: '0'
  },
  welcomeText: {
    fontSize: '16px',
    color: '#475569',
    textAlign: 'center',
    marginBottom: '20px',
    lineHeight: '1.5'
  },
  userInfo: {
    background: '#F8FAFC',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '20px'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    color: '#475569',
    fontSize: '14px'
  },
  infoIcon: {
    color: '#64748B'
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '24px'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#475569',
    fontSize: '14px'
  },
  featureIcon: {
    color: '#10B981'
  },
  continueButton: {
    width: '100%',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};

export default LoginModal;