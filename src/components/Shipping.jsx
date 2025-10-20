import React, { useEffect } from 'react';
import { Gift, MapPin, Clock, Truck, CheckCircle, Package } from 'lucide-react';

export default function Shipping({ customerData }) {
  useEffect(() => {
    document.title = 'Pedido | Supermercado Premium';
  }, []);
  const welcomePackage = customerData.welcomePackage;

  return (
    <div style={styles.shippingContainer}>

      <div style={styles.packageCard}>
        <div style={styles.packageHeader}>
          <div style={styles.packageHeaderLeft}>
            <div style={styles.packageIconLarge}>
              <Gift size={40} color="white" />
            </div>
            <div>
              <div style={styles.packageTitle}>{welcomePackage.descripcion}</div>
              <div style={styles.packageTracking}>Tracking: {welcomePackage.tracking}</div>
            </div>
          </div>
          <div style={styles.statusBadge}>
            <Clock size={18} style={{ marginRight: '8px' }} />
            PENDIENTE
          </div>
        </div>

        <div style={styles.packageBody}>
          <div style={styles.infoSection}>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>
                <MapPin size={18} style={{ marginRight: '8px' }} />
                Dirección de Entrega
              </div>
              <div style={styles.infoValue}>{welcomePackage.direccion}</div>
            </div>

            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>
                <Clock size={18} style={{ marginRight: '8px' }} />
                Envío Creado
              </div>
              <div style={styles.infoValue}>{welcomePackage.fechaCreacion}</div>
            </div>

            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>
                <Truck size={18} style={{ marginRight: '8px' }} />
                Entrega Estimada
              </div>
              <div style={styles.infoValue}>{welcomePackage.estimado}</div>
            </div>
          </div>

          <div style={styles.contentSection}>
            <div style={styles.contentHeader}>
              <Gift size={28} color="#ff0000ff" style={{ marginRight: '12px' }} />
              <div style={styles.contentTitle}>Contenido de tu Regalo:</div>
            </div>
            <div style={styles.contentList}>
              {welcomePackage.contenido.map((item, index) => (
                <div key={index} style={styles.contentItem}>
                  <CheckCircle size={18} color="#38BDF8" style={{ marginRight: '10px', flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div style={styles.timelineSection}>
            <div style={styles.timelineTitle}>Estado del Envío:</div>
            <div style={styles.timeline}>
              <div style={{...styles.timelineItem, ...styles.timelineItemActive}}>
                <div style={{...styles.timelineDot, ...styles.timelineDotActive}}>
                  <CheckCircle size={20} color="white" />
                </div>
                <div style={styles.timelineContent}>
                  <div style={styles.timelineLabel}>Envío Creado</div>
                  <div style={styles.timelineDate}>{welcomePackage.fechaCreacion}</div>
                </div>
              </div>

              <div style={styles.timelineItem}>
                <div style={styles.timelineDot}>
                  <div style={styles.timelineDotInner}></div>
                </div>
                <div style={styles.timelineContent}>
                  <div style={styles.timelineLabel}>En Preparación</div>
                  <div style={styles.timelineDate}>Próximamente</div>
                </div>
              </div>

              <div style={styles.timelineItem}>
                <div style={styles.timelineDot}>
                  <div style={styles.timelineDotInner}></div>
                </div>
                <div style={styles.timelineContent}>
                  <div style={styles.timelineLabel}>En Tránsito</div>
                  <div style={styles.timelineDate}>Próximamente</div>
                </div>
              </div>

              <div style={styles.timelineItem}>
                <div style={styles.timelineDot}>
                  <div style={styles.timelineDotInner}></div>
                </div>
                <div style={styles.timelineContent}>
                  <div style={styles.timelineLabel}>Entregado</div>
                  <div style={styles.timelineDate}>Próximamente</div>
                </div>
              </div>
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
`;

const styles = {
  shippingContainer: {
    animation: 'fadeIn 0.6s ease-out',
    width: '100%',
    marginTop: '1rem'
  },
  shippingHeader: {
    marginBottom: '40px'
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
  helpSection: {
    background: 'linear-gradient(135deg, #E8F4FD 0%, #D0EBFF 100%)',
    border: '2px solid #38BDF8',
    borderRadius: '18px',
    padding: '24px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start'
  },
  helpIcon: {
    fontSize: '32px'
  },
  helpTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#455A64',
    marginBottom: '8px'
  },
  helpText: {
    fontSize: '15px',
    color: '#78909C',
    lineHeight: '1.6'
  }
};