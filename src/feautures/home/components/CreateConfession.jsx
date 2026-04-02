import React, { useState } from 'react';
import '../css/CreateConfession.css';
import { EXPIRY_OPTIONS, getExpiryDateFromPreset } from '../../../hooks/useTime';

const CreateConfession = ({ isOpen, onClose, categories }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('İtiraf');
  const [expireTime, setExpireTime] = useState('24h'); // Varsayılan süre

  if (!isOpen) return null;

  const selectableCategories = categories.filter(c => c !== 'Hepsi');

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const expiresAt = getExpiryDateFromPreset(expireTime, now);

    console.log("Yeni İtiraf:", {
      text,
      category,
      createdAt: now.toISOString(),
      expiresAt
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content shadow-neon" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-text">
            <h2>İçini Dök</h2>
            <p className="subtitle">Sırların gölgelerde güvende...</p>
          </div>
          <button className="close-x" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group flex-1">
              <label><i className="ti ti-category"></i> Kategori</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {selectableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label><i className="ti ti-clock"></i> Silinme Süresi</label>
              <select value={expireTime} onChange={(e) => setExpireTime(e.target.value)}>
                {EXPIRY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Neler Fısıldayacaksın?</label>
            <div className="textarea-wrapper">
              <textarea 
                placeholder="Kimse kim olduğunu bilmeyecek, sadece anlat..."
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