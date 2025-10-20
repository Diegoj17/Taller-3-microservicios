import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, Gift } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  type = 'success',
  showCloseButton = true,
  overlayClickClose = true 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && overlayClickClose) {
      onClose();
    }
  };

  const getIcon = () => {
    const iconProps = { size: 64, strokeWidth: 1.5 };
    
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} style={styles.iconSuccess} />;
      case 'error':
        return <AlertCircle {...iconProps} style={styles.iconError} />;
      case 'warning':
        return <AlertCircle {...iconProps} style={styles.iconWarning} />;
      case 'info':
        return <Info {...iconProps} style={styles.iconInfo} />;
      case 'gift':
        return <Gift {...iconProps} style={styles.iconGift} />;
      default:
        return <CheckCircle {...iconProps} style={styles.iconSuccess} />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      case 'warning': return '#F59E0B';
      case 'info': return '#3B82F6';
      case 'gift': return '#FF5742';
      default: return '#10B981';
    }
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={{...styles.content, borderTop: `4px solid ${getBorderColor()}`}}>
        {showCloseButton && (
          <button 
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.background = '#F1F5F9';
              e.target.style.color = '#64748B';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
              e.target.style.color = '#64748B';
            }}
          >
            <X size={20} />
          </button>
        )}
        
        <div style={styles.iconContainer}>
          {getIcon()}
        </div>

        {title && (
          <h2 style={styles.title}>
            {title}
          </h2>
        )}

        <div style={styles.children}>
          {children}
        </div>
      </div>

      <style>{modalKeyframes}</style>
    </div>
  );
};

const modalKeyframes = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes iconBounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translateY(0) scale(1);
    }
    40%, 43% {
      transform: translateY(-10px) scale(1.1);
    }
    70% {
      transform: translateY(-5px) scale(1.05);
    }
  }
`;

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    animation: 'fadeIn 0.3s ease-out',
    padding: '20px'
  },
  content: {
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
    borderRadius: '24px',
    padding: '48px 40px 40px 40px',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    animation: 'modalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#64748B',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    fontSize: '20px'
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
    animation: 'iconBounce 1s ease-in-out'
  },
  iconSuccess: {
    color: '#10B981'
  },
  iconError: {
    color: '#EF4444'
  },
  iconWarning: {
    color: '#F59E0B'
  },
  iconInfo: {
    color: '#3B82F6'
  },
  iconGift: {
    color: '#FF5742'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: '16px',
    lineHeight: '1.3'
  },
  children: {
    color: '#64748B',
    textAlign: 'center',
    fontSize: '16px',
    lineHeight: '1.6'
  }
};

export default Modal;