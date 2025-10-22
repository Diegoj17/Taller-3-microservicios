import React, { useEffect, useState, useCallback } from 'react';
import { Gift, MapPin, Clock, Truck, CheckCircle, RefreshCw } from 'lucide-react';
import apiService from '../services/apiService';

export default function Shipping({ customerData }) {
  const [welcomePackage, setWelcomePackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Pedido | Supermercado Premium';
    loadWelcomePackage();
    
    // Configurar polling automático cada 20 segundos (sincronizado con el backend)
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(() => {
        console.log('🔄 Actualización automática del estado del paquete');
        loadWelcomePackage();
      }, 20000); // 20 segundos - sincronizado con el backend
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [customerData, autoRefresh]);

  const loadWelcomePackage = useCallback(async () => {
    if (!customerData?.email) {
      console.log('❌ No hay email en customerData:', customerData);
      setLoading(false);
      return;
    }

    try {
      console.log('📦 Cargando paquete para email:', customerData.email);
      
      // Obtener el paquete del cliente por email
      const packageData = await apiService.getWelcomePackage(customerData.email);
      
      console.log('✅ Datos del paquete recibidos:', packageData);
      
      if (packageData && packageData.id) {
        // Formatear los datos para el frontend
        const formattedPackage = {
          id: packageData.id,
          clienteId: packageData.clienteId,
          email: packageData.email,
          tracking: packageData.trackingNumber,
          trackingNumber: packageData.trackingNumber,
          estado: packageData.estado,
          fechaCreacion: packageData.fechaCreacion 
            ? new Date(packageData.fechaCreacion).toLocaleDateString('es-ES')
            : new Date().toLocaleDateString('es-ES'),
          descripcion: 'Paquete de Bienvenida Premium (incluye sanduchera eléctrica)',
          direccion: customerData.direccion,
          ciudad: customerData.ciudad,
          codigoPostal: customerData.codigoPostal
        };
        
        setWelcomePackage(formattedPackage);
        setError(null);
      } else {
        console.log('📦 No se encontró paquete para este cliente');
        setWelcomePackage(null);
        setError('No se encontró un paquete de bienvenida para tu cuenta.');
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('❌ Error cargando welcome package:', error);
      
      if (error.message.includes('404') || error.message.includes('No se encontró')) {
        setError('Aún no se ha creado tu paquete de bienvenida. Por favor, contacta con soporte.');
      } else {
        setError('Error al cargar la información del paquete.');
      }
      
      setWelcomePackage(null);
    } finally {
      setLoading(false);
    }
  }, [customerData]);

  // Función para actualizar manualmente
  const handleManualRefresh = async () => {
    setLoading(true);
    await loadWelcomePackage();
  };

  // Mapear estados del backend a español
  const getEstadoTraducido = (estado) => {
    const estadosMap = {
      'Pendiente': 'PENDIENTE',
      'En preparación': 'EN PREPARACIÓN',
      'En tránsito': 'EN TRÁNSITO',
      'Entregado': 'ENTREGADO'
    };
    return estadosMap[estado] || estado?.toUpperCase() || 'PENDIENTE';
  };

  // Determinar el estado actual para la línea de tiempo
  const getCurrentStateKey = () => {
    if (!welcomePackage?.estado) return 'creado';
    
    const estadoMap = {
      'Pendiente': 'creado',
      'En preparación': 'preparacion',
      'En tránsito': 'transito',
      'Entregado': 'entregado'
    };
    
    return estadoMap[welcomePackage.estado] || 'creado';
  };

  // Calcular fecha estimada basada en el estado actual
  const getEstimatedDate = () => {
    if (!welcomePackage) {
      return 'Por confirmar';
    }

    const hoy = new Date();
    const estimada = new Date(hoy);

    switch (welcomePackage.estado) {
      case 'Pendiente':
        estimada.setDate(estimada.getDate() + 5);
        break;
      case 'En preparación':
        estimada.setDate(estimada.getDate() + 3);
        break;
      case 'En tránsito':
        estimada.setDate(estimada.getDate() + 1);
        break;
      case 'Entregado':
        return '¡Entregado!';
      default:
        estimada.setDate(estimada.getDate() + 5);
    }

    return estimada.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Obtener fecha de creación formateada
  const getFechaCreacion = () => {
    if (welcomePackage?.fechaCreacion) {
      return welcomePackage.fechaCreacion;
    }
    
    if (customerData?.fechaRegistro) {
      return customerData.fechaRegistro;
    }
    
    return new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Obtener dirección completa
  const getFullAddress = () => {
    const direccion = customerData.direccion || 'No especificada';
    const ciudad = customerData.ciudad;
    const codigoPostal = customerData.codigoPostal;
    
    let fullAddress = direccion;
    
    if (ciudad) {
      if (codigoPostal) {
        fullAddress += `, ${ciudad} - CP: ${codigoPostal}`;
      } else {
        fullAddress += `, ${ciudad}`;
      }
    }
    
    return fullAddress;
  };

  // Contenido del paquete (sin los 500 puntos)
  const getPackageContent = () => {
    return [
      'Sanduchera eléctrica de regalo',
      'Tarjeta de Cliente Premium',
      'Cupón de 15% descuento en primera compra',
      'Guía de beneficios exclusivos',
      'Sorpresa especial'
    ];
  };

  // Formatear última actualización
  const getLastUpdatedText = () => {
    if (!lastUpdated) return '';
    return `Actualizado: ${lastUpdated.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })}`;
  };

  if (loading && !welcomePackage) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Cargando información del envío...</p>
      </div>
    );
  }

  const currentStateKey = getCurrentStateKey();
  const contenido = getPackageContent();

  return (
    <div style={styles.shippingContainer}>
      {/* Header con controles de actualización */}
      <div style={styles.controlsHeader}>
        <div style={styles.controlsLeft}>
          <span style={styles.lastUpdated}>{getLastUpdatedText()}</span>
        </div>
        <div style={styles.controlsRight}>
          <label style={styles.autoRefreshLabel}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={styles.checkbox}
            />
            Actualización automática
          </label>
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            style={{
              ...styles.refreshButton,
              ...(loading ? styles.refreshButtonDisabled : {})
            }}
          >
            <RefreshCw size={16} style={{ marginRight: '6px' }} />
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      <div style={styles.packageCard}>
        <div style={styles.packageHeader}>
          <div style={styles.packageHeaderLeft}>
            <div style={styles.packageIconLarge}>
              <Gift size={40} color="white" />
            </div>
            <div>
              <div style={styles.packageTitle}>
                Paquete de Bienvenida Premium (incluye sanduchera eléctrica)
              </div>
              <div style={styles.packageTracking}>
                Tracking: {welcomePackage?.trackingNumber || 'Generando...'}
              </div>
            </div>
          </div>
          <div style={styles.statusBadge}>
            <Clock size={18} style={{ marginRight: '8px' }} />
            {getEstadoTraducido(welcomePackage?.estado)}
          </div>
        </div>

        <div style={styles.packageBody}>
          <div style={styles.infoSection}>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>
                <MapPin size={18} style={{ marginRight: '8px' }} />
                Dirección de Entrega
              </div>
              <div style={styles.infoValue}>
                {getFullAddress()}
              </div>
            </div>

            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>
                <Clock size={18} style={{ marginRight: '8px' }} />
                Envío Creado
              </div>
              <div style={styles.infoValue}>
                {getFechaCreacion()}
              </div>
            </div>

            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>
                <Truck size={18} style={{ marginRight: '8px' }} />
                Entrega Estimada
              </div>
              <div style={styles.infoValue}>
                {getEstimatedDate()}
              </div>
            </div>
          </div>

          {/* Contenido del paquete */}
          <div style={styles.contentSection}>
            <div style={styles.contentHeader}>
              <Gift size={24} color="#FF5742" style={{ marginRight: '12px' }} />
              <div style={styles.contentTitle}>Contenido del Paquete</div>
            </div>
            <div style={styles.contentList}>
              {contenido.map((item, index) => (
                <div key={index} style={styles.contentItem}>
                  <CheckCircle size={18} color="#10B981" style={{ marginRight: '12px', flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline de envío */}
          <div style={styles.timelineSection}>
            <div style={styles.timelineTitle}>Estado del Envío</div>
            <div style={styles.timeline}>
              {/* Pedido Creado */}
              <div style={{
                ...styles.timelineItem,
                ...(currentStateKey === 'creado' || currentStateKey === 'preparacion' || 
                    currentStateKey === 'transito' || currentStateKey === 'entregado' 
                    ? styles.timelineItemActive : {})
              }}>
                <div style={{
                  ...styles.timelineDot,
                  ...(currentStateKey === 'creado' || currentStateKey === 'preparacion' || 
                      currentStateKey === 'transito' || currentStateKey === 'entregado' 
                      ? styles.timelineDotActive : {})
                }}>
                  <div style={styles.timelineDotInner}></div>
                </div>
                <div style={styles.timelineContent}>
                  <div style={styles.timelineLabel}>Pedido Creado</div>
                  <div style={styles.timelineDate}>
                    {getFechaCreacion()}
                  </div>
                </div>
              </div>

              {/* En Preparación */}
              <div style={{
                ...styles.timelineItem,
                ...(currentStateKey === 'preparacion' || currentStateKey === 'transito' || 
                    currentStateKey === 'entregado' 
                    ? styles.timelineItemActive : {})
              }}>
                <div style={{
                  ...styles.timelineDot,
                  ...(currentStateKey === 'preparacion' || currentStateKey === 'transito' || 
                      currentStateKey === 'entregado' 
                      ? styles.timelineDotActive : {})
                }}>
                  <div style={styles.timelineDotInner}></div>
                </div>
                <div style={styles.timelineContent}>
                  <div style={styles.timelineLabel}>En Preparación</div>
                  <div style={styles.timelineDate}>
                    {currentStateKey === 'preparacion' || currentStateKey === 'transito' || 
                     currentStateKey === 'entregado' ? 'En progreso' : 'Pendiente'}
                  </div>
                </div>
              </div>

              {/* En Tránsito */}
              <div style={{
                ...styles.timelineItem,
                ...(currentStateKey === 'transito' || currentStateKey === 'entregado' 
                    ? styles.timelineItemActive : {})
              }}>
                <div style={{
                  ...styles.timelineDot,
                  ...(currentStateKey === 'transito' || currentStateKey === 'entregado' 
                      ? styles.timelineDotActive : {})
                }}>
                  <div style={styles.timelineDotInner}></div>
                </div>
                <div style={styles.timelineContent}>
                  <div style={styles.timelineLabel}>En Tránsito</div>
                  <div style={styles.timelineDate}>
                    {currentStateKey === 'transito' || currentStateKey === 'entregado' ? 'En camino' : 'Pendiente'}
                  </div>
                </div>
              </div>

              {/* Entregado */}
              <div style={{
                ...styles.timelineItem,
                ...(currentStateKey === 'entregado' ? styles.timelineItemActive : {})
              }}>
                <div style={{
                  ...styles.timelineDot,
                  ...(currentStateKey === 'entregado' ? styles.timelineDotActive : {})
                }}>
                  <div style={styles.timelineDotInner}></div>
                </div>
                <div style={styles.timelineContent}>
                  <div style={styles.timelineLabel}>Entregado</div>
                  <div style={styles.timelineDate}>
                    {currentStateKey === 'entregado' ? '¡Completado!' : 'Pendiente'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nota sobre actualización automática */}
          <div style={styles.noteSection}>
            <div style={styles.note}>
              <Clock size={16} style={{ marginRight: '8px', flexShrink: 0 }} />
              <span>El estado se actualiza automáticamente cada 20 segundos</span>
            </div>
          </div>
        </div>
      </div>

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
`;

const styles = {
  shippingContainer: {
    animation: 'fadeIn 0.6s ease-out',
    width: '100%',
    marginTop: '1rem'
  },
  controlsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    padding: '0 0.5rem'
  },
  controlsLeft: {
    flex: 1
  },
  lastUpdated: {
    fontSize: '12px',
    color: '#64748B',
    fontStyle: 'italic'
  },
  controlsRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  autoRefreshLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#64748B',
    cursor: 'pointer'
  },
  checkbox: {
    marginRight: '6px'
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px',
    background: '#38BDF8',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  refreshButtonDisabled: {
    background: '#CBD5E1',
    cursor: 'not-allowed',
    opacity: 0.6
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #E2E8F0',
    borderTop: '4px solid #FF5742',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  loadingText: {
    fontSize: '16px',
    color: '#64748B',
    fontWeight: '600'
  },
  packageCard: {
    background: 'white',
    borderRadius: '24px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    marginBottom: '30px'
  },
  packageHeader: {
    background: 'linear-gradient(135deg, #FF5742 0%, #FF6B5B 100%)',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  packageHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  packageIconLarge: {
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  packageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '8px'
  },
  packageTracking: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'monospace',
    fontWeight: '600'
  },
  statusBadge: {
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '24px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    letterSpacing: '0.5px'
  },
  packageBody: {
    padding: '40px'
  },
  infoSection: {
    marginBottom: '40px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px 0',
    borderBottom: '1px solid #E2E8F0'
  },
  infoLabel: {
    fontSize: '15px',
    color: '#000000',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center'
  },
  infoValue: {
    fontSize: '16px',
    color: '#000000',
    fontWeight: '600',
    textAlign: 'right',
    maxWidth: '60%'
  },
  contentSection: {
    background: 'linear-gradient(135deg, #FFF4F2 0%, #FFE8E5 100%)',
    border: '2px solid #FF5742',
    padding: '28px',
    borderRadius: '16px',
    marginBottom: '40px'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px'
  },
  contentTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#000000'
  },
  contentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  contentItem: {
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: '15px',
    color: '#455A64',
    fontWeight: '500',
    lineHeight: '1.5'
  },
  timelineSection: {
    marginTop: '40px'
  },
  timelineTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#455A64',
    marginBottom: '24px'
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  timelineItem: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    paddingBottom: '8px'
  },
  timelineDot: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
    zIndex: 2
  },
  timelineDotActive: {
    background: 'linear-gradient(135deg, #38BDF8 0%, #7DD3FC 100%)',
    boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)'
  },
  timelineDotInner: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#94A3B8'
  },
  timelineContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  timelineLabel: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#37474F',
    marginBottom: '2px'
  },
  timelineDate: {
    fontSize: '13px',
    color: '#94A3B8'
  },
  timelineItemActive: {
    opacity: 1
  },
  noteSection: {
    marginTop: '30px',
    padding: '16px',
    background: '#F8FAFC',
    borderRadius: '12px',
    border: '1px solid #E2E8F0'
  },
  note: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#64748B',
    fontWeight: '500'
  }
};