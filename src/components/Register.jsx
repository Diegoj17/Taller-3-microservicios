import React, { useState, useEffect } from 'react';
import { User, Gift, Package, CheckCircle, Mail, Phone, MapPin, CreditCard, Eye, EyeOff, Lock } from 'lucide-react';
import ApiService from '../services/apiService';

export default function CustomerRegistration({ onRegister }) {
  useEffect(() => {
    document.title = 'Crear cuenta | Supermercado Premium';
  }, []);
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
  });
  // customerData now stored in modalInfo.data when needed
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [modalInfo, setModalInfo] = useState({ open: false, type: '', message: '', data: null });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneChange = (e) => {
    // strip non-digits and limit to 10 characters
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({
      ...formData,
      telefono: digits
    });
  };

  const onlyLettersAndSpaces = (str) => {
    return str.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
  };

  const handleNameChange = (e) => {
    const clean = onlyLettersAndSpaces(e.target.value);
    setFormData({ ...formData, nombre: clean });
  };

  const handleLastNameChange = (e) => {
    const clean = onlyLettersAndSpaces(e.target.value);
    setFormData({ ...formData, apellido: clean });
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordChecks({
      length: val.length >= 8,
      uppercase: /[A-Z]/.test(val),
      number: /[0-9]/.test(val),
      special: /[^A-Za-z0-9]/.test(val)
    });
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

const handleSubmit = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Preparar datos para el microservicio de clientes
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        password: password
      };

      // 1. Registrar el cliente en el microservicio de clientes
      const registerResponse = await ApiService.register(userData);

      // 2. Enviar email de bienvenida (no bloqueante)
      try {
        await ApiService.sendWelcomeEmail({
          to: formData.email,
          name: `${formData.nombre} ${formData.apellido}`,
          clientId: registerResponse.client?._id || registerResponse.client?.id || `CL-${Math.floor(10000 + Math.random() * 90000)}`
        });
      } catch (emailError) {
        console.warn('Email de bienvenida no pudo ser enviado:', emailError.message);
      }

      // Preparar datos para mostrar en la UI
      const newCustomer = {
        id: registerResponse.client?._id || registerResponse.client?.id || `CL-${Math.floor(10000 + Math.random() * 90000)}`,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        puntosLealtad: 0,
        fechaRegistro: new Date().toLocaleDateString('es-ES'),
        envio: {
          estado: 'pendiente',
          tracking: `PKG-${Math.floor(100000 + Math.random() * 900000)}`,
          descripcion: 'Paquete de Bienvenida'
        }
      };

  // Guardar datos en el modalInfo para mostrarlos
  // setCustomerData(newCustomer);
  // Mostrar modal de éxito
  setModalInfo({ open: true, type: 'success', message: 'Registro exitoso', data: newCustomer });
  if (typeof onRegister === 'function') onRegister(newCustomer);
  setStep('success');

    } catch (error) {
      console.error('Error en el registro:', error);
      setErrorMessage(error.message || 'Error al registrar el cliente. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    const pwdValid = Object.values(passwordChecks).every(Boolean) && password && (password === confirmPassword);
    return (
      formData.nombre &&
      formData.apellido &&
      formData.email &&
      formData.telefono &&
      formData.direccion &&
      pwdValid
    );
  };

  const handleCloseModal = () => {
    // Si era un modal de éxito, resetear el formulario y volver al paso inicial
    if (modalInfo.type === 'success') {
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
      });
      setPassword('');
      setConfirmPassword('');
      setStep('form');
    }
    // Cerrar cualquier modal
    setModalInfo({ open: false, type: '', message: '', data: null });
  };

  return (
    <div style={styles.container}>
      {step === 'form' ? (
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <div style={styles.logoWrapper}>
              <img src="/img/tienda.png" alt="Supermercado Logo" width="80" height="80" />
            </div>
            <h1 style={styles.formTitle}>
              Únete a Nuestro Supermercado
            </h1>
            <p style={styles.formSubtitle}>
              Regístrate y comienza a acumular puntos en cada compra
            </p>
          </div>

          {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}

          <div>
            <div style={styles.gridTwo}>
              <div>
                <label style={styles.label}>Nombre *</label>
                <div style={styles.inputWrapper}>
                  <User size={20} style={styles.inputIcon} />
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleNameChange}
                    placeholder="Tu nombre"
                    style={styles.input}
                    onPaste={(e) => {
                      const paste = (e.clipboardData || window.clipboardData).getData('text');
                      const clean = onlyLettersAndSpaces(paste);
                      e.preventDefault();
                      const newVal = (formData.nombre + clean).slice(0, 1000);
                      setFormData({ ...formData, nombre: newVal });
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#FF5742'}
                    onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                  />
                </div>
              </div>

              <div>
                <label style={styles.label}>Apellido *</label>
                <div style={styles.inputWrapper}>
                  <User size={20} style={styles.inputIcon} />
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleLastNameChange}
                    placeholder="Tu apellido"
                    style={styles.input}
                    onPaste={(e) => {
                      const paste = (e.clipboardData || window.clipboardData).getData('text');
                      const clean = onlyLettersAndSpaces(paste);
                      e.preventDefault();
                      const newVal = (formData.apellido + clean).slice(0, 1000);
                      setFormData({ ...formData, apellido: newVal });
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#FF5742'}
                    onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                  />
                </div>
              </div>
            </div>

            <div style={styles.gridTwo}>
              <div>
                <label style={styles.label}>Correo Electrónico *</label>
                <div style={styles.inputWrapper}>
                  <Mail size={20} style={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    style={styles.input}
                    onFocus={(e) => e.target.style.borderColor = '#FF5742'}
                    onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                  />
                </div>
              </div>

              <div>
                <label style={styles.label}>Teléfono *</label>
                <div style={styles.inputWrapper}>
                  <Phone size={20} style={styles.inputIcon} />
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handlePhoneChange}
                    placeholder="3001234567"
                    style={styles.input}
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]*"
                    onPaste={(e) => {
                      // sanitize pasted content to digits only
                      const paste = (e.clipboardData || window.clipboardData).getData('text');
                      const digits = paste.replace(/\D/g, '').slice(0, 10);
                      e.preventDefault();
                      const newVal = (formData.telefono + digits).slice(0,10);
                      setFormData({ ...formData, telefono: newVal });
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#FF5742'}
                    onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                  />
                </div>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Dirección *</label>
              <div style={styles.inputWrapper}>
                <MapPin size={20} style={styles.inputIcon} />
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  placeholder="Calle 123 # 45-67"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#FF5742'}
                  onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                />
              </div>
            </div>

            <div style={styles.gridTwo}>
            <div>
              <label style={styles.label}>Ciudad *</label>
              <input
                type="text"
                value={formData.ciudad}
                onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                placeholder="Tu ciudad"
                style={styles.inputSimple}
                onFocus={(e) => e.target.style.borderColor = '#FF5742'}
                onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
              />
            </div>

            <div>
              <label style={styles.label}>Código Postal</label>
              <input
                type="text"
                value={formData.codigoPostal}
                onChange={(e) => setFormData({...formData, codigoPostal: e.target.value})}
                placeholder="110111"
                style={styles.inputSimple}
                onFocus={(e) => e.target.style.borderColor = '#FF5742'}
                onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
              />
            </div>
          </div>

            <div style={styles.gridTwo}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Contraseña *</label>
                <div style={{ position: 'relative' }}>
                  <div style={styles.inputWrapper}>
                    <Lock size={20} style={styles.inputIcon} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
                      onFocus={(e) => { 
                        setPasswordFocused(true); 
                        e.target.style.borderColor = '#FF5742'; 
                      }}
                      onBlur={(e) => { 
                        setTimeout(() => setPasswordFocused(false), 200); 
                        e.target.style.borderColor = '#CBD5E1'; 
                      }}
                      placeholder="Ingresa tu contraseña"
                      style={styles.input}
                    />
                    {password.length > 0 && (
                      <div style={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </div>
                    )}
                  </div>
                  
                  {passwordFocused && (
                    <div style={styles.passwordChecksFloating}>
                      <div style={styles.checksTitle}>Requisitos de contraseña:</div>
                      <div style={{...styles.checkItem, ...(passwordChecks.length ? styles.checkItemValid : {})}}>
                        <span style={styles.checkBullet}>{passwordChecks.length ? '✓' : '○'}</span>
                        Al menos 8 caracteres
                      </div>
                      <div style={{...styles.checkItem, ...(passwordChecks.uppercase ? styles.checkItemValid : {})}}>
                        <span style={styles.checkBullet}>{passwordChecks.uppercase ? '✓' : '○'}</span>
                        Una letra mayúscula
                      </div>
                      <div style={{...styles.checkItem, ...(passwordChecks.number ? styles.checkItemValid : {})}}>
                        <span style={styles.checkBullet}>{passwordChecks.number ? '✓' : '○'}</span>
                        Un número
                      </div>
                      <div style={{...styles.checkItem, ...(passwordChecks.special ? styles.checkItemValid : {})}}>
                        <span style={styles.checkBullet}>{passwordChecks.special ? '✓' : '○'}</span>
                        Un carácter especial
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirmar Contraseña *</label>
                <div style={styles.inputWrapper}>
                  <Lock size={20} style={styles.inputIcon} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onFocus={(e) => e.target.style.borderColor = '#FF5742'}
                    onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                    placeholder="Repite tu contraseña"
                    style={styles.input}
                  />
                  {confirmPassword.length > 0 && (
                    <div style={styles.passwordToggle} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  )}
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <div style={styles.passwordMismatch}>Las contraseñas no coinciden</div>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              style={{
                ...styles.submitButton,
                background: isFormValid() && !isSubmitting ? 'linear-gradient(135deg, #FF5742 0%, #FF6B5B 100%)' : '#CBD5E1',
                cursor: isFormValid() && !isSubmitting ? 'pointer' : 'not-allowed',
                boxShadow: isFormValid() && !isSubmitting ? '0 6px 20px rgba(255, 87, 66, 0.35)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (isFormValid() && !isSubmitting) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(255, 87, 66, 0.45)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = isFormValid() && !isSubmitting ? '0 6px 20px rgba(255, 87, 66, 0.35)' : 'none';
              }}
            >
              {isSubmitting ? 'Creando...' : 'Crear Mi Cuenta'}
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.successCard}>
          
        </div>
      )}

      {modalInfo.open && (
        <div style={modalStyles.backdrop} onClick={handleCloseModal}>
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <h3 style={{ margin: 0 }}>{modalInfo.type === 'success' ? '¡Éxito!' : 'Error'}</h3>
            </div>
            <div style={modalStyles.body}>
              <p>{modalInfo.message}</p>
              {modalInfo.type === 'success' && modalInfo.data && (
                <div style={modalStyles.details}>
                  <div><strong>ID:</strong> {modalInfo.data.id}</div>
                  <div><strong>Tracking:</strong> {modalInfo.data.envio?.tracking}</div>
                </div>
              )}
            </div>
            <div style={modalStyles.footer}>
              <button onClick={handleCloseModal} style={modalStyles.button}>Cerrar</button>
            </div>
          </div>
        </div>
      )}


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

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
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

  errorMessage: {
    color: '#FF5742',
    backgroundColor: '#FFE5E0',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    fontWeight: '500'
  },
  formCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '2rem 2rem 2rem 2rem',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.25)',
    animation: 'slideIn 0.6s ease-out'
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: '48px'
  },
  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
    animation: 'float 3s ease-in-out infinite'
  },
  formTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#FF5742',
    marginBottom: '12px',
    margin: '0 0 12px 0'
  },
  formSubtitle: {
    color: '#000000',
    fontSize: '17px',
    margin: 0,
    marginBottom: '-1rem'
  },
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#000000',
    fontWeight: '600',
    fontSize: '15px'
  },
  inputWrapper: {
    position: 'relative'
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '60%',
    color: '#FF5742',
    transform: 'translateY(-50%)',
    pointerEvents: 'none'
  },
  input: {
    width: '100%',
    padding: '1rem 1rem 1rem 2.8rem',
    border: '2px solid #CBD5E1',
    borderRadius: '14px',
    fontSize: '16px',
    transition: 'all 0.3s',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'white',
    color: '#000000',
    marginBottom: '-0.8rem'
  },
  inputGroup: {
    marginBottom: '24px'
  },
  inputSimple: {
    width: '100%',
    padding: '1rem 1rem 1rem 1rem',
    border: '2px solid #CBD5E1',
    borderRadius: '14px',
    fontSize: '16px',
    transition: 'all 0.3s',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'white',
    color: '#000000'
  },
  submitButton: {
    width: '100%',
    padding: '18px',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '17px',
    fontWeight: '700',
    transition: 'all 0.3s',
    letterSpacing: '0.5px',
    marginTop: '12px'
  },
  passwordToggle: {
    position: 'absolute',
    right: '12px',
    top: '75%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#FF5742',
    zIndex: 10
  },
  passwordChecksFloating: {
    position: 'absolute',
    left: '-342.5px',
    top: '0',
    width: '270px',
    background: 'white',
    border: '2px solid #FF5742',
    padding: '18px',
    borderRadius: '14px',
    boxShadow: '0 10px 30px rgba(255, 87, 66, 0.25)',
    animation: 'slideInLeft 0.3s ease-out',
    zIndex: 1000
  },
  checksTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#000000',
    marginBottom: '14px',
    borderBottom: '2px solid #FF5742',
    paddingBottom: '10px'
  },
  checkItem: {
    fontSize: '14px',
    color: '#000000',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease'
  },
  checkBullet: {
    marginRight: '10px',
    fontSize: '18px',
    fontWeight: '700',
    minWidth: '22px',
    color: '#0073ffff'
  },
  checkItemValid: {
    color: '#FF5742',
    fontWeight: '600'
  },
  passwordMismatch: {
    fontSize: '13px',
    color: '#FF5742',
    marginTop: '1rem',
    fontWeight: '600',
    marginLeft: '4px',
    marginBottom: '-2rem'
  },
  successCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '60px',
    maxWidth: '900px',
    width: '100%',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.25)',
    animation: 'slideIn 0.6s ease-out'
  },
  successHeader: {
    textAlign: 'center',
    marginBottom: '48px'
  },
  successIcon: {
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
    color: '#FF5742',
    marginBottom: '12px',
    margin: '0 0 12px 0'
  },
  successSubtitle: {
    color: '#000000',
    fontSize: '18px',
    margin: 0
  },
  customerCard: {
    background: 'linear-gradient(135deg, #455A64 0%, #607D8B 100%)',
    borderRadius: '18px',
    padding: '28px',
    marginBottom: '28px',
    color: 'white',
    boxShadow: '0 8px 24px rgba(69, 90, 100, 0.2)'
  },
  customerInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px'
  },
  customerLabel: {
    fontSize: '15px',
    opacity: 0.9,
    fontWeight: '500'
  },
  customerValue: {
    fontSize: '19px',
    fontWeight: '700'
  },
  customerDateValue: {
    fontSize: '17px',
    fontWeight: '600'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '36px'
  },
  pointsCard: {
    background: 'linear-gradient(135deg, #FF5742 0%, #FF6B5B 100%)',
    borderRadius: '18px',
    padding: '32px',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(255, 87, 66, 0.3)'
  },
  cardIcon: {
    marginBottom: '16px'
  },
  pointsLabel: {
    fontSize: '16px',
    opacity: 0.95,
    marginBottom: '12px',
    fontWeight: '500'
  },
  pointsValue: {
    fontSize: '48px',
    fontWeight: '700',
    letterSpacing: '-1px'
  },
  pointsSubtext: {
    fontSize: '14px',
    opacity: 0.9,
    marginTop: '12px'
  },
  shippingCard: {
    background: 'linear-gradient(135deg, #38BDF8 0%, #7DD3FC 100%)',
    borderRadius: '18px',
    padding: '32px',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(56, 189, 248, 0.3)'
  },
  shippingLabel: {
    fontSize: '16px',
    opacity: 0.95,
    marginBottom: '12px',
    fontWeight: '500'
  },
  shippingStatus: {
    background: 'rgba(255, 255, 255, 0.25)',
    padding: '10px 20px',
    borderRadius: '24px',
    fontSize: '15px',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: '12px',
    display: 'inline-block',
    letterSpacing: '0.5px'
  },
  shippingDescription: {
    fontSize: '14px',
    opacity: 0.9
  },
  trackingCard: {
    background: '#F1F5F9',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '28px'
  },
  trackingTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#455A64',
    marginBottom: '16px'
  },
  trackingContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  trackingLabel: {
    fontSize: '14px',
    color: '#78909C',
    marginBottom: '4px'
  },
  trackingNumber: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#455A64'
  },
  newCustomerButton: {
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

const modalStyles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  modal: {
    width: '420px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    overflow: 'hidden'
  },
  header: {
    padding: '18px 20px',
    borderBottom: '1px solid #eee'
  },
  body: {
    padding: '18px 20px'
  },
  details: {
    marginTop: '12px',
    fontSize: '14px',
    color: '#333'
  },
  footer: {
    padding: '12px 20px',
    borderTop: '1px solid #eee',
    textAlign: 'right'
  },
  button: {
    background: '#FF5742',
    color: 'white',
    border: 'none',
    padding: '10px 14px',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};