import api from '@/utils/api';

export const roleService = {
  async getAll() {
    const response = await api.get('/roles');
    return response.data;
  },
}; 