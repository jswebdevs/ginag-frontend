import api from '../lib/axios';

export const authService = {
  login: async (identifier: string, password: string) => {
    const response = await api.post('/auth/login', { identifier, password });
    
    // Save token to localStorage automatically on success
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};