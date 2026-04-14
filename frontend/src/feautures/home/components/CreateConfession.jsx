import React, { useState } from 'react';
import '../css/CreateConfession.css';
import { createConfessionApi } from '../../../api/api';
import { EXPIRY_OPTIONS, getExpiryDateFromPreset } from '../../../hooks/useTime';

const CreateConfession = ({ isOpen, onClose, categories }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('İtiraf');
  const [expireTime, setExpireTime] = useState('24h');
  const [activeDropdown, setActiveDropdown] = useState(null); 

  if (!isOpen) return null;

  const selectableCategories = categories.filter(c => c !== 'Hepsi');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const expiresAt = getExpiryDateFromPreset(expireTime, new Date());
    
    try {
        const res = await createConfessionApi({ text, category, expiresAt });
        if (res.success) {
            onClose();
            window.location.reload(); 
        }
    } catch (err) {
        alert("Gönderilirken bir hata oluştu: " + err.response?.data?.message);
    }
};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-text">
            <h2>İçini Dök</h2>
            <p className="subtitle">Sırların gölgelerde güvende...</p>
          </div>
          <button className="close-x" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            {/* Kategori Dropdown */}
            <div className="form-group flex-1">
              <label><i className="ti ti-category"></i> Kategori</label>
              <div className={`custom-select ${activeDropdown === 'cat' ? 'active' : ''}`} 
                   onClick={() => setActiveDropdown(activeDropdown === 'cat' ? null : 'cat')}>
                <div className="select-trigger">{category}</div>
                <div className="options-wrapper">
                  {selectableCategories.map(cat => (
                    <div key={cat} className="custom-option" onClick={() => setCategory(cat)}>{cat}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Süre Dropdown */}
            <div className="form-group flex-1">
              <label><i className="ti ti-clock"></i> Silinme Süresi</label>
              <div className={`custom-select ${activeDropdown === 'time' ? 'active' : ''}`}
                   onClick={() => setActiveDropdown(activeDropdown === 'time' ? null : 'time')}>
                <div className="select-trigger">
                  {EXPIRY_OPTIONS.find(o => o.value === expireTime)?.label}
                </div>
                <div className="options-wrapper">
                  {EXPIRY_OPTIONS.map((opt) => (
                    <div key={opt.value} className="custom-option" onClick={() => setExpireTime(opt.value)}>{opt.label}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Neler Fısıldayacaksın?</label>
            <div className="textarea-wrapper">
              <textarea 
                placeholder="Kimse kim olduğunu bilmeyecek..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={500}
                required
              ></textarea>
              <div className="textarea-footer">
                 <span className="char-count">{text.length} / 500</span>
              </div>
            </div>
          </div>

          <button type="submit" className="submit-confession-btn">
            <span>Aydınlığa Gönder</span>
            <i className="ti ti-send"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateConfession;