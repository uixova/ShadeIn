import React, { createContext, useState, useEffect } from 'react';
import { fetchUserProfileApi, updateUserProfileApi } from '../api/api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const data = await fetchUserProfileApi();
                setUser(data);
            } catch (error) {
                console.error("Auth init hatası:", error);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

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

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, updateUserInfo, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};