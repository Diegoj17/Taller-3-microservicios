import React, { useEffect, useState } from 'react';
import { ShoppingCart, Gift, Package, User, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/useAuth.jsx';
import apiService from '../services/apiService';

export default function Dashboard({ onNavigateToShipping }) {
  const { customerData, refreshCustomerData } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [realTimePoints, setRealTimePoints] = useState(0);

  // Función para obtener puntos en tiempo real
  const fetchRealTimePoints = async () => {
    if (!customerData?.email) return;
    
    try {
      console.log('📨 Solicitando puntos para:', customerData.email);
      const puntos = await apiService.getRealTimeLoyaltyPoints(customerData.email);
      console.log('✅ Puntos recibidos:', puntos);
      setRealTimePoints(puntos);
    } catch (error) {
      console.error('❌ Error obteniendo puntos:', error);
      // Si hay error, usar los puntos de customerData como fallback
      setRealTimePoints(customerData?.puntosLealtad || 0);
    }
  };

  useEffect(() => {
    document.title = 'Inicio | Supermercado Premium';
    
    // Obtener puntos al cargar el componente
    if (customerData?.email) {
      fetchRealTimePoints();
    }
  }, [customerData?.email]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshCustomerData();
      await fetchRealTimePoints();
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error refrescando datos:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Refrescar datos automáticamente cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (customerData?.email) {
        console.log('🔄 Actualizando datos automáticamente...');
        fetchRealTimePoints();
        setLastUpdate(new Date());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [customerData?.email]);

  // Obtener estado del envío
  const getShippingStatus = () => {
    const estado = customerData?.welcomePackage?.estado;
    
    if (!estado) {
      return 'En preparación';
    }
    
    const estadosMap = {
      'Pendiente': 'Pendiente',
      'En preparación': 'En Preparación',
      'En tránsito': 'En Tránsito',
      'Entregado': 'Entregado',
      'pendiente': 'Pendiente',
      'en_preparacion': 'En Preparación',
      'en_transito': 'En Tránsito',
      'entregado': 'Entregado',
      'PENDIENTE': 'Pendiente',
      'EN_PREPARACION': 'En Preparación',
      'EN_TRANSITO': 'En Tránsito',
      'ENTREGADO': 'Entregado'
    };
    
    return estadosMap[estado] || estado;
  };

  // Obtener nivel según puntos - USAR realTimePoints en lugar de customerData.puntosLealtad
  const getLoyaltyLevel = (puntos) => {
    const puntosReales = realTimePoints > 0 ? realTimePoints : puntos;
    if (puntosReales >= 1000) return { nivel: 'Diamante', color: '#10B981' };
    if (puntosReales >= 500) return { nivel: 'Oro', color: '#F59E0B' };
    if (puntosReales >= 100) return { nivel: 'Plata', color: '#6B7280' };
    return { nivel: 'Bronce', color: '#92400E' };
  };

  // Usar realTimePoints si están disponibles, sino customerData.puntosLealtad
  const puntosMostrar = realTimePoints > 0 ? realTimePoints : (customerData?.puntosLealtad || 0);
  const loyaltyLevel = getLoyaltyLevel(puntosMostrar);

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.dashboardHeader}>
        <div>
          <h2 style={styles.dashboardTitle}>
            ¡Bienvenido de vuelta, {customerData?.nombre}!
          </h2>
          <p style={styles.dashboardSubtitle}>
            ID: {customerData?.id} | Cliente preferente desde {customerData?.fechaRegistro || new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
        <button 
          style={styles.refreshButton}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={18} style={refreshing ? styles.refreshingIcon : {}} />
          {refreshing ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      <div style={styles.statsGrid}>
        {/* Tarjeta de Puntos de Lealtad */}
        <div style={styles.statCard}>
          <div style={styles.statIconWrapper}>
            <Gift size={32} color="white" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statLabel}>Puntos Premium</div>
            <div style={styles.statValue}>{puntosMostrar}</div>
            <div style={{...styles.statLevel, color: loyaltyLevel.color}}>
              Nivel {loyaltyLevel.nivel}
            </div>
            <div style={styles.statHint}>
              {puntosMostrar > 0 
                ? `${500 - (puntosMostrar % 500)} puntos para próximo nivel`
                : 'Acumula puntos con tus compras'
              }
            </div>
          </div>
        </div>

        {/* Tarjeta de Kit de Bienvenida */}
        <div style={styles.statCard}>
          <div style={{...styles.statIconWrapper, background: 'linear-gradient(135deg, #38BDF8 0%, #7DD3FC 100%)'}}>
            <Package size={32} color="white" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statLabel}>Kit de Bienvenida</div>
            <div style={styles.statValue}>
              {getShippingStatus()}
            </div>
            <div style={styles.statHint}>
              {customerData?.welcomePackage?.fechaCreacion 
                ? `Creado: ${customerData.welcomePackage.fechaCreacion}`
                : 'Llega pronto a tu hogar'
              }
            </div>
          </div>
        </div>

        {/* Tarjeta de Compras */}
        <div style={styles.statCard}>
          <div style={{...styles.statIconWrapper, background: 'linear-gradient(135deg, #455A64 0%, #607D8B 100%)'}}>
            <ShoppingCart size={32} color="white" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statLabel}>Compras este mes</div>
            <div style={styles.statValue}>0</div>
            <div style={styles.statHint}>¡Empieza a ahorrar hoy!</div>
          </div>
        </div>

        {/* Tarjeta de Información del Cliente */}
        <div style={styles.statCard}>
          <div style={{...styles.statIconWrapper, background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)'}}>
            <User size={32} color="white" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statLabel}>Código del Cliente</div>
            <div style={styles.statValue}>{customerData?.id || 'N/A'}</div>
            <div style={styles.statHint}>Tu identificador único</div>
          </div>
        </div>
      </div>

      {/* Información de última actualización */}
      <div style={styles.updateInfo}>
        <span style={styles.updateText}>
          Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
        </span>
      </div>

      {/* Sección de Welcome Package */}
      {customerData?.welcomePackage ? (
        <div style={styles.welcomeAlert}>
          <div style={styles.alertIconLarge}>
            <Gift size={32} color="#FF5742" />
          </div>
          <div style={styles.alertContent}>
            <div style={styles.alertTitle}>
              {customerData.welcomePackage.descripcion || 'Paquete de Bienvenida Premium'}
            </div>
            <p style={styles.alertText}>
              Como nuevo cliente premium, hemos preparado un kit especial para ti
              {customerData.welcomePackage.contenido && customerData.welcomePackage.contenido.length > 0 && (
                <>
                  {' '}que incluye <strong>{customerData.welcomePackage.contenido[0]}</strong>
                  {customerData.welcomePackage.contenido.length > 1 && 
                    ` y otros beneficios como ${customerData.welcomePackage.contenido.slice(1, 3).join(', ')}`
                  }
                </>
              )}
              . Disfruta de tus descuentos y puntos de bienvenida.
            </p>
            {customerData.welcomePackage.tracking && (
              <p style={styles.alertTracking}>
                <strong>Número de seguimiento:</strong> {customerData.welcomePackage.tracking}
              </p>
            )}
            <button 
              style={styles.alertButton}
              onClick={onNavigateToShipping}
              onMouseEnter={(e) => {
                e.target.style.background = '#FF5742';
                e.target.style.color = 'white';
                e.target.style.borderColor = '#FF5742';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#FF5742';
                e.target.style.borderColor = 'rgba(255,87,66,0.15)';
              }}
            >
              Rastrear Mi Pedido
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.welcomeAlert}>
          <div style={styles.alertIconLarge}>
            <Package size={32} color="#38BDF8" />
          </div>
          <div style={styles.alertContent}>
            <div style={styles.alertTitle}>Tu kit de bienvenida está en preparación</div>
            <p style={styles.alertText}>
              Estamos preparando tu paquete de bienvenida especial. 
              Recibirás una notificación cuando esté listo para ser enviado.
            </p>
          </div>
        </div>
      )}

      <style>{keyframes}</style>
    </div>
  );
}

const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
`;

const styles = {
  dashboardContainer: {
    animation: 'fadeIn 0.6s ease-out',
    width: '100%',
    background: 'transparent',
  },
  dashboardHeader: {
    marginBottom: '40px',
    padding: '2rem',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
    borderRadius: '24px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  dashboardTitle: {
    fontSize: '48px',
    fontWeight: '800',
    background: '#000000',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
    margin: '0 0 8px 0',
    lineHeight: '1.1'
  },
  dashboardSubtitle: {
    fontSize: '15px',
    color: '#5B6B70',
    margin: 0
  },
  refreshButton: {
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #FF6A52 0%, #FF3D2E 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    minWidth: '140px',
    justifyContent: 'center',
    opacity: 1
  },
  refreshingIcon: {
    animation: 'spin 1s linear infinite'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
    marginBottom: '16px',
    alignItems: 'stretch'
  },
  statCard: {
    background: 'linear-gradient(180deg, #ffffff 0%, #fbfbfb 100%)',
    padding: '26px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    boxShadow: '0 12px 30px rgba(16,24,32,0.12)',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 16px 40px rgba(16,24,32,0.15)'
    }
  },
  statIconWrapper: {
    width: '72px',
    height: '72px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #FF6A52 0%, #FF3D2E 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  statContent: {
    flex: 1
  },
  statLabel: {
    fontSize: '14px',
    color: '#000000',
    marginBottom: '8px',
    fontWeight: '500'
  },
  statValue: {
    fontSize: '30px',
    fontWeight: '700',
    color: '#000000',
    marginBottom: '4px'
  },
  statLevel: {
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '4px'
  },
  statHint: {
    fontSize: '13px',
    color: '#000000',
    marginTop: '4px'
  },
  updateInfo: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  updateText: {
    fontSize: '12px',
    color: '#64748B',
    fontStyle: 'italic'
  },
  welcomeAlert: {
    background: 'linear-gradient(180deg, rgba(255,87,66,0.06) 0%, rgba(255,87,66,0.03) 100%)',
    border: '1px solid rgba(255,87,66,0.14)',
    borderRadius: '16px',
    padding: '28px',
    display: 'flex',
    gap: '20px',
    marginBottom: '40px',
    alignItems: 'center',
    boxShadow: '0 10px 30px rgba(16,24,32,0.08)'
  },
  alertIconLarge: {
    width: '72px',
    height: '72px',
    borderRadius: '12px',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 6px 18px rgba(16,24,32,0.08)'
  },
  alertContent: {
    flex: 1,
    minWidth: 0
  },
  alertTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#000000',
    marginBottom: '8px'
  },
  alertText: {
    fontSize: '15px',
    color: '#000000',
    marginBottom: '10px',
    margin: '0 0 10px 0',
    lineHeight: '1.6'
  },
  alertTracking: {
    fontSize: '15px',
    color: '#000000',
    marginBottom: '16px',
    margin: '0 0 16px 0',
    fontFamily: 'monospace',
    fontWeight: 600
  },
  alertButton: {
    padding: '12px 20px',
    background: 'transparent',
    color: '#FF5742',
    border: '2px solid rgba(255,87,66,0.15)',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};