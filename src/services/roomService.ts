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
  async create(data: any, images?: File[]) {
    const formData = new FormData();
    
    // Append all form fields
    Object.keys(data).forEach(key => {
      if (key !== 'images' && data[key] !== undefined && data[key] !== null) {
        if (key === 'facilities' && Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    
    // Append images if provided
    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }
    
    const response = await api.post('/rooms', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  async update(id: string, data: any, images?: File[]) {
    const formData = new FormData();
    
    // Append all form fields
    Object.keys(data).forEach(key => {
      if (key !== 'images' && data[key] !== undefined && data[key] !== null) {
        if (key === 'facilities' && Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    
    // Append new images if provided
    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }
    
    const response = await api.patch(`/rooms/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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