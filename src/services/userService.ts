import api from '@/utils/api';

export const userService = {
  async getAll() {
    const response = await api.get('/users');
    return response.data;
  },
  async getById(id: string) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  async update(id: string, data: any) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  async delete(id: string) {
    await api.delete(`/users/${id}`);
  },
}; 