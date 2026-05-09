import axios from 'axios';
import Cookies from 'js-cookie';
import { useUserStore } from '@/store/useUserStore';
import { v4 as uuidv4 } from 'uuid';

// Helper to manage the Guest Session ID
const getGuestSessionId = () => {
  if (typeof window !== 'undefined') {
    let sessionId = localStorage.getItem('guest_session_id');
    if (!sessionId) {
      sessionId = uuidv4(); // Generate a secure random ID
      localStorage.setItem('guest_session_id', sessionId);
    }
    return sessionId;
  }
  return null;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('auth_token') || localStorage.getItem('token');
      
      if (token) {
        // Logged-in user: Send JWT
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Guest user: Send Session ID
        const sessionId = getGuestSessionId();
        if (sessionId) {
          config.headers['x-guest-session'] = sessionId;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user-storage'); 
        
        // FIXED: Remove the correct cookie keys
        Cookies.remove('auth_token');
        Cookies.remove('token'); 
        Cookies.remove('user_role');
        
        useUserStore.getState().logout();
        
        const publicPaths = ['/login', '/products', '/order-now', '/'];
        const isProductPage = window.location.pathname.startsWith('/products/');
        
        if (!publicPaths.includes(window.location.pathname) && !isProductPage) {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;