import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

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
                    const res = await axios.get('http://localhost:5000/api/auth/me');
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
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            if (res.data.success) {
                setAuthToken(res.data.token);
                setUser(res.data.user);
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Giriş başarısız." 
            };
        }
    };

    // KAYIT OLMA
    const register = async (userData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', userData);
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

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!user, 
            login, 
            register,
            logout, 
            loading 
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