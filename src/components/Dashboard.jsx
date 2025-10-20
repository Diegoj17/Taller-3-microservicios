import React, { useEffect } from 'react';
import { ShoppingCart, Gift, Package, Box } from 'lucide-react';

export default function Dashboard({ customerData, onNavigateToShipping }) {
  useEffect(() => {
    document.title = 'Inicio | Supermercado Premium';
  }, []);
  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.dashboardHeader}>
        <div>
          <h2 style={styles.dashboardTitle}>¡Bienvenido de vuelta, {customerData.nombre}!</h2>
          <p style={styles.dashboardSubtitle}>
            ID: {customerData.id} | Cliente preferente desde {customerData.fechaRegistro}
          </p>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIconWrapper}>
            <Gift size={32} color="white" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statLabel}>Puntos Premium</div>
            <div style={styles.statValue}>{customerData.puntosLealtad}</div>
            <div style={styles.statHint}>¡Canjea por descuentos!</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statIconWrapper, background: 'linear-gradient(135deg, #38BDF8 0%, #7DD3FC 100%)'}}>
            <Package size={32} color="white" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statLabel}>Kit de Bienvenida</div>
            <div style={styles.statValue}>{customerData.welcomePackage && customerData.welcomePackage.fechaCreacion ? 'Envio creado' : 'En reparto'}</div>
            <div style={styles.statHint}>{customerData.welcomePackage && customerData.welcomePackage.fechaCreacion ? customerData.welcomePackage.fechaCreacion : 'Llega pronto a tu hogar'}</div>
          </div>
        </div>

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
      </div>

      <div style={styles.welcomeAlert}>
        <div style={styles.alertIconLarge}>
          <Gift size={32} color="#FF5742" />
        </div>
        <div style={styles.alertContent}>
          <div style={styles.alertTitle}>{customerData.welcomePackage.descripcion}</div>
          <p style={styles.alertText}>
            Como nuevo cliente premium, hemos preparado un kit especial para ti que incluye <strong>{customerData.welcomePackage.contenido[0]}</strong> y otros beneficios como {customerData.welcomePackage.contenido.slice(1).join(', ')}. Disfruta de tus descuentos y puntos de bienvenida.
          </p>
          <p style={styles.alertTracking}>
            <strong>Número de seguimiento:</strong> {customerData.welcomePackage.tracking}
          </p>
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

      <style>{keyframes}</style>
    </div>
  );
}

const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
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
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
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
    transition: 'transform 0.25s ease, box-shadow 0.25s ease'
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
    color: '#000000'
  },
  statHint: {
    fontSize: '13px',
    color: '#000000',
    marginTop: '4px'
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
  },
  actionsSection: {
    marginTop: '40px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#455A64',
    marginBottom: '24px',
    margin: '0 0 24px 0'
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px'
  },
  actionCard: {
    background: 'linear-gradient(180deg, #ffffff 0%, #fbfbfb 100%)',
    padding: '28px',
    borderRadius: '14px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(16,24,32,0.06)',
    cursor: 'pointer',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease'
  },
  actionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#455A64',
    marginTop: '16px',
    marginBottom: '8px'
  },
  actionDescription: {
    fontSize: '14px',
    color: '#78909C'
  }
};