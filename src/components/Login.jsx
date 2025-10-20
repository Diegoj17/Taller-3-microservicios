import React, { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, LogIn, CheckCircle } from 'lucide-react';

export default function Login() {
  useEffect(() => {
    document.title = 'Iniciar sesión | Supermercado Premium';
  }, []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLogin = () => {
    if (!email || !password) return;
    
    setIsLoading(true);

    setTimeout(() => {
      const user = {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: email,
        id: 'CL-45782',
        puntosLealtad: 1250
      };
      
      setUserData(user);
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && email && password) {
      handleLogin();
    }
  };

  if (isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successHeader}>
            <div style={styles.successIconWrapper}>
              <CheckCircle size={60} color="white" strokeWidth={2.5} />
            </div>
            <h2 style={styles.successTitle}>¡Bienvenido de nuevo!</h2>
            <p style={styles.successSubtitle}>
              {userData.nombre} {userData.apellido}
            </p>
          </div>

          <div style={styles.userInfoCard}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>ID de Cliente</span>
              <span style={styles.infoValue}>{userData.id}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Correo Electrónico</span>
              <span style={styles.infoValue}>{userData.email}</span>
            </div>
          </div>

          <div style={styles.pointsCard}>
            <img src="/img/tienda.png" alt="Supermercado Logo" width="80" height="80" />
            <div style={styles.pointsLabel}>Puntos de Lealtad Disponibles</div>
            <div style={styles.pointsValue}>{userData.puntosLealtad.toLocaleString()}</div>
            <div style={styles.pointsSubtext}>¡Sigue comprando para ganar más!</div>
          </div>

          <button
            onClick={() => {
              setIsLoggedIn(false);
              setEmail('');
              setPassword('');
              setUserData(null);
            }}
            style={styles.logoutButton}
            onMouseEnter={(e) => {
              e.target.style.background = '#FF5742';
              e.target.style.color = 'white';
              e.target.style.borderColor = '#FF5742';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = '#FF5742';
              e.target.style.borderColor = '#FF5742';
            }}
          >
            Cerrar Sesión
          </button>
        </div>

        <style>{keyframes}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <img src="/img/tienda.png" alt="Supermercado Logo" width="80" height="80" />
          </div>
          <h1 style={styles.title}>Supermercado</h1>
          <p style={styles.subtitle}>Accede a tu cuenta de cliente</p>
        </div>

        <div style={styles.formContainer}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo Electrónico</label>
            <div style={styles.inputWrapper}>
              <Mail size={20} style={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="tu@email.com"
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#FF5742'}
                onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <div style={styles.inputWrapper}>
              <Lock size={20} style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="••••••••"
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#FF5742'}
                onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          <div style={styles.optionsRow}>
            <label style={styles.checkboxLabel}>
              
            </label>
            <a href="#" style={styles.forgotLink}>¿Olvidaste tu contraseña?</a>
          </div>

          <button
            onClick={handleLogin}
            disabled={!email || !password || isLoading}
            style={{
              ...styles.loginButton,
              background: email && password && !isLoading 
                ? 'linear-gradient(135deg, #FF5742 0%, #FF6B5B 100%)' 
                : '#CBD5E1',
              cursor: email && password && !isLoading ? 'pointer' : 'not-allowed',
              boxShadow: email && password && !isLoading 
                ? '0 6px 20px rgba(255, 87, 66, 0.35)' 
                : 'none'
            }}
            onMouseEnter={(e) => {
              if (email && password && !isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(255, 87, 66, 0.45)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = email && password && !isLoading 
                ? '0 6px 20px rgba(255, 87, 66, 0.35)' 
                : 'none';
            }}
          >
            {isLoading ? (
              <span>Verificando...</span>
            ) : (
              <>
                <LogIn size={20} style={{ marginRight: '10px' }} />
                Iniciar Sesión
              </>
            )}
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>o</span>
            <span style={styles.dividerLine}></span>
          </div>

          <div style={styles.registerSection}>
            <span style={styles.registerText}>¿No tienes una cuenta?</span>
            <a href="/register" style={styles.registerLink}>Regístrate aquí</a>
          </div>
        </div>
      </div>

      <style>{keyframes}</style>
    </div>
  );
}

const keyframes = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const styles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #455A64 0%, #607D8B 50%, #78909C 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loginCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '60px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.25)',
    animation: 'slideIn 0.6s ease-out'
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px'
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
    animation: 'float 3s ease-in-out infinite'
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#FF5742',
    marginBottom: '12px',
    margin: '0 0 12px 0'
  },
  subtitle: {
    color: '#000000',
    fontSize: '17px',
    margin: 0
  },
  formContainer: {
    width: '100%'
  },
  inputGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    color: '#000000',
    fontWeight: '600',
    fontSize: '15px'
  },
  inputWrapper: {
    position: 'relative',
    width: '100%'
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#FF5742',
    pointerEvents: 'none'
  },
  input: {
    width: '100%',
    padding: '16px 16px 16px 50px',
    border: '2px solid #CBD5E1',
    borderRadius: '14px',
    fontSize: '16px',
    transition: 'all 0.3s',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'white',
    color: '#000000'
  },
  eyeIcon: {
    position: 'absolute',
    right: '16px',
    top: '60%',
    transform: 'translateY(-50%)',
    color: '#FF5742',
    cursor: 'pointer',
    transition: 'color 0.3s'
  },
  optionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  checkbox: {
    marginRight: '10px',
    cursor: 'pointer',
    width: '18px',
    height: '18px'
  },
  checkboxText: {
    fontSize: '15px',
    color: '#455A64'
  },
  forgotLink: {
    fontSize: '15px',
    color: '#FF5742',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.3s'
  },
  loginButton: {
    width: '100%',
    padding: '16px',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '17px',
    fontWeight: '700',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '0.5px'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '36px 0',
    gap: '16px'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#CBD5E1'
  },
  dividerText: {
    color: '#78909C',
    fontSize: '15px',
    fontWeight: '600'
  },
  registerSection: {
    textAlign: 'center'
  },
  registerText: {
    color: '#78909C',
    fontSize: '15px',
    marginRight: '8px'
  },
  registerLink: {
    color: '#FF5742',
    fontSize: '15px',
    fontWeight: '700',
    textDecoration: 'none',
    transition: 'color 0.3s'
  },
  successCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '60px',
    maxWidth: '700px',
    width: '100%',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.25)',
    animation: 'slideIn 0.6s ease-out'
  },
  successHeader: {
    textAlign: 'center',
    marginBottom: '48px'
  },
  successIconWrapper: {
    width: '120px',
    height: '120px',
    background: 'linear-gradient(135deg, #38BDF8 0%, #7DD3FC 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 28px',
    animation: 'scaleIn 0.5s ease-out',
    boxShadow: '0 10px 30px rgba(56, 189, 248, 0.3)'
  },
  successTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#455A64',
    marginBottom: '12px',
    margin: '0 0 12px 0'
  },
  successSubtitle: {
    color: '#78909C',
    fontSize: '18px',
    margin: 0
  },
  userInfoCard: {
    background: 'linear-gradient(135deg, #455A64 0%, #607D8B 100%)',
    borderRadius: '18px',
    padding: '28px',
    marginBottom: '28px',
    color: 'white',
    boxShadow: '0 8px 24px rgba(69, 90, 100, 0.2)'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px'
  },
  infoLabel: {
    fontSize: '15px',
    opacity: 0.9,
    fontWeight: '500'
  },
  infoValue: {
    fontSize: '17px',
    fontWeight: '700'
  },
  pointsCard: {
    background: 'linear-gradient(135deg, #FF5742 0%, #FF6B5B 100%)',
    borderRadius: '18px',
    padding: '40px',
    color: 'white',
    textAlign: 'center',
    marginBottom: '36px',
    boxShadow: '0 8px 24px rgba(255, 87, 66, 0.3)'
  },
  pointsLabel: {
    fontSize: '16px',
    opacity: 0.95,
    marginBottom: '16px',
    marginTop: '20px',
    fontWeight: '500'
  },
  pointsValue: {
    fontSize: '54px',
    fontWeight: '700',
    marginBottom: '12px',
    letterSpacing: '-1px'
  },
  pointsSubtext: {
    fontSize: '15px',
    opacity: 0.9
  },
  logoutButton: {
    width: '100%',
    padding: '16px',
    background: 'white',
    color: '#FF5742',
    border: '2px solid #FF5742',
    borderRadius: '14px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    letterSpacing: '0.5px'
  }
};