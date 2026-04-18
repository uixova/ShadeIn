import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const setAuthToken = useCallback((token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setAuthToken(null);
    }, [setAuthToken]);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setAuthToken(token);
                try {
                    const res = await axios.get(`${API_URL}/auth/me`);
                    setUser(res.data.data);
                } catch (error) {
                    console.error("Auth init hatası:", error);
                    logout(); 
                }
            }
            setLoading(false);
        };
        initAuth();
    }, [logout, setAuthToken]); 

    // GİRİŞ YAPMA
    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            if (res.data.success) {
                setAuthToken(res.data.token);
                setUser(res.data.user);
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Geçersiz e-posta veya şifre!" 
            };
        }
    };

    // KAYIT OLMA
    const register = async (userData) => {
        try {
            const res = await axios.post(`${API_URL}/auth/register`, userData);
            if (res.data.success) {
                setAuthToken(res.data.token);
                setUser(res.data.user);
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Kayıt başarısız." 
            };
        }
    };

    //KULLANICI BILGISI GUNCELLEME
    const updateUserInfo = async (updatedData) => {
        try {
            const res = await axios.put(`${API_URL}/auth/updatedetails`, updatedData);
        
            if (res.data.success) {
                setUser(res.data.data); 
                return { success: true };
            }
        } catch (err) {
            console.error(err);
            return { success: false, error: err.response?.data?.message };
        }
    };

    //HESAP SILME
    const deleteAccount = async () => {
        try {
            await axios.delete(`${API_URL}/auth/deleteme`);
            logout(); 
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message };
        }
    };

    const forgotPassword = async (email) => {
        try {
            const res = await axios.post(`${API_URL}/auth/forgotpassword`, { email });
        
            return { 
                success: true, 
                resetToken: res.data.resetToken 
            };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.error || "İşlem başarısız." 
            };
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!user, 
            login, 
            register,
            logout, 
            loading,
            updateUserInfo,
            deleteAccount,
            forgotPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth bir AuthProvider içerisinde kullanılmalıdır!');
    }
    return context;
};