import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 

export const useAuth = () => {
    const context = useContext(AuthContext); 
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return {
        user: context.user,
        updateUserInfo: context.updateUserInfo,
        logout: context.logout,
        loading: context.loading,
        isAuthenticated: !!context.user 
    };
};