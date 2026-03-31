import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { homeService } from './service/homeService'; 
import Sidebar from './components/Categories';
import CreateConfession from './components/CreateConfession';
import { useTime } from '../../hooks/useTime';
import { usePagination } from '../../hooks/usePagination'; 
import './css/Home.css';

// Zamanı formatlamak için küçük bir bileşen
const TimeLabel = ({ date }) => {
  const time = useTime(date);
  return <span className="date">{time}</span>;
};

function Home() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const categories = ['Hepsi', 'İtiraf', 'Sır', 'Komik', 'Pişmanlık'];

  // TÜM SAYFALAMA MANTIĞI BURADA BİTTİ
  const { data: confessions, loading, loadMoreLoading, hasMore, next } = 
    usePagination(homeService.getConfessionsByPage, 10, selectedCategory);

  return (
    <div className="home-wrapper">
      <Sidebar 
        categories={categories} 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory} 
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      {/* Ana içerik alanı: İtiraf kartları ve yükleme durumları */}
      <main className="confession-feed">
        <div className="feed-header">
          <h2>{selectedCategory} Akışı</h2>
        </div>
        
        {loading ? (
          <div className="loader-container"><div className="neon-spinner"></div></div>
        ) : (
          <>
            <div className="cards-container">
              {confessions.map((item) => (
                <div key={item.id} className="confession-card" onClick={() => navigate(`/detail/${item.id}`)}>
                  <div className="card-header">
                    <span className={`tag ${item.category.toLowerCase()}`}>{item.category}</span>
                    <TimeLabel date={item.createdAt} />
                  </div>
                  
                  <p className="card-content">{item.text}</p>
                  
                  <div className="card-footer">
                    <button className="action-btn" onClick={(e) => e.stopPropagation()}>❤️ {item.reactions.heart}</button>
                    <button className="action-btn" onClick={(e) => e.stopPropagation()}>😂 {item.reactions.laugh}</button>
                    <button className="action-btn" onClick={(e) => e.stopPropagation()}>🔥 {item.reactions.fire}</button>
                    <button className="action-btn" onClick={(e) => e.stopPropagation()}>😮 {item.reactions.shock}</button>
                    <button className="action-btn" onClick={(e) => e.stopPropagation()}>😢 {item.reactions.sad}</button>
                    <button className="action-btn" onClick={(e) => e.stopPropagation()}>👏 {item.reactions.clap}</button>

                    <button className="report-btn" onClick={(e) => {
                        e.stopPropagation();
                        alert("İhbar edildi!");
                    }}>
                      <i className="ti ti-alert-circle"></i> Report
                    </button>
                  </div>
                </div>
              ))}
            </div>

              {/* Load More Butonu: Sadece daha fazla veri varsa ve şu anda yüklenmiyorsa göster */}
            {hasMore && (
              <div className="load-more-container">
                <button className="load-more-btn" onClick={next} disabled={loadMoreLoading}>
                  {loadMoreLoading ? 'Yükleniyor...' : 'Daha Fazla Göster'}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <CreateConfession isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}

export default Home;