import { useState } from "react";
import axios from "axios";

function Register({ setAuthPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const register = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password
      });
      alert("Registration successful! Please login.");
      setAuthPage("login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px'
    },
    blob1: {
      position: 'absolute',
      top: '0',
      left: '-50px',
      width: '400px',
      height: '400px',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      animation: 'blob 7s infinite'
    },
    blob2: {
      position: 'absolute',
      top: '0',
      right: '-50px',
      width: '400px',
      height: '400px',
      background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      animation: 'blob 7s infinite 2s'
    },
    blob3: {
      position: 'absolute',
      bottom: '-100px',
      left: '100px',
      width: '400px',
      height: '400px',
      background: 'radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      animation: 'blob 7s infinite 4s'
    },
    blob4: {
      position: 'absolute',
      bottom: '0',
      right: '100px',
      width: '400px',
      height: '400px',
      background: 'radial-gradient(circle, rgba(79, 70, 229, 0.4) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      animation: 'blob 7s infinite 6s'
    },
    gridPattern: {
      position: 'absolute',
      inset: '0',
      backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
      backgroundSize: '50px 50px',
      opacity: '0.3'
    },
    cardWrapper: {
      position: 'relative',
      zIndex: '10',
      width: '100%',
      maxWidth: '450px',
      margin: '0 auto'
    },
    cardGlow: {
      position: 'absolute',
      inset: '0',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.3))',
      filter: 'blur(40px)',
      transform: 'scale(1.1)',
      zIndex: '-1'
    },
    card: {
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      overflow: 'hidden'
    },
    topBar: {
      height: '8px',
      background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)'
    },
    cardContent: {
      padding: '40px'
    },
    logoWrapper: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '30px'
    },
    logoGlow: {
      position: 'relative'
    },
    logoGlowEffect: {
      position: 'absolute',
      inset: '0',
      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
      borderRadius: '16px',
      filter: 'blur(20px)',
      opacity: '0.6'
    },
    logo: {
      position: 'relative',
      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
      padding: '16px',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: '12px',
      letterSpacing: '-0.5px'
    },
    subtitle: {
      color: '#bfdbfe',
      fontSize: '14px',
      fontWeight: '500'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#bfdbfe',
      marginBottom: '10px',
      marginLeft: '4px'
    },
    inputWrapper: {
      position: 'relative'
    },
    iconBadge: {
      position: 'absolute',
      top: '50%',
      left: '16px',
      transform: 'translateY(-50%)',
      background: 'rgba(59, 130, 246, 0.2)',
      padding: '6px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: '2'
    },
    input: {
      width: '100%',
      paddingLeft: '56px',
      paddingRight: '16px',
      paddingTop: '14px',
      paddingBottom: '14px',
      background: 'rgba(15, 23, 42, 0.85)',
      border: '1.5px solid rgba(255, 255, 255, 0.35)',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: '15px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    inputFocused: {
      background: 'rgba(255, 255, 255, 0.2)',
      borderColor: '#60a5fa',
      boxShadow: '0 0 0 3px rgba(96,165,250, 0.35)'
    },
    inputDisabled: {
      opacity: '0.5',
      cursor: 'not-allowed'
    },
    errorBox: {
      background: 'rgba(239, 68, 68, 0.2)',
      border: '2px solid rgba(239, 68, 68, 0.5)',
      backdropFilter: 'blur(10px)',
      color: '#fecaca',
      padding: '14px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      animation: 'shake 0.3s ease-in-out'
    },
    errorIconBadge: {
      background: 'rgba(239, 68, 68, 0.3)',
      padding: '4px',
      borderRadius: '8px',
      display: 'flex',
      flexShrink: '0'
    },
    errorText: {
      flex: '1',
      fontWeight: '500'
    },
    buttonWrapper: {
      position: 'relative',
      marginTop: '24px'
    },
    buttonGlow: {
      position: 'absolute',
      inset: '0',
      background: 'linear-gradient(90deg, #3b82f6, #6366f1, #3b82f6)',
      borderRadius: '12px',
      filter: 'blur(15px)',
      opacity: '0.75',
      transition: 'opacity 0.3s ease'
    },
    button: {
      position: 'relative',
      width: '100%',
      background: 'linear-gradient(90deg, #3b82f6, #6366f1, #3b82f6)',
      color: '#ffffff',
      padding: '16px',
      borderRadius: '12px',
      fontWeight: 'bold',
      fontSize: '16px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
    },
    buttonHover: {
      transform: 'scale(1.02)',
      boxShadow: '0 15px 35px rgba(59, 130, 246, 0.4)'
    },
    buttonDisabled: {
      opacity: '0.5',
      cursor: 'not-allowed',
      transform: 'none'
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      margin: '32px 0'
    },
    dividerLine: {
      flex: '1',
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)'
    },
    dividerText: {
      color: 'rgba(191, 219, 254, 0.6)',
      fontSize: '12px',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    loginSection: {
      textAlign: 'center'
    },
    loginText: {
      color: '#bfdbfe',
      fontSize: '14px'
    },
    loginLink: {
      color: '#93c5fd',
      fontWeight: 'bold',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      padding: '0',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      transition: 'color 0.3s ease'
    },
    bottomBar: {
      height: '4px',
      background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
      opacity: '0.5'
    },
    floatingBlob1: {
      position: 'absolute',
      top: '-24px',
      left: '-24px',
      width: '96px',
      height: '96px',
      background: 'rgba(59, 130, 246, 0.2)',
      borderRadius: '50%',
      filter: 'blur(30px)',
      animation: 'pulse 2s infinite'
    },
    floatingBlob2: {
      position: 'absolute',
      bottom: '-24px',
      right: '-24px',
      width: '128px',
      height: '128px',
      background: 'rgba(99, 102, 241, 0.2)',
      borderRadius: '50%',
      filter: 'blur(30px)',
      animation: 'pulse 2s infinite 1s'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>
      <div style={styles.blob3}></div>
      <div style={styles.blob4}></div>
      <div style={styles.gridPattern}></div>

      <div style={styles.cardWrapper}>
        <div style={styles.cardGlow}></div>
       
        <div style={styles.card}>
          <div style={styles.topBar}></div>
         
          <div style={styles.cardContent}>
            <div style={styles.logoWrapper}>
              <div style={styles.logoGlow}>
                <div style={styles.logoGlowEffect}></div>
                <div style={styles.logo}>
                  <svg style={{width: '40px', height: '40px', color: '#ffffff'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
              </div>
            </div>

            <div style={styles.header}>
              <h2 style={styles.title}>Create Account</h2>
              <p style={styles.subtitle}>Start your journey with us today</p>
            </div>

            <form onSubmit={register} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <div style={styles.inputWrapper}>
                  <div style={styles.iconBadge}>
                    <svg style={{width: '16px', height: '16px', color: '#93c5fd'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    disabled={isLoading}
                    style={{
                      ...styles.input,
                      ...(focusedField === 'name' ? styles.inputFocused : {}),
                      ...(isLoading ? styles.inputDisabled : {})
                    }}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <div style={styles.iconBadge}>
                    <svg style={{width: '16px', height: '16px', color: '#d8b4fe'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    disabled={isLoading}
                    style={{
                      ...styles.input,
                      ...(focusedField === 'email' ? styles.inputFocused : {}),
                      ...(isLoading ? styles.inputDisabled : {})
                    }}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <div style={styles.iconBadge}>
                    <svg style={{width: '16px', height: '16px', color: '#93c5fd'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    disabled={isLoading}
                    style={{
                      ...styles.input,
                      ...(focusedField === 'password' ? styles.inputFocused : {}),
                      ...(isLoading ? styles.inputDisabled : {})
                    }}
                  />
                </div>
              </div>

              {error && (
                <div style={styles.errorBox}>
                  <div style={styles.errorIconBadge}>
                    <svg style={{width: '16px', height: '16px', color: '#fecaca'}} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span style={styles.errorText}>{error}</span>
                </div>
              )}

              <div style={styles.buttonWrapper}>
                <div style={styles.buttonGlow}></div>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    ...styles.button,
                    ...(isLoading ? styles.buttonDisabled : {})
                  }}
                  onMouseEnter={(e) => !isLoading && Object.assign(e.currentTarget.style, styles.buttonHover)}
                  onMouseLeave={(e) => !isLoading && Object.assign(e.currentTarget.style, {transform: 'scale(1)', boxShadow: '0 10px 25px rgba(168, 85, 247, 0.3)'})}
                >
                  {isLoading ? (
                    <>
                      <svg style={{animation: 'spin 1s linear infinite', width: '20px', height: '20px', color: '#ffffff'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle style={{opacity: '0.25'}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path style={{opacity: '0.75'}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating your account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <svg style={{width: '20px', height: '20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>or</span>
              <div style={styles.dividerLine}></div>
            </div>

            <div style={styles.loginSection}>
              <p style={styles.loginText}>
                Already have an account?{" "}
                <button
                  onClick={() => setAuthPage("login")}
                  style={styles.loginLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#dbeafe'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#93c5fd'}
                >
                  <span>Sign in</span>
                  <svg style={{width: '16px', height: '16px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </p>
            </div>
          </div>

          <div style={styles.bottomBar}></div>
        </div>

        <div style={styles.floatingBlob1}></div>
        <div style={styles.floatingBlob2}></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: rgba(191, 219, 254, 0.6);
        }
      `}</style>
    </div>
  );
}

export default Register;
