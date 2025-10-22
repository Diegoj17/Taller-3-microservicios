import React, { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.jsx';
import Modal from './Modal';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    document.title = 'Iniciar sesión | Supermercado Premium';
    
    // Si ya está autenticado, redirigir a main
    if (isAuthenticated) {
      navigate('/main');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    if (!email || !password || isLoading) return;
    
    setIsLoading(true);
    setError('');
    setShowErrorModal(false);

    try {
      const credentials = {
        email: email,
        contrasenia: password
      };

      // Usar el login del contexto
      const result = await login(credentials);
      
      if (result.success) {
        navigate('/main');
      } else {
        throw new Error(result.message || 'Error en el inicio de sesión');
      }
      
    } catch (error) {
      
      let friendlyMessage = 'Ocurrió un error al iniciar sesión.';
      
      if (error.message.includes('no encontrado') || error.message.includes('404')) {
        friendlyMessage = 'Usuario no encontrado. Verifica tu correo electrónico.';
      } else if (error.message.includes('Contraseña incorrecta') || error.message.includes('401')) {
        friendlyMessage = 'Contraseña incorrecta. Por favor, intenta nuevamente.';
      } else if (error.message.includes('500')) {
        friendlyMessage = 'Error del servidor. Por favor, intenta más tarde.';
      } else if (error.message.includes('Network Error') || error.message.includes('ECONNREFUSED')) {
        friendlyMessage = 'No se puede conectar al servidor. Verifica tu conexión a internet.';
      } else if (error.message) {
        friendlyMessage = error.message;
      }
      
      setError(friendlyMessage);
      setTimeout(() => {
        setShowErrorModal(true);
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && email && password && !isLoading) {
      handleLogin();
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setTimeout(() => {
      setError('');
    }, 300);
  };

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
                disabled={isLoading || authLoading}
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
                disabled={isLoading || authLoading}
              />
              <div
                onClick={() => !isLoading && setShowPassword(!showPassword)}
                style={{
                  ...styles.eyeIcon,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={!email || !password || isLoading || authLoading}
            style={{
              ...styles.loginButton,
              background: email && password && !isLoading && !authLoading
                ? 'linear-gradient(135deg, #FF5742 0%, #FF6B5B 100%)' 
                : '#CBD5E1',
              cursor: email && password && !isLoading && !authLoading ? 'pointer' : 'not-allowed',
              boxShadow: email && password && !isLoading && !authLoading
                ? '0 6px 20px rgba(255, 87, 66, 0.35)' 
                : 'none',
              opacity: isLoading || authLoading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (email && password && !isLoading && !authLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(255, 87, 66, 0.45)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = email && password && !isLoading && !authLoading
                ? '0 6px 20px rgba(255, 87, 66, 0.35)' 
                : 'none';
            }}
          >
            <LogIn size={20} style={{ marginRight: '10px' }} />
            {isLoading || authLoading ? 'Verificando...' : 'Iniciar Sesión'}
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

      {showErrorModal && error && (
        <Modal
          isOpen={true}
          onClose={handleCloseErrorModal}
          title="Error en el inicio de sesión"
          type="error"
        >
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 20px 0', color: '#475569', fontSize: '14px', lineHeight: '1.5' }}>
              {error}
            </p>
            <button
              onClick={handleCloseErrorModal}
              style={{
                padding: '10px 20px',
                background: '#FF5742',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Entendido
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #455A64 0%, #607D8B 50%, #78909C 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px',
    boxSizing: 'border-box'
  },
  loginCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.25)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#FF5742',
    marginBottom: '10px',
    margin: '0 0 10px 0'
  },
  subtitle: {
    color: '#000000',
    fontSize: '16px',
    margin: 0
  },
  formContainer: {
    width: '100%'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#000000',
    fontWeight: '600',
    fontSize: '14px'
  },
  inputWrapper: {
    position: 'relative',
    width: '100%'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#FF5742',
    pointerEvents: 'none'
  },
  input: {
    width: '100%',
    padding: '14px 14px 14px 40px',
    border: '2px solid #CBD5E1',
    borderRadius: '12px',
    fontSize: '15px',
    transition: 'all 0.3s',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'white',
    color: '#000000'
  },
  eyeIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#FF5742',
    transition: 'color 0.3s'
  },
  loginButton: {
    width: '100%',
    padding: '14px',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '0.5px',
    minHeight: '50px',
    marginBottom: '20px'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '30px 0',
    gap: '12px'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#CBD5E1'
  },
  dividerText: {
    color: '#78909C',
    fontSize: '14px',
    fontWeight: '600'
  },
  registerSection: {
    textAlign: 'center'
  },
  registerText: {
    color: '#78909C',
    fontSize: '14px',
    marginRight: '6px'
  },
  registerLink: {
    color: '#FF5742',
    fontSize: '14px',
    fontWeight: '700',
    textDecoration: 'none',
    transition: 'color 0.3s'
  }
};