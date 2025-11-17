import apiClient from './client';

// 약국 관련 API
export const pharmacyApi = {
  async search(params) {
    const { data } = await apiClient.get('/prescriptions/pharmacies', { params });
    return data;
  },
  
  async send(payload) {
    const { data } = await apiClient.post('/prescriptions/pharmacies', payload);
    return data;
  }
};

