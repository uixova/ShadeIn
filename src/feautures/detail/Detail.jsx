import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import contentData from '../../data/content.json';
import { useTime } from '../../hooks/useTime'; 
import { useRandom } from '../../hooks/useRandom';
import { normalizeConfessions, sortByPopularity } from '../../utils/contentUtils';
import '../detail/css/DetailPage.css';
import Report from '../../components/Common/Report';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const preparedContent = sortByPopularity(normalizeConfessions(contentData));

  useEffect(() => {
  const container = document.querySelector('.content-container');
  if (container) {
    container.scrollTo(0, 0);
  }
}, [id]);
  
  const confession = preparedContent.find(item => item.id === parseInt(id));

  const randomConfessions = useRandom(preparedContent, 3, id);

  const timeFormatted = useTime(confession?.createdAt);

  if (!confession) return <div className="not-found">İtiraf bulunamadı...</div>;

  return (
    <div className="detail-page-wrapper">
      <div className="bg-glow"></div>

      <div className="detail-main-container">
        <div className="content-side">
          <button className="back-link-modern" onClick={() => navigate('/')}>
            <div className="back-icon">
              <i className="ti ti-arrow-narrow-left"></i>
            </div>
            <span>Geri Dön</span>
          </button>

          <article className="main-confession-card">
            <header className="detail-header">
              <div className="author-box">
                <div className="author-left">
                  <div className="avatar-neon">
                    <i className="ti ti-ghost"></i>
                  </div>
                  <div className="meta">
                    <h3>Anonim Fısıltı</h3>
                    <span className="time">{timeFormatted} önce bırakıldı</span>
                  </div>
                </div>
                <div className="author-right">
                  <div className="category-pill">
                    <span className={`tag-box-detail ${confession.category.toLowerCase()}`}>
                      {confession.category}
                    </span>
                  </div>
                </div>
              </div>
            </header>

            <section className="confession-body">
              <p>{confession.text}</p>
            </section>

            <footer className="confession-footer">
               <div className="reaction-bar">
                  <button className="btn-react">❤️ {confession.reactions.heart}</button>
                  <button className="btn-react">🔥 {confession.reactions.fire}</button>
                  <button className="btn-react">😮 {confession.reactions.shock}</button>
                  <button className='btn-react'>😢 {confession.reactions.sad}</button>
                  <button className='btn-react'>👏 {confession.reactions.clap}</button>
               </div>
               <div className="footer-right">
                  <div className="views">
                    <i className="ti ti-eye"></i> {confession.views}
                  </div>
                  <button className="btn-report" onClick={() => setIsReportOpen(true)}>
                    <i className="ti ti-alert-triangle"></i>
                  </button>
               </div>
            </footer>
          </article>
        </div>

        <aside className="related-side">
          <div className="sidebar-widget">
            <h4>Keşfetmeye Devam Et</h4>
            <div className="related-list">
              {randomConfessions.map(item => (
                <div 
                  key={item.id} 
                  className="related-item" 
                  onClick={() => navigate(`/detail/${item.id}`)}
                >
                  <p>{item.text.substring(0, 70)}...</p>
                  <div className="related-footer">
                     <span className="related-tag">#{item.category}</span>
                     <i className="ti ti-chevron-right"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="safety-notice">
             <i className="ti ti-shield-lock"></i>
             <p>ShadeIn üzerinde paylaşılan tüm içerikler uçtan uca anonimdir.</p>
          </div>
        </aside>
      </div>

      <Report 
         isOpen={isReportOpen} 
         onClose={() => setIsReportOpen(false)} 
         contentId={id} 
       />
    </div>
  );
};

export default Detail;