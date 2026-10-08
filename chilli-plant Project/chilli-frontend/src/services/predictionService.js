import api from './api';

export const predictionService = {
  async getPredictionById(id) {
    const response = await api.get(`/api/predictions/${id}`);
    return response.data;
  },
  
  async getRecentPredictions() {
    const response = await api.get('/api/farmer/history?page=0&size=5');
    return response.data;
  },
};