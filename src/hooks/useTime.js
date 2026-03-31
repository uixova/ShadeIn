import { useState, useEffect, useMemo } from 'react';

const getFormattedTimeAgo = (dateString) => {
    // Eğer dateString yoksa boş string döndürüyoruz
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

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
  // Tick state'ini tutuyoruz
  const [tick, setTick] = useState(0);
    // dateString ve tick değiştiğinde timeAgo'yu yeniden hesaplıyoruz. Böylece hem component her render olduğunda güncel zamanı gösterebilecek, hem de her dakika otomatik olarak güncellenecek.
  const timeAgo = useMemo(() => {
    tick; 
    return getFormattedTimeAgo(dateString);
  }, [dateString, tick]);

  // Her dakika tick'i artırarak timeAgo'nun güncellenmesini sağlıyoruz
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(prev => prev + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return timeAgo;
};