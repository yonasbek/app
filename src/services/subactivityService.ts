// src/services/subactivityService.ts
import api from '@/utils/api';
import {
  SubActivity,
  CreateSubActivityDto,
  UpdateSubActivityDto,
  UpdateSubActivityProgressDto,
  SubActivityStats
} from '@/types/subactivity';

class SubActivityService {
  private readonly baseUrl = '/subactivities';
  private readonly notificationBaseUrl = '/notification';

  // --- SubActivities ---
  async create(data: CreateSubActivityDto): Promise<SubActivity> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  async getAll(): Promise<SubActivity[]> {
    const response = await api.get(this.baseUrl);
    return response.data;
  }

  async getByActivityId(activityId: string): Promise<SubActivity[]> {
    const response = await api.get(`${this.baseUrl}?activity_id=${activityId}`);
    return response.data;
  }

  async getByUserId(userId: string): Promise<SubActivity[]> {
    const response = await api.get(`${this.baseUrl}?user_id=${userId}`);
    return response.data;
  }

  async getByUserEmail(userEmail: string): Promise<SubActivity[]> {
    const response = await api.get(`${this.baseUrl}?user_email=${userEmail}`);
    return response.data;
  }

  async getById(id: string): Promise<SubActivity> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateSubActivityDto): Promise<SubActivity> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async updateProgress(id: string, data: UpdateSubActivityProgressDto): Promise<SubActivity> {
    const response = await api.patch(`${this.baseUrl}/${id}/progress`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async getSubActivityStats(activityId: string): Promise<SubActivityStats> {
    const response = await api.get(`${this.baseUrl}/activity/${activityId}/stats`);
    return response.data;
  }

  // --- Notifications ---
  async getNotifications(userId: string): Promise<any[]> {
    if (!userId) return [];
    try {
      const response = await api.get(`${this.notificationBaseUrl}/user/${userId}`);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch notifications from backend:', err);
      return [];
    }
  }

  async markNotificationSeen(notificationId: number): Promise<void> {
    try {
      await api.patch(`${this.notificationBaseUrl}/${notificationId}/read`);
    } catch (err) {
      console.warn('Failed to mark notification as read:', err);
    }
  }

  // --- My Tasks ---
  async getMyTasks(): Promise<SubActivity[]> {
    const response = await api.get(`${this.baseUrl}/my-tasks`);
    return response.data;
  }
}

export const subActivityService = new SubActivityService();
export default subActivityService;
