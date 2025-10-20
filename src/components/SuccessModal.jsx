import React from 'react';
import { Gift, Star, Award, Zap } from 'lucide-react';
import Modal from './Modal';

const SuccessModal = ({ isOpen, onClose, customerData }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      type="gift"
      title="¡Registro Exitoso!"
      overlayClickClose={false}
    >
      <div style={successModalStyles.content}>
        <div style={successModalStyles.welcomeText}>
          Bienvenido a nuestra familia <strong>{customerData?.nombre} {customerData?.apellido}</strong>
        </div>
        
        <div style={successModalStyles.details}>
          <div style={successModalStyles.detailItem}>
            <span style={successModalStyles.detailLabel}>ID de Cliente:</span>
            <span style={successModalStyles.detailValue}>{customerData?.id}</span>
          </div>
          <div style={successModalStyles.detailItem}>
            <span style={successModalStyles.detailLabel}>Fecha de Registro:</span>
            <span style={successModalStyles.detailValue}>{customerData?.fechaRegistro}</span>
          </div>
        </div>

        <div style={successModalStyles.benefits}>
          <div style={successModalStyles.benefitsTitle}>
            <Zap size={20} style={successModalStyles.benefitsIcon} />
            Tus beneficios inmediatos
          </div>
          <div style={successModalStyles.benefitsList}>
            <div style={successModalStyles.benefitItem}>
              <Award size={18} style={successModalStyles.benefitIcon} />
              <span>500 puntos de bienvenida</span>
            </div>
            <div style={successModalStyles.benefitItem}>
              <Gift size={18} style={successModalStyles.benefitIcon} />
              <span>10% de descuento en tu primera compra</span>
            </div>
            <div style={successModalStyles.benefitItem}>
              <Star size={18} style={successModalStyles.benefitIcon} />
              <span>Acceso a ofertas exclusivas</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={successModalStyles.ctaButton}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 12px 30px rgba(255, 87, 66, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 6px 20px rgba(255, 87, 66, 0.3)';
          }}
        >
          Comenzar a Comprar
        </button>

        <div style={successModalStyles.footerText}>
          Te hemos enviado un email de confirmación
        </div>
      </div>
    </Modal>
  );
};

const successModalStyles = {
  content: {
    padding: '0'
  },
  welcomeText: {
    fontSize: '18px',
    color: '#475569',
    textAlign: 'center',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  details: {
    background: '#F8FAFC',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px'
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #E2E8F0'
  },
  detailItemLast: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0'
  },
  detailLabel: {
    color: '#64748B',
    fontSize: '14px',
    fontWeight: '500'
  },
  detailValue: {
    color: '#1E293B',
    fontSize: '14px',
    fontWeight: '600'
  },
  benefits: {
    marginBottom: '28px'
  },
  benefitsTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: '#1E293B',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px'
  },
  benefitsIcon: {
    color: '#FF5742'
  },
  benefitsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#475569',
    fontSize: '14px',
    padding: '8px 0'
  },
  benefitIcon: {
    color: '#10B981',
    flexShrink: 0
  },
  ctaButton: {
    width: '100%',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #FF5742 0%, #FF6B5B 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '16px',
    boxShadow: '0 6px 20px rgba(255, 87, 66, 0.3)'
  },
  footerText: {
    fontSize: '14px',
    color: '#94A3B8',
    textAlign: 'center',
    fontStyle: 'italic'
  }
};

export default SuccessModal;