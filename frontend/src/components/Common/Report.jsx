import React, { useState } from 'react';
import '../css/Report.css';

const Report = ({ isOpen, onClose, contentId }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Backend simülasyonu
    const reportData = {
      contentId,
      reason,
      description,
      timestamp: new Date().toISOString(),
      // İleride auth eklediğinde buraya user bilgilerini hook'tan çekeriz
      reporter: "Current_User_ID_or_Email" 
    };

    console.log("Rapor Gönderildi:", reportData);

    // Simüle edilmiş gecikme
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Raporun incelenmek üzere gölgelere iletildi. Teşekkürler.");
      onClose();
    }, 1000);
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