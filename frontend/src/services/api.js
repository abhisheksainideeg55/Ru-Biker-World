import axios from 'axios';
import { authStorage } from '../utils/authStorage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to automatically attach JWT token and handle multipart headers
api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    const token = authStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for 401/403 handling, instant session revocation, and ACCOUNT_BLOCKED redirection
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const errorCode = data?.code;
    const message = data?.message || error.message || 'An unexpected error occurred';

    // 1. Handle Account Blocked (HTTP 403 with code ACCOUNT_BLOCKED)
    if (status === 403 && (errorCode === 'ACCOUNT_BLOCKED' || (message && message.toLowerCase().includes('suspended')))) {
      authStorage.clearAuth();
      if (data?.blockDetails) {
        try {
          sessionStorage.setItem('motozone_blocked_info', JSON.stringify(data.blockDetails));
        } catch (e) {}
      }
      // Broadcast to all tabs via window event and redirect
      window.dispatchEvent(new CustomEvent('motozone:account_blocked', { detail: data }));
      if (!window.location.pathname.includes('/account-blocked')) {
        window.location.href = '/account-blocked';
      }
    }

    // 2. Handle 401 Unauthorized / Session Revoked
    if (status === 401) {
      authStorage.clearAuth();
      // Dispatch custom event so AuthContext can update without circular import
      window.dispatchEvent(new CustomEvent('motozone:unauthorized', { detail: data }));
    }

    const customError = new Error(message);
    customError.status = status;
    customError.data = data;
    customError.code = errorCode;
    return Promise.reject(customError);
  }
);

export default api;
