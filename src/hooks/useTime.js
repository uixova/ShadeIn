import { useState, useEffect, useMemo } from 'react';

const EXPIRY_PRESET_MS = {
  '1h': 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000
};

export const EXPIRY_OPTIONS = [
  { value: '1h', label: '1 Saat Sonra' },
  { value: '6h', label: '6 Saat Sonra' },
  { value: '24h', label: '24 Saat Sonra' },
  { value: '7d', label: '1 Hafta Sonra' }
];

export const getExpiryDateFromPreset = (preset, baseDate = new Date()) => {
  const duration = EXPIRY_PRESET_MS[preset] || EXPIRY_PRESET_MS['24h'];
  const baseTime = baseDate instanceof Date ? baseDate.getTime() : new Date(baseDate).getTime();

  return new Date(baseTime + duration).toISOString();
};

const getFormattedTimeAgo = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  let diffInSeconds = Math.floor((now - past) / 1000);
  if (Number.isNaN(diffInSeconds)) return '';
  if (diffInSeconds < 0) diffInSeconds = 0;

  // Zaman farkına göre uygun formatı döndürüyoruz
  if (diffInSeconds < 5) return 'Şimdi';
  if (diffInSeconds < 60) return `${diffInSeconds}s önce`;
  
  // Dakika, saat, gün hesaplamaları
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}dk önce`;
  
  // Saat ve gün hesaplamaları
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}sa önce`;
  
  // Gün hesaplaması
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}g önce`;

  // 30 günden büyükse tarihi Türkçe formatında döndürüyoruz
  return past.toLocaleDateString('tr-TR');
};

export const useTime = (dateString) => {
  const [tick, setTick] = useState(0);

  const timeAgo = useMemo(() => {
    tick;
    return getFormattedTimeAgo(dateString);
  }, [dateString, tick]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(prev => prev + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return timeAgo;
};