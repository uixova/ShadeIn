import React, { createContext, useState, useEffect } from 'react';
import { fetchUserProfileApi, updateUserProfileApi } from '../api/api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Uygulama ilk açıldığında veya yenilendiğinde çalışır
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Simüle edilmiş 400-1000ms gecikme
                // const data = await fetchUserProfileApi();
                // setUser(data);
                setUser(null); // Veri gelince kullanıcıyı sete çek
            } catch (error) {
                console.error("Kimlik doğrulama başarısız:", error);
                setUser(null);
            } finally {
                setLoading(false); // Her durumda loader'ı kapat
            }
        };
        initAuth();
    }, []);

    // Kullanıcı bilgilerini güncelleme (Profil ayarları için)
    const updateUserInfo = async (newData) => {
        try {
            const response = await updateUserProfileApi(newData);
            if (response.success) {
                setUser(prev => ({ ...prev, ...newData }));
                return { success: true };
            }
        } catch (error) {
            return { success: false, error };
        }
    };

    // Çıkış yapma fonksiyonu
    const logout = () => {
        setUser(null);
        // İlerde buraya localStorage temizleme de gelecek
    };

    return (
        <AuthContext.Provider value={{ user, updateUserInfo, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};