import axios from '@/utils/api';
import { Activity, CreateActivityDto, UpdateActivityDto } from '@/types/activity';

class ActivityService {
  private readonly baseUrl = '/activities';

  async create(data: CreateActivityDto, files?: File[]): Promise<Activity> {
    // If there are files, upload them first
    let uploadedFileNames: string[] = [];
    if (files && files.length > 0) {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
        formData.append('module', 'ACTIVITY');
      });

      const uploadResponse = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      uploadedFileNames = uploadResponse.data;
    }

    // Create activity with uploaded file names
    const response = await axios.post(this.baseUrl, {
      ...data,
      supporting_documents: uploadedFileNames,
    });
    return response.data;
  }

  async update(id: string, data: UpdateActivityDto, newFiles?: File[]): Promise<Activity> {
    // Handle new file uploads if any
    if (newFiles && newFiles.length > 0) {
      const formData = new FormData();
      newFiles.forEach(file => {
        formData.append('files', file);
      });

      const uploadResponse = await axios.post(`${this.baseUrl}/${id}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      data.supporting_documents = uploadResponse.data;
    }

    const response = await axios.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteDocument(activityId: string, fileName: string): Promise<Activity> {
    const response = await axios.delete(`${this.baseUrl}/${activityId}/documents/${fileName}`);
    return response.data;
  }

  async getAll(): Promise<Activity[]> {
    const response = await axios.get(this.baseUrl);
    return response.data;
  }

  async getById(id: string): Promise<Activity> {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getByPlanId(planId: string): Promise<Activity[]> {
    const response = await axios.get(`${this.baseUrl}?plan_id=${planId}`);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }

  async getBudgetSummary(planId: string): Promise<{
    total_allocated: number;
    total_spent: number;
    remaining: number;
  }> {
    const response = await axios.get(`${this.baseUrl}/budget/${planId}`);
    return response.data;
  }

  async getGanttData(): Promise<any[]> {
    const response = await axios.get(`${this.baseUrl}/gantt`);
    return response.data;
  }
}

export const activityService = new ActivityService(); 