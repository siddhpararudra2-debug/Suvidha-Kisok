import axios from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { handleMockRequest } from './mockAdapter';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle 401 or network errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Mock fallback for GitHub Pages (Network Error)
        if (!error.response || error.code === 'ERR_NETWORK') {
            console.warn('[API] Backend unreachable. Switching to Mock Mode.');
            try {
                return await handleMockRequest(error.config);
            } catch (mockError) {
                return Promise.reject(mockError);
            }
        }

        if (error.response?.status === 401) {
            store.dispatch(logout());
        }
        return Promise.reject(error);
    }
);

export default api;
