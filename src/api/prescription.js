import apiClient from './client';

// 처방전 관련 API
export const prescriptionApi = {
  async list(memberId) {
    const { data } = await apiClient.get('/prescriptions', {
      params: { memberId }
    });
    return data;
  },
  
  async updateStatus(prescriptionId, payload) {
    await apiClient.patch(`/prescriptions/${prescriptionId}/status`, payload);
  }
};

