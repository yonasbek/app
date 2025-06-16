import api from '@/utils/api';

export interface RegisterData {
  fullName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  departmentId: string;
  username: string;
  password: string;
  confirmPassword: string;
  roleId: string;
  supervisorName?: string;
  comments?: string;
}

export const authService = {
  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
}; 