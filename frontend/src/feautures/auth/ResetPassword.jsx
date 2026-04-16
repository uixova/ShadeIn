import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Auth.css';

const ResetPassword = () => {
    const { token } = useParams(); 
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Şifreler eşleşmiyor.');
        }

        setLoading(true);
        try {
            const res = await axios.put(`http://localhost:5000/api/auth/resetpassword/${token}`, { password });

            if (res.data.success) {
                alert("Şifren başarıyla güncellendi! Giriş yapabilirsin.");
                navigate('/login'); 
            }
        } catch (err) {
            setError(err.response?.data?.message || "Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-overlay">
            <div className="auth-card">
                <div className="auth-content">
                    <div className="auth-header">
                        <h2>Yeni Şifre Belirle</h2>
                        <p>Hesabını geri kazanmak üzeresin, güçlü bir şifre seç.</p>
                    </div>

                    {error && <div className="auth-error-msg">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input 
                                type="password" 
                                placeholder="Yeni Şifre" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="password" 
                                placeholder="Yeni Şifre (Tekrar)" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required 
                            />
                        </div>
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;