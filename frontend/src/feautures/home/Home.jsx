import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addReactionApi } from '../../api/api';
import { homeService } from './service/homeService'; 
import Sidebar from './components/Categories';
import CreateConfession from './components/CreateConfession';
import Loader from '../../components/Common/Loader';
import Loading from '../../components/Common/Loading'
import { useTime } from '../../hooks/useTime';
import { usePagination } from '../../hooks/usePagination'; 
import Report from '../../components/Common/Report';
import './css/Home.css';

const TimeLabel = ({ date }) => {
  const time = useTime(date);
  return <span className="date">{time}</span>;
};

function Home() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportingId, setReportingId] = useState(null);

  const categories = ['Hepsi', 'İtiraf', 'Sır', 'Komik', 'Pişmanlık', 'Aşk', 'Kariyer', 'Okul', 'Eğlence', 'Aile'];

  const { data: confessions, loading, loadMoreLoading, hasMore, next, updateLocalItem } = usePagination(homeService.getConfessionsByPage, 10, selectedCategory);

  const handleReportClick = (id) => {
    setReportingId(id);    
    setIsReportOpen(true); 
  };

  const handleReaction = async (e, id, type) => {
    e.stopPropagation();
    try {
        const response = await addReactionApi(id, type);
        
        updateLocalItem(id, {
            reactions: response.data 
        });
    } catch (err) {
        console.error("Reaksiyon başarısız", err);
    }
  };

  return (
    <div className="home-wrapper">
      <div className="sidebar-slot">
        <Sidebar 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory} 
          onCreateClick={() => setIsCreateModalOpen(true)}
          loading={loading} 
        />
      </div>

      <main className="confession-feed">
        <div className="feed-header">
          <h2>{selectedCategory} Akışı</h2>
        </div>
        
        {loading ? (
          <div className="loader-container">
            <Loader />
          </div>
        ) : confessions.length === 0 ? ( 
          <div className="empty-state">
            <div className="empty-icon">
              <i className="ti ti-ghost"></i>
            </div>
            <h3>Sessizlik Hakim...</h3>
            <p>Bu kategoride henüz kimse paylaşım yapmadı.</p>
            <button className="be-first-btn" onClick={() => setIsCreateModalOpen(true)}>
              İlk Sen Başlat!
            </button>
          </div>
        ) : (
          <>
            <div className="cards-container">
              {confessions.map((item) => (
                <div key={item._id} className="confession-card" onClick={() => navigate(`/detail/${item._id}`)}>
                  <div className="card-header">
                    <span className={`tag ${item.category.toLowerCase()}`}>{item.category}</span>
                    <TimeLabel date={item.createdAt} />
                  </div>
                  
                  <p className="card-content">{item.text}</p>
                  
                  <div className="card-footer">
                    <button className="action-btn" onClick={(e) => handleReaction(e, item._id, 'heart', item.reactions.heart)}>❤️ {item.reactions.heart}</button>
                    <button className="action-btn" onClick={(e) => handleReaction(e, item._id, 'laugh', item.reactions.laugh)}>😂 {item.reactions.laugh}</button>
                    <button className="action-btn" onClick={(e) => handleReaction(e, item._id, 'fire', item.reactions.fire)}>🔥 {item.reactions.fire}</button>
                    <button className="action-btn" onClick={(e) => handleReaction(e, item._id, 'shock', item.reactions.shock)}>😮 {item.reactions.shock}</button>
                    <button className="action-btn" onClick={(e) => handleReaction(e, item._id, 'sad', item.reactions.sad)}>😢 {item.reactions.sad}</button>
                    <button className="action-btn" onClick={(e) => handleReaction(e, item._id, 'clap', item.reactions.clap)}>👏 {item.reactions.clap}</button>

                    <button 
                      className="report-btn" 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleReportClick(item._id);
                      }}
                    >
                      <i className="ti ti-alert-circle"></i> Report
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="load-more-container">
                <button 
                  className="load-more-btn" 
                  onClick={next} 
                  disabled={loadMoreLoading}
                >
                  {loadMoreLoading ? <Loading size="small" /> : 'Daha Fazla Göster'}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <CreateConfession 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        categories={categories}
      />

      <Report 
        isOpen={isReportOpen} 
        onClose={() => {
          setIsReportOpen(false);
          setReportingId(null); 
        }} 
        contentId={reportingId}
      />
    </div>
  );
}

export default Home;