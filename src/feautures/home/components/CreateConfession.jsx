import React, { useState } from 'react';
import '../css/CreateConfession.css';

const CreateConfession = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('İtiraf');

  if (!isOpen) return null; // Modal kapalıysa hiçbir şey render etme

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Yeni İtiraf:", { text, category });
    // Burada ileride backend'e istek atacağız
    onClose(); // İşlem bitince kapat
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>İçini Dök</h2>
          <button className="close-x" onClick={onClose}>&times;</button>
        </div>

        {/* İtiraf oluşturma formu */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Kategori Seç</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="İtiraf">İtiraf</option>
              <option value="Sır">Sır</option>
              <option value="Komik">Komik</option>
              <option value="Pişmanlık">Pişmanlık</option>
            </select>
          </div>

            {/* İtiraf metni için textarea */}
          <div className="form-group">
            <label>Neler Oluyor? (Anonim kalacaksın)</label>
            <textarea 
              placeholder="Anlat hadi, kimse kim olduğunu bilmeyecek..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              required
            ></textarea>
            <span className="char-count">{text.length}/500</span>
          </div>

            {/* Gönder butonu */}
          <button type="submit" className="submit-confession-btn">
            Gölgeye Gönder
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateConfession;