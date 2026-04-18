import React, { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminService } from './service/adminService';
import './Admin.css';

const Admin = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [allData, setAllData] = useState([]);
    const [visibleCount, setVisibleCount] = useState(1);
    const [activeTab, setActiveTab] = useState('reports');

    const fetchData = useCallback(async () => {
        try {
            const res = await adminService.getReportedConfessions();
            if (res.data.success) {
                setAllData(res.data.data);
            }
        } catch (error) {
            console.error("Yükleme hatası:", error);
        }
    }, []);

    useEffect(() => {
        let isMounted = true; 

        const initAdmin = async () => {
            if (!loading) {
                if (!user || user.role !== 'admin') {
                    navigate('/');
                } else if (isMounted) {
                    await fetchData(); 
                }
            }
        };

        initAdmin();

        return () => {
            isMounted = false;
        };
    }, [user, loading, navigate, fetchData]);

    const handleAction = async (id, action, value) => {
        try {
            switch(action) {
                case 'delete':
                    await adminService.softDeleteConfession(id);
                    break;
                case 'hardDelete':
                    if(window.confirm("Kalıcı olarak silinecek, emin misin?")) {
                        await adminService.hardDeleteConfession(id);
                    }
                    break;
                case 'ignore':
                    await adminService.updateConfession(id, { reportCount: 0, reportDetails: [] });
                    break;
                case 'restore':
                    await adminService.updateConfession(id, { isDeleted: false, reportCount: 0, deletedAt: null });
                    break;
                case 'changeCategory':
                    await adminService.updateConfession(id, { category: value });
                    break;
                default:
                    break;
            }
            await fetchData();
        } catch (error) {
            console.error("İşlem başarısız:", error);
            alert("İşlem yapılamadı, yetkiyi kontrol et.");
        }
    };

    const filteredData = allData.filter(item => 
        activeTab === 'reports' ? !item.isDeleted : item.isDeleted
    );

    if (loading) return <div className="admin-loader">Sistem Taranıyor...</div>;

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div className="header-left">
                    <h1 className="cyber-title">SHADE<span>IN</span> GUARD</h1>
                    <p className="system-status">Sistem Aktif: {filteredData.length} Kayıt</p>
                </div>
                <div className="tab-group">
                    <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => {setActiveTab('reports'); setVisibleCount(20)}}>AKTİF RAPORLAR</button>
                    <button className={activeTab === 'archive' ? 'active' : ''} onClick={() => {setActiveTab('archive'); setVisibleCount(20)}}>ARŞİVLENMİŞ</button>
                </div>
            </header>

            <div className="admin-grid">
                {filteredData.slice(0, visibleCount).map(item => (
                    <div key={item._id} className={`cyber-card ${item.isDeleted ? 'status-archived' : ''}`}>
                        <div className="card-top">
                            <span className="badge-id">ID: {item._id.slice(-6)}</span>
                            <span className="badge-reports">{item.reportCount} ŞİKAYET</span>
                        </div>
                        
                        <div className="card-body">
                            <p className="confession-text">{item.text}</p>
                            <div className="meta-info">
                                <span>Kategori: </span>
                                <select 
                                    className="cyber-select" 
                                    value={item.category} 
                                    onChange={(e) => handleAction(item._id, 'changeCategory', e.target.value)}
                                >
                                    {['İtiraf', 'Sır', 'Komik', 'Pişmanlık', 'Aşk', 'Kariyer', 'Okul', 'Eğlence', 'Aile'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="card-footer">
                            {activeTab === 'reports' ? (
                                <>
                                    <button className="btn-cyber btn-ignore" onClick={() => handleAction(item._id, 'ignore')}>YOKSAY</button>
                                    <button className="btn-cyber btn-soft" onClick={() => handleAction(item._id, 'delete')}>ARŞİVLE</button>
                                </>
                            ) : (
                                <>
                                    <button className="btn-cyber btn-restore" onClick={() => handleAction(item._id, 'restore')}>GERİ YÜKLE</button>
                                    <button className="btn-cyber btn-hard" onClick={() => handleAction(item._id, 'hardDelete')}>VERİDEN SİL</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {visibleCount < filteredData.length && (
                <button className="load-more-btn" onClick={() => setVisibleCount(prev => prev + 20)}>
                    Daha Fazla...
                </button>
            )}
        </div>
    );
};

export default Admin;