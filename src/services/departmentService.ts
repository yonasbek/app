import api from '@/utils/api';

export const departmentService = {
  async getAll() {
    const response = await api.get('/departments');
    return response.data;
  },
}; 