import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import contentData from '../../data/content.json';
import { useTime } from '../../hooks/useTime'; 
import '../detail/css/DetailPage.css';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const confession = contentData.find(item => item.id === parseInt(id));

  // Dinamik Zaman Hesaplama
  const timeFormatted = useTime(confession?.createdAt);

  if (!confession) return <div className="not-found">İtiraf bulunamadı...</div>;

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="ti ti-arrow-left"></i> Geri Dön
      </button>

      <div className="detail-card">
        <div className="detail-header">
          <div className="user-info">
            <div className="anon-avatar">
              <i className="ti ti-ghost"></i>
            </div>
            <div className="user-meta">
              <span className="username">Anonim</span>
              {/* DİNAMİK ZAMAN BURADA */}
              <span className="time-ago">{timeFormatted} paylaşıldı</span>
            </div>
          </div>
          <div className="detail-stats">
            <span className={`detail-tag ${confession.category.toLowerCase()}`}>
              {confession.category}
            </span>
            <div className="view-count">
              <i className="ti ti-eye"></i> {confession.views}
            </div>
          </div>
        </div>

        <div className="detail-content">
          <p>{confession.text}</p>
        </div>

        <div className="detail-actions">
          <div className="reaction-group">
            <button className="react-btn heart">
              <i className="ti ti-heart"></i> {confession.reactions.heart}
            </button>
            <button className="react-btn laugh">
              <i className="ti ti-mood-smile"></i> {confession.reactions.laugh}
            </button>
            {/* DİĞER EMOJİLERİ DE EKLEDİM */}
            <button className="react-btn fire">
              🔥 {confession.reactions.fire}
            </button>
            <button className="react-btn shock">
              😮 {confession.reactions.shock}
            </button>
            <button className="react-btn sad">
              😢 {confession.reactions.sad}
            </button>
            <button className="react-btn clap">
              👏 {confession.reactions.clap}
            </button>
          </div>
          <button className="report-detail-btn" onClick={() => alert("İhbar edildi!")}>
            <i className="ti ti-alert-circle"></i> Bildir
          </button>
        </div>
      </div>
    </div>
  );
};

export default Detail;