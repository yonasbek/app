import api from '@/utils/api';

export const bookingService = {
  async getAll() {
    const response = await api.get('/rooms/bookings');
    return response.data;
  },
  async getById(id: string) {
    const response = await api.get(`/rooms/bookings/${id}`);
    return response.data;
  },
  async create(data: any) {
    const response = await api.post('/rooms/bookings', data);
    return response.data;
  },
  async update(id: string, data: any) {
    const response = await api.patch(`/rooms/bookings/${id}`, data);
    return response.data;
  },
  async remove(id: string) {
    await api.delete(`/rooms/bookings/${id}`);
  },
  async getByRoomId(roomId: string) {
    const response = await api.get(`/rooms/bookings/room/${roomId}`);
    return response.data;
  },
}; 