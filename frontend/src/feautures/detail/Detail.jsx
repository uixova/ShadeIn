import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, addReactionApi } from '../../api/api'; 
import { useTime } from '../../hooks/useTime'; 
import Loader from '../../components/Common/Loader';
import Report from '../../components/Common/Report';
import './css/DetailPage.css';

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [confession, setConfession] = useState(null);
    const [relatedConfessions, setRelatedConfessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isReportOpen, setIsReportOpen] = useState(false);

    const timeFormatted = useTime(confession?.createdAt);

    useEffect(() => {
        const fetchDetailData = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/confessions/${id}`);
                setConfession(res.data.data);

                const relatedRes = await api.get(`/confessions?limit=3&category=${res.data.data.category}`);
                setRelatedConfessions(relatedRes.data.data.filter(item => item._id !== id));
            } catch (err) {
                console.error("Veri çekme hatası:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetailData();
        
        window.scrollTo(0, 0);
    }, [id]);

    // Reaksiyon Gönderme İşlemi
    const handleReaction = async (type) => {
        try {
            await addReactionApi(id, type);
            setConfession(prev => ({
                ...prev,
                reactions: {
                    ...prev.reactions,
                    [type]: prev.reactions[type] + 1
                }
            }));
        } catch (err) {
            console.error("Reaksiyon hatası:", err);
        }
    };

    if (loading) return <div className="loader-full"><Loader /></div>;
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
                                <button className="btn-react" onClick={() => handleReaction('heart')}>❤️ {confession.reactions.heart}</button>
                                <button className="btn-react" onClick={() => handleReaction('fire')}>🔥 {confession.reactions.fire}</button>
                                <button className="btn-react" onClick={() => handleReaction('shock')}>😮 {confession.reactions.shock}</button>
                                <button className='btn-react' onClick={() => handleReaction('sad')}>😢 {confession.reactions.sad}</button>
                                <button className='btn-react' onClick={() => handleReaction('clap')}>👏 {confession.reactions.clap}</button>
                            </div>
                            <div className="footer-right">
                                <div className="views">
                                    <i className="ti ti-eye"></i> {confession.views || 0}
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
                            {relatedConfessions.length > 0 ? (
                                relatedConfessions.map(item => (
                                    <div 
                                        key={item._id} 
                                        className="related-item" 
                                        onClick={() => navigate(`/detail/${item._id}`)}
                                    >
                                        <p>{item.text.substring(0, 70)}...</p>
                                        <div className="related-footer">
                                            <span className="related-tag">#{item.category}</span>
                                            <i className="ti ti-chevron-right"></i>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-related">Benzer başka itiraf yok.</p>
                            )}
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