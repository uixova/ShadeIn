import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// import { api } from './api' olarak çekilebilsin.
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

    const response = await api.get(url);
    
    return {
        data: response.data.data,
        total: response.data.count,
        hasMore: !!response.data.pagination.next
    };
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

export default api;