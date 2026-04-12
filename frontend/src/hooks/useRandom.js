import { useMemo } from 'react';

export const useRandom = (items, count = 3, excludedId = null) => {
  return useMemo(() => {
    if (!Array.isArray(items) || items.length === 0 || count <= 0) {
      return [];
    }

    const normalizedExcludedId = Number(excludedId);
    const pool = items.filter((item) => {
      if (Number.isNaN(normalizedExcludedId)) return true;
      return Number(item.id) !== normalizedExcludedId;
    });

    if (pool.length <= count) {
      return pool;
    }

    const seedBase = `${excludedId ?? 'none'}-${pool.length}`;
    const seededScore = (value) => {
      const text = `${value}-${seedBase}`;
      let hash = 0;

      for (let i = 0; i < text.length; i += 1) {
        hash = (hash * 31 + text.charCodeAt(i)) | 0;
      }

      return Math.abs(hash);
    };

    return [...pool]
      .sort((a, b) => seededScore(a.id) - seededScore(b.id))
      .slice(0, count);
  }, [items, count, excludedId]);
};

