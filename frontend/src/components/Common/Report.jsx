import React, { useState } from 'react';
import { reportContentApi } from '../../api/api';
import '../css/Report.css';

const Report = ({ isOpen, onClose, contentId }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await reportContentApi(contentId, { 
        reason, 
        description 
      });

      if (res.data.success) {
        alert(res.data.message); 
        onClose();
        
        if (res.data.message.includes("incelemeye alındı")) {
           window.location.reload(); 
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Rapor gönderilemedi.";
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-overlay" onClick={onClose}>
      <div className="report-modal shadow-neon" onClick={(e) => e.stopPropagation()}>
        <div className="report-header">
          <div className="title-area">
            <i className="ti ti-alert-triangle"></i>
            <h2>İçeriği Bildir</h2>
          </div>
          <button className="close-report" onClick={onClose}>&times;</button>
        </div>

        <p className="report-info">
          Bu içeriğin topluluk kurallarımızı ihlal ettiğini mi düşünüyorsun? 
          Lütfen sebebini belirt, gerisini biz hallederiz.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="report-group">
            <label>İhlal Nedeni</label>
            <select 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">Bir neden seçin...</option>
              <option value="nefret">Nefret Söylemi / Taciz</option>
              <option value="spam">Spam / Alakasız İçerik</option>
              <option value="cinsellik">Uygunsuz Cinsellik</option>
              <option value="siddet">Şiddet / Tehdit</option>
              <option value="diger">Diğer</option>
            </select>
          </div>

          <div className="report-group">
            <label>Ek Bilgi (İsteğe Bağlı)</label>
            <textarea 
              placeholder="Eklemek istediğin bir detay var mı?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
            ></textarea>
          </div>

          <div className="report-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Vazgeç</button>
            <button type="submit" className="btn-send-report" disabled={isSubmitting}>
              {isSubmitting ? "Gönderiliyor..." : "Raporu Gönder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Report;