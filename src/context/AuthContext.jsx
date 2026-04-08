import React, { createContext, useState, useEffect } from 'react';
// İlerde gerçek API'ye bağlayacağın yerler
// import { loginApi, signupApi, fetchUserProfileApi } from '../api/api';


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // Sayfa yenilendiğinde localStorage'da token varsa kullanıcıyı çek
                // const token = localStorage.getItem('shade_token');
                // if (token) {
                //    const data = await fetchUserProfileApi();
                //    setUser(data);
                // }
                setUser(null); 
            } catch (error) {
                console.error("Kimlik doğrulama hatası:", error);
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
            // Şimdilik simüle ediyoruz, ilerde API'ye gidecek
            // const response = await loginApi(credentials);
            const mockUser = { id: 1, username: credentials.username || 'Golge_1', role: 'user' };
            
            setUser(mockUser);
            // localStorage.setItem('shade_token', 'mock_token_123');
            return { success: true };
        } catch (error) {
            return { success: false, message: "Giriş başarısız:", error  };
        }
    };

    // KAYIT OLMA
    const signup = async (userData) => {
        try {
            // const response = await signupApi(userData);
            const mockUser = { id: 2, username: userData.username, role: 'user' };
            
            setUser(mockUser);
            return { success: true };
        } catch (error) {
            return { success: false, message: "Kayıt sırasında hata oluştu.", error};
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('shade_token');
    };

    const updateUserInfo = async (newData) => {
        setUser(prev => ({ ...prev, ...newData }));
        return { success: true };
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!user, 
            login, 
            signup, 
            logout, 
            updateUserInfo, 
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};