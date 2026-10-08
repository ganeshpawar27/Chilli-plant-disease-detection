import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);  // Remove /api
    return response.data;
  },
  
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);  // Remove /api
    return response.data;
  },
  
  async adminLogin(credentials) {
    const response = await api.post('/auth/admin/login', credentials);  // Remove /api
    return response.data;
  },
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};