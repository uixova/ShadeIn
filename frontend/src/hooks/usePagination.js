import { useState, useEffect, useCallback } from 'react';

export const usePagination = (fetchService, limit = 10, category = 'Hepsi') => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadData = useCallback(async (targetPage, isInitial = false) => {
        if (isInitial) setLoading(true);
        else setLoadMoreLoading(true);

        try {
            const result = await fetchService(targetPage, limit, category);
            setData(prev => (isInitial ? result.data : [...prev, ...result.data]));
            setHasMore(result.hasMore);
        } catch (error) {
            console.error("Pagination Error:", error);
        } finally {
            setLoading(false);
            setLoadMoreLoading(false);
        }
    }, [fetchService, limit, category]);

    useEffect(() => {
        setPage(1);
        loadData(1, true);
    }, [category, loadData]);

    useEffect(() => {
        if (page > 1) {
            loadData(page, false);
        }
    }, [page, loadData]);

    const next = () => {
        if (!loadMoreLoading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const updateLocalItem = useCallback((id, updatedFields) => {
        setData(prevData => 
            prevData.map(item => 
                (item._id === id || item.id === id) 
                    ? { ...item, ...updatedFields } 
                    : item
            )
        );
    }, []);

    return { data, loading, loadMoreLoading, hasMore, next, updateLocalItem };
};