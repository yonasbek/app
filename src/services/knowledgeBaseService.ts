import api from '@/utils/api';

export interface KnowledgeBaseFile {
  id: string;
  document_name: string;
  document_size: number;
  document_url: string;
  upload_date: string;
  module: string;
}

class KnowledgeBaseService {
  private baseUrl = '/upload';

  async list(): Promise<KnowledgeBaseFile[]> {
    const res = await api.get(`${this.baseUrl}`);
    return res.data;
  }

  async upload(file: File): Promise<KnowledgeBaseFile> {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('module', 'KNOWLEDGE_BASE');
    try {
      const res = await api.post(this.baseUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async download(id: string): Promise<any> {
    const res = await api.get(`${this.baseUrl}/${id}`);
    return res.data;
  }
}


export const knowledgeBaseService = new KnowledgeBaseService();