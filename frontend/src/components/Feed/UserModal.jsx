import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth'; 
import '../css/UserModal.css';

const UserModal = ({ onClose }) => {
  const { user, updateUserInfo, logout } = useAuth();
  const [view, setView] = useState('main');
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: ''
  });

  const handleSave = async () => {
    const result = await updateUserInfo({
        username: formData.username,
        email: formData.email
    });

    if (result.success) {
        setView('main');
    } else {
        alert("Güncelleme sırasında bir hata oluştu.");
    }
  };

  if (!user) return null;

  const renderContent = () => {
    switch (view) {
      case 'settings':
        return (
          <div className="modal-view">
            <div className="view-header">
              <button className="back-btn" onClick={() => setView('main')}>
                <i className="ti ti-chevron-left"></i>
              </button>
              <h4>Hesabı Yönet</h4>
            </div>
            <div className="settings-inputs">
              <div className="input-group">
                <label>Kullanıcı Adı</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label>E-posta</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="modal-divider"></div>
              <div className="input-group">
                <label>Yeni Şifre</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <button className="save-btn" onClick={handleSave}>Değişiklikleri Kaydet</button>
            </div>
          </div>
        );

      case 'delete':
        return (
          <div className="modal-view delete-view">
            <div className="warning-icon"><i className="ti ti-alert-triangle"></i></div>
            <h4 className='user-delete-msg'>Gidicek misin?</h4>
            <p>Hesabını sildiğinde tüm izlerin ShadeIn'den silinecek.</p>
            <div className="delete-actions">
              <button className="confirm-delete-btn">Sil ve Ayrıl</button>
              <button className="cancel-btn" onClick={() => setView('main')}>Vazgeç</button>
            </div>
          </div>
        );

      default:
        return (
          <div className="modal-view">
            <div className="user-info-brief">
              <span className="username">@{user.username}</span>
              <span className="user-email">{user.email}</span>
            </div>
            <div className="modal-divider"></div>
            <div className="modal-actions">
              <button className="modal-item" onClick={() => setView('settings')}>
                <i className="ti ti-settings"></i> Ayarlar
              </button>
              <button className="modal-item delete-account" onClick={() => setView('delete')}>
                <i className="ti ti-trash"></i> Hesabı Sil
              </button>
              <div className="modal-divider"></div>
              <button className="modal-item logout" onClick={logout}>
                <i className="ti ti-logout"></i> Çıkış Yap
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className={`user-dropdown-modal ${view !== 'main' ? 'expanded' : ''}`}>
        {renderContent()}
      </div>
    </>
  );
};

export default UserModal;