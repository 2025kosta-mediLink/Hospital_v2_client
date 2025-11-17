import apiClient from './client';

// 조제(수령) 관련 API
export const dispensingApi = {
  async getStatus(dispensingId) {
    const { data } = await apiClient.get(`/prescriptions/dispensing/${dispensingId}`);
    return data;
  },
  
  async complete(dispensingId) {
    await apiClient.post(`/prescriptions/dispensing/${dispensingId}`, {
      receivedAt: new Date().toISOString()
    });
  }
};

