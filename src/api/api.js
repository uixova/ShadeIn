import contentData from '../data/content.json';

// Parametreleri buradan alıyoruz ki gereksiz veri trafiği olmasın
export const fetchConfessionsApi = async (page = 1, limit = 10, category = 'Hepsi') => {
    
    // Gerçekçi ağ gecikmesi (Network Latency) simülasyonu
    const randomDelay = Math.floor(Math.random() * (1000 - 400 + 1)) + 400;

    return new Promise((resolve) => {
        setTimeout(() => {
            // Önce kategoriye göre filtrele (Hepsi değilse)
            let filtered = contentData;
            if (category !== 'Hepsi') {
                filtered = contentData.filter(item => item.category === category);
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