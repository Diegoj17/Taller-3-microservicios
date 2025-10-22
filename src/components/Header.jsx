import React, { useState, useRef, useEffect } from 'react';
import { Home, Package, LogOut, Bell } from 'lucide-react';

export default function Header({ currentView, onNavigate, onLogout, customerData }) {
  const [openNotifications, setOpenNotifications] = useState(false);
  const welcome = customerData?.welcomePackage || customerData?.envio;
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  // Estado para controlar si hay notificaciones sin leer (se resetea cada sesión)
  const [unread, setUnread] = useState(false);

  // Key para sessionStorage por cliente
  const notifKey = `notif_read_${customerData?.id || 'anon'}`;

  // Inicializar unread leyendo sessionStorage; si no hay flag, mostrar
  useEffect(() => {
    const dismissed = sessionStorage.getItem(notifKey) === '1';
    setUnread(Boolean(welcome) && !dismissed);
  }, [welcome, notifKey]);

  // Cerrar panel al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (!panelRef.current) return;
      if (buttonRef.current && buttonRef.current.contains(e.target)) return;
      if (!panelRef.current.contains(e.target)) {
        setOpenNotifications(false);
      }
    }
    if (openNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openNotifications]);
  
  const getAvatarContent = () => {
    if (customerData?.genero === 'mujer') {
      return '👩';
    }
    return '👨';
  };

  const getInitials = () => {
    if (!customerData) return 'U';
    return `${customerData.nombre?.charAt(0) || ''}${customerData.apellido?.charAt(0) || ''}`.toUpperCase();
  };

  // Manejar click en el botón de notificaciones
  const handleNotificationClick = () => {
    setOpenNotifications(!openNotifications);
    // Marcar como leído cuando se abre
    if (!openNotifications) {
      setUnread(false);
      try {
        sessionStorage.setItem(notifKey, '1');
      } catch {
        // ignore sessionStorage errors
      }
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContent}>
        {/* Logo y Brand */}
        <div style={styles.navBrandSection}>
          <div style={styles.navLogo}>
            <img src="/img/tienda.png" alt="Logo" width="48" height="48" />
            <div style={styles.brandText}>
              <span style={styles.brandMain}>Supermercado</span>
              <span style={styles.brandSub}>Premium</span>
            </div>
          </div>
        </div>

        {/* Navegación Central */}
        <div style={styles.navCenter}>
          <button 
            style={{
              ...styles.navLink,
              ...(currentView === 'dashboard' ? styles.navLinkActive : {})
            }}
            onClick={() => onNavigate('dashboard')}
          >
            <Home size={20} style={styles.navIcon} />
            Inicio
            {currentView === 'dashboard' && <div style={styles.activeIndicator}></div>}
          </button>
          
          <button 
            style={{
              ...styles.navLink,
              ...(currentView === 'shipping' ? styles.navLinkActive : {})
            }}
            onClick={() => onNavigate('shipping')}
          >
            <Package size={20} style={styles.navIcon} />
            Mi Paquete
            {currentView === 'shipping' && <div style={styles.activeIndicator}></div>}
          </button>
        </div>

        {/* User Menu */}
        <div style={styles.userSection}>
          {/* Notificaciones */}
          <div style={{ position: 'relative' }} ref={panelRef}>
            <button 
              ref={buttonRef} 
              style={styles.iconButton} 
              onClick={handleNotificationClick}
              aria-expanded={openNotifications} 
              aria-label="Notificaciones"
            >
              <Bell size={20} color="#64748B" />
              {/* Mostrar badge solo si hay notificación Y no se ha leído en esta sesión */}
              {welcome && unread && (
                <div style={styles.notificationBadge}>1</div>
              )}
            </button>

            {openNotifications && (
              <div style={styles.notificationPanel} role="dialog" aria-label="Notificaciones de pedido">
                <div style={styles.notificationHeader}>
                  <div style={styles.notificationTitle}>Notificaciones</div>
                </div>

                <div style={styles.notificationBody}>
                  <div style={styles.notificationMessageTitle}>
                    {welcome?.descripcion || 'Paquete de Bienvenida Premium (incluye sanduchera eléctrica)'}
                  </div>
                  <div style={styles.notificationMeta}>
                    <span style={styles.notificationState}>
                      {welcome?.estado || 'pendiente'}
                    </span>
                    {welcome?.fechaCreacion && (
                      <span style={styles.notificationTime}>{welcome.fechaCreacion}</span>
                    )}
                  </div>
                </div>

                <div style={styles.notificationActions}>
                  <button
                    style={styles.viewButton}
                    onClick={() => { 
                      setOpenNotifications(false); 
                      onNavigate('shipping'); 
                    }}
                  >
                    Ver pedido
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar y Info */}
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {customerData ? (customerData.genero ? getAvatarContent() : getInitials()) : 'U'}
            </div>
            <div style={styles.userDetails}>
              <div style={styles.userName}>
                {customerData?.nombre} {customerData?.apellido}
              </div>
              <div style={styles.userRole}>
                Cliente Premium
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            style={styles.logoutButton}
            onClick={onLogout}
            title="Cerrar Sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    padding: '0.5rem 0'
  },
  navContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem'
  },
  navBrandSection: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none'
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1.2'
  },
  brandMain: {
    fontSize: '22px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #FF5742 0%, #FF6B5B 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px'
  },
  brandSub: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: '1px'
  },
  navCenter: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  navLink: {
    position: 'relative',
    padding: '12px 24px',
    background: 'transparent',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#000000',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none'
  },
  navLinkActive: {
    background: 'linear-gradient(135deg, #FFF4F2 0%, #FFE8E5 100%)',
    color: '#FF5742',
    boxShadow: '0 4px 15px rgba(255, 87, 66, 0.15)'
  },
  navIcon: {
    flexShrink: 0
  },
  activeIndicator: {
    position: 'absolute',
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: '#FF5742'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexShrink: 0
  },
  iconButton: {
    position: 'relative',
    padding: '10px',
    background: 'transparent',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#64748B'
  },
  notificationBadge: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    background: '#FF5742',
    color: 'white',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '11px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'pulse 2s infinite'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    margin: '0 0.5rem'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #38BDF8 0%, #7DD3FC 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)'
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: '1.2'
  },
  userRole: {
    fontSize: '12px',
    color: '#64748B',
    fontWeight: '500'
  },
  logoutButton: {
    padding: '10px',
    background: 'linear-gradient(135deg, #FF5742 0%, #FF6B5B 100%)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(255, 87, 66, 0.3)'
  },
  notificationPanel: {
    position: 'absolute',
    right: 0,
    top: '48px',
    width: '280px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
    padding: '12px',
    zIndex: 2000
  },
  notificationHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '8px',
    borderBottom: '1px solid #EEF2F7'
  },
  notificationTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1F2937'
  },
  notificationBody: {
    padding: '12px 8px'
  },
  notificationMessageTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '8px',
    lineHeight: '1.4'
  },
  notificationMeta: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '4px'
  },
  notificationState: {
    background: '#FEF3C7',
    color: '#92400E',
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '999px',
    fontWeight: '600'
  },
  notificationTime: {
    fontSize: '11px',
    color: '#94A3B8'
  },
  notificationActions: {
    padding: '8px 8px 4px 8px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  viewButton: {
    background: 'linear-gradient(135deg, #38BDF8 0%, #06B6D4 100%)',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '12px'
  }
};

// Agregar animación pulse para el badge
const hoverStyles = `
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
  }
  
  .nav-link:hover {
    background: #F8FAFC;
    color: #37474F;
    transform: translateY(-1px);
  }
  
  .icon-button:hover {
    background: #F8FAFC;
    transform: scale(1.05);
  }
`;

if (typeof document !== 'undefined') {
  const STYLE_ID = 'app-hover-styles';
  if (!document.getElementById(STYLE_ID)) {
    const styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    styleEl.type = 'text/css';
    styleEl.appendChild(document.createTextNode(hoverStyles));
    document.head.appendChild(styleEl);
  }
}