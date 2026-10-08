import api from './api';

export const adminService = {
  async getFarmers(page = 0, size = 10) {
    const response = await api.get(`/admin/farmers?page=${page}&size=${size}`);  // Remove /api
    return response.data;
  },
  
  async deleteFarmer(id) {
    const response = await api.delete(`/admin/farmer/${id}`);  // Remove /api
    return response.data;
  },
  
  async getAnalytics() {
    const response = await api.get('/admin/analytics');  // Remove /api
    return response.data;
  },
  
  async getBasicAnalytics() {
    const response = await api.get('/admin/analytics/basic');  // Remove /api
    return response.data;
  },
};