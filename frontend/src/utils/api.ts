import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

import { handleMockRequest } from './mockAdapter';

// Request interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to fallback to mock data if backend unavailable
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Check if it's a network error (backend down/unreachable/blocked)
        // !error.response covers: Network Error, CORS, Mixed Content, connection refused
        if (!error.response ||
            error.code === 'ERR_NETWORK' ||
            error.code === 'ECONNABORTED' ||
            error.message === 'Network Error' ||
            error.message?.includes('Failed to fetch')
        ) {
            console.warn('[API] Backend unreachable or blocked. Switching to Mock Mode.', error);
            try {
                return await handleMockRequest(error.config);
            } catch (mockError) {
                console.error('[API] Mock Adapter failed:', mockError);
                return Promise.reject(mockError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
