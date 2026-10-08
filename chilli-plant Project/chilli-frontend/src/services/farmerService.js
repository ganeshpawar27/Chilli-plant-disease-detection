import api from './api';

export const farmerService = {
  async getProfile() {
    const response = await api.get('/farmer/profile');  // Remove /api
    return response.data;
  },
  
  async predictDisease(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/farmer/predict', formData, {  // Remove /api
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  async getHistory(page = 0, size = 10) {
    const response = await api.get(`/farmer/history?page=${page}&size=${size}`);  // Remove /api
    return response.data;
  },
};