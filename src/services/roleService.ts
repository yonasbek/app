import axios from 'axios';
import { Role, Permission, CreateRoleDto, UpdateRoleDto, CreatePermissionDto, UpdatePermissionDto } from '@/types/role';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const roleService = {
  // Roles
  async getAll(): Promise<Role[]> {
    const response = await axios.get(`${API_URL}/roles`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async getById(id: string): Promise<Role> {
    const response = await axios.get(`${API_URL}/roles/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async create(data: CreateRoleDto): Promise<Role> {
    const response = await axios.post(`${API_URL}/roles`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async update(id: string, data: UpdateRoleDto): Promise<Role> {
    const response = await axios.put(`${API_URL}/roles/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/roles/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  async assignPermissions(roleId: string, permissionIds: string[]): Promise<Role> {
    const response = await axios.post(
      `${API_URL}/roles/${roleId}/permissions`,
      { permissionIds },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // Permissions
  async getAllPermissions(module?: string): Promise<Permission[]> {
    const params = module ? { module } : {};
    const response = await axios.get(`${API_URL}/permissions`, {
      params,
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async getPermissionById(id: string): Promise<Permission> {
    const response = await axios.get(`${API_URL}/permissions/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async createPermission(data: CreatePermissionDto): Promise<Permission> {
    const response = await axios.post(`${API_URL}/permissions`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async updatePermission(id: string, data: UpdatePermissionDto): Promise<Permission> {
    const response = await axios.put(`${API_URL}/permissions/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async deletePermission(id: string): Promise<void> {
    await axios.delete(`${API_URL}/permissions/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  async getModules(): Promise<string[]> {
    const response = await axios.get(`${API_URL}/permissions/modules`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};
