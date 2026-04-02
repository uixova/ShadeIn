import { useState, useEffect, useCallback } from 'react';

export const usePagination = (fetchService, limit = 10, category = 'Hepsi') => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // useCallback: Bağımlılıkları minimize ettik. 
    // fetchService değişmediği sürece bu fonksiyon hafızada sabit kalır.
    const loadData = useCallback(async (targetPage, isInitial = false) => {
        if (isInitial) setLoading(true);
        else setLoadMoreLoading(true);

        try {
            const result = await fetchService(targetPage, limit, category);
            
            // Eğer isInitial ise yeni veriyi direkt olarak set ediyoruz, değilse mevcut verinin sonuna ekliyoruz.
            setData(prev => (isInitial ? result.data : [...prev, ...result.data]));
            setHasMore(result.hasMore);
        } catch (error) {
            console.error("Pagination Error:", error);
        } finally {
            setLoading(false);
            setLoadMoreLoading(false);
        }
    }, [fetchService, limit, category]); 

    // Kategori Değişimi: Sayfayı sıfırla ve veriyi çek.
    useEffect(() => {
        setPage(1);
        loadData(1, true); 
    }, [category, loadData]); 

    // Sayfa Değişimi: Sadece sayfa 1'den büyükse (load more) çalışır.
    useEffect(() => {
        if (page > 1) {
            loadData(page, false);
        }
    }, [page, loadData]);

    // next fonksiyonu: Sayfa numarasını artırarak yeni veriyi tetikler.
    const next = () => {
        if (!loadMoreLoading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    return { data, loading, loadMoreLoading, hasMore, next };
};