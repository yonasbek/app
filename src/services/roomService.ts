import api from '@/utils/api';

export const roomService = {
  async getAll() {
    const response = await api.get('/rooms');
    return response.data;
  },
  async getById(id: string) {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },
  async create(data: any) {
    const response = await api.post('/rooms', data);
    return response.data;
  },
  async update(id: string, data: any) {
    const response = await api.patch(`/rooms/${id}`, data);
    return response.data;
  },
  async remove(id: string) {
    await api.delete(`/rooms/${id}`);
  },
  async getAvailable(params: { start_time: string; end_time: string; capacity?: number }) {
    const response = await api.get('/rooms/available', { params });
    return response.data;
  },
}; 