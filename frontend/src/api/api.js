import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const loginApi = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const registerApi = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const fetchUserProfileApi = async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
};

// Confession
export const fetchConfessionsApi = async (page = 1, limit = 10, category = 'Hepsi') => {
    let url = `/confessions?page=${page}&limit=${limit}&sort=-createdAt`;
    
    if (category !== 'Hepsi') {
        url += `&category=${category}`;
    }

    try {
        const response = await api.get(url);
        
        const { data, count, pagination } = response.data;

        return {
            data: data || [],
            total: count || 0,
            hasMore: !!pagination?.next 
        };
    } catch (err) {
        console.error("Fetch API Hatası:", err.response?.data || err.message);
        return {
            data: [],
            total: 0,
            hasMore: false
        };
    }
};

export const createConfessionApi = async (confessionData) => {
    const response = await api.post('/confessions', confessionData);
    return response.data;
};

export const addReactionApi = async (id, reactionType) => {
    const response = await api.post(`/confessions/${id}/react`, { reactionType });
    return response.data;
};

export const deleteConfessionApi = async (id) => {
    const response = await api.delete(`/confessions/${id}`);
    return response.data;
};

export const reportContentApi = async (id, reportData) => {
    return await api.post(`/confessions/${id}/report`, reportData);
};

export default api;