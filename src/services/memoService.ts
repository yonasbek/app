import axios from '@/utils/api';
import { Memo, CreateMemoDto, UpdateMemoDto } from '@/types/memo';

class MemoService {
  private readonly baseUrl = '/memos';

  async create(data: CreateMemoDto, files?: File[]): Promise<Memo> {
    // If there are files, upload them first
    let uploadedFileNames: string[] = [];
    if (files && files.length > 0) {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const uploadResponse = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      uploadedFileNames = uploadResponse.data;
    }

    // Create memo with uploaded file names
    const response = await axios.post(this.baseUrl, {
      ...data,
      attachments: uploadedFileNames,
    });
    return response.data;
  }

  async update(id: string, data: UpdateMemoDto, newFiles?: File[]): Promise<Memo> {
    // Handle new file uploads if any
    if (newFiles && newFiles.length > 0) {
      const formData = new FormData();
      newFiles.forEach(file => {
        formData.append('files', file);
        formData.append('module', 'MEMO');
      });

      const uploadResponse = await axios.post(`${this.baseUrl}/${id}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      data.attachments = uploadResponse.data;
    }

    const response = await axios.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteAttachment(memoId: string, fileName: string): Promise<Memo> {
    const response = await axios.delete(`${this.baseUrl}/${memoId}/attachments/${fileName}`);
    return response.data;
  }

  async getAll(): Promise<Memo[]> {
    const response = await axios.get(this.baseUrl);
    return response.data;
  }

  async getById(id: string): Promise<Memo> {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getByDepartment(department: string): Promise<Memo[]> {
    const response = await axios.get(`${this.baseUrl}?department=${department}`);
    return response.data;
  }

  async getByRecipient(recipientId: string): Promise<Memo[]> {
    const response = await axios.get(`${this.baseUrl}?recipient=${recipientId}`);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}

export const memoService = new MemoService(); 