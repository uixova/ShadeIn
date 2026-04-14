import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './css/Auth.css';

const Auth = ({ mode = 'login' }) => {
  const { login, register } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [step, setStep] = useState(mode);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(''); 
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleStepChange = (newStep) => {
    setStep(newStep);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(formData.username, formData.password); 
    
    if (result.success) {
        navigate('/');
    } else {
        setError(result.message);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await register(formData);
    
    if (result.success) {
        navigate('/');
    } else {
        setError(result.message);
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setStep('login');
    }, 3500);
  };

  return (
    <div className="auth-overlay">
      <Link to="/" className="back-to-home">
        <i className="ti ti-arrow-narrow-left" style={{fontSize: '1.5rem'}}></i>
        <span>Vazgeç ve Dön</span>
      </Link>

      <div className="auth-card">
        {isSent ? (
          <div className="auth-success-state">
             <div className="success-icon"><i className="ti ti-mail-forward"></i></div>
             <h2 className='success-title'>Talimat Gönderildi!</h2>
             <p className='success-text'>Şifre yenileme bağlantısını e-posta adresine gönderdik.</p>
             <div className="success-loader"></div>
          </div>
        ) : (
          <>
            {step === 'login' && (
              <div className="auth-content">
                <div className="auth-header">
                  <h2>Tekrar Hoş Geldin</h2>
                  <p>Gölge dünyasına güvenli bir giriş yap.</p>
                </div>

                {error && <div className="auth-error-msg">{error}</div>}

                <form className="auth-form" onSubmit={handleLoginSubmit}>
                  <div className="input-group">
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="E-posta Adresin" 
                        value={formData.username}
                        onChange={handleChange}
                        required 
                    />
                  </div>
                  <div className="input-group">
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Şifren" 
                        value={formData.password}
                        onChange={handleChange}
                        required 
                    />
                  </div>
                  <button type="submit" className="auth-btn">Giriş Yap</button>
                </form>
                <div className="auth-footer">
                  Henüz bir hesabın yok mu? <span className="auth-link" onClick={() => handleStepChange('signup')}>Hemen Katıl</span>
                  <div style={{marginTop: '20px'}}>
                    <span className="auth-link" style={{fontSize: '0.85rem', opacity: 0.7}} onClick={() => handleStepChange('reset')}>Şifremi unuttum</span>
                  </div>
                </div>
              </div>
            )}

            {step === 'signup' && (
              <div className="auth-content">
                <div className="auth-header">
                  <h2>Gölge Oluştur</h2>
                  <p>Kimliğini geride bırak, yeni bir başlangıç yap.</p>
                </div>

                {error && <div className="auth-error-msg">{error}</div>}

                <form className="auth-form" onSubmit={handleSignupSubmit}>
                  <div className="input-group">
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Sahte Bir Kullanıcı Adı" 
                        value={formData.username}
                        onChange={handleChange}
                        required 
                    />
                  </div>
                  <div className="input-group">
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="E-posta Adresin" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                    />
                  </div>
                  <div className="input-group">
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Güçlü Bir Şifre" 
                        value={formData.password}
                        onChange={handleChange}
                        required 
                    />
                  </div>
                  <button type="submit" className="auth-btn">Karanlığa Adım At</button>
                </form>
                <div className="auth-footer">
                  Zaten bizden biri misin? <span className="auth-link" onClick={() => handleStepChange('login')}>Giriş Yap</span>
                </div>
              </div>
            )}

            {step === 'reset' && (
              <div className="auth-content">
                <div className="auth-header">
                  <h2>Şifreni Hatırla</h2>
                  <p>E-posta adresine bir kurtarma kodu gönderelim.</p>
                </div>
                <form className="auth-form" onSubmit={handleResetSubmit}>
                  <div className="input-group">
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="E-posta Adresin" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                    />
                  </div>
                  <button type="submit" className="auth-btn">Sıfırlama Bağlantısı Gönder</button>
                </form>
                <div className="auth-footer">
                  Hatırladın mı? <span className="auth-link" onClick={() => handleStepChange('login')}>Geri Dön</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;