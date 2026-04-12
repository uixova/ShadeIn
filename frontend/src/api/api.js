import contentData from '../data/content.json';
import userData from '../data/user.json';
import { normalizeConfessions, sortByPopularity } from '../utils/contentUtils';

// Parametreleri buradan alıyoruz ki gereksiz veri trafiği olmasın
export const fetchConfessionsApi = async (page = 1, limit = 10, category = 'Hepsi') => {
    
    // Gerçekçi ağ gecikmesi (Network Latency) simülasyonu
    const randomDelay = Math.floor(Math.random() * (1000 - 400 + 1)) + 400;

    return new Promise((resolve) => {
        setTimeout(() => {
            const normalizedData = normalizeConfessions(contentData);
            const popularData = sortByPopularity(normalizedData);

            // Önce kategoriye göre filtrele (Hepsi değilse)
            let filtered = popularData;
            if (category !== 'Hepsi') {
                filtered = popularData.filter(item => item.category === category);
            }

            // Sayfalama hesaplama
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            
            // Sadece ilgili 10 taneyi koparıp alıyoruz
            const slicedData = filtered.slice(startIndex, endIndex);
            
            resolve({
                data: slicedData,
                total: filtered.length,
                hasMore: endIndex < filtered.length
            });
        }, randomDelay);
    });
};

export const fetchUserProfileApi = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(userData);
        }, 500); 
    });
};

export const updateUserProfileApi = async (newInfo) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, data: newInfo });
        }, 800);
    });
};