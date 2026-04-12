import React, { createContext, useState, useEffect } from 'react';
// api.js dosyasından senin yazdığın fonksiyonları çekiyoruz
import { fetchUserProfileApi, updateUserProfileApi } from '../api/api'; 

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // localStorage'da token/session var mı diye bak (simüle)
                const hasSession = localStorage.getItem('shade_session');
                
                if (hasSession) {
                    // Veriyi doğrudan senin api.js içindeki fonksiyondan çekiyoruz
                    const userData = await fetchUserProfileApi();
                    setUser(userData);
                }
            } catch (error) {
                console.error("Authentication failure:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    // GİRİŞ YAPMA
    const login = async (credentials) => {
        try {
            // İlerde buraya authApi.login(credentials) gelecek
            const userData = await fetchUserProfileApi();

            if (
                (credentials.username === userData.username || credentials.username === userData.email) &&
                credentials.password === userData.password
            ) {
                const { _password, ...safeUser } = userData;
                setUser(safeUser);
                localStorage.setItem('shade_session', 'active'); 
                return { success: true };
            }
            return { success: false, message: "Incorrect login." };
        } catch (error) {
            return { success: false, error };
        }
    };

    // ÇIKIŞ
    const logout = () => {
        setUser(null);
        localStorage.removeItem('shade_session');
    };

    // PROFİL GÜNCELLEME
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

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!user, 
            login, 
            logout, 
            updateUserInfo, 
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};