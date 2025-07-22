import axios from '@/utils/api';
import { Memo, CreateMemoDto, UpdateMemoDto, WorkflowActionDto, WorkflowHistory, DocumentData } from '@/types/memo';

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

  // Workflow methods
  async submitToDeskHead(id: string): Promise<Memo> {
    const response = await axios.post(`${this.baseUrl}/${id}/workflow/submit-to-desk-head`);
    return response.data;
  }

  async deskHeadAction(id: string, action: WorkflowActionDto): Promise<Memo> {
    const response = await axios.post(`${this.baseUrl}/${id}/workflow/desk-head-action`, action);
    return response.data;
  }

  async leoAction(id: string, action: WorkflowActionDto): Promise<Memo> {
    const response = await axios.post(`${this.baseUrl}/${id}/workflow/leo-action`, action);
    return response.data;
  }

  async getWorkflowHistory(id: string): Promise<WorkflowHistory> {
    const response = await axios.get(`${this.baseUrl}/${id}/workflow/history`);
    return response.data;
  }

  async generateDocument(id: string): Promise<DocumentData> {
    const response = await axios.get(`${this.baseUrl}/${id}/document`);
    return response.data;
  }

  async generateHTMLDocument(id: string): Promise<string> {
    const response = await axios.get(`${this.baseUrl}/${id}/document/html`, {
      responseType: 'text'
    });
    return response.data;
  }

  async getMemosPendingDeskHead(): Promise<Memo[]> {
    const response = await axios.get(`${this.baseUrl}/pending/desk-head`);
    return response.data;
  }

  async getMemosPendingLEO(): Promise<Memo[]> {
    const response = await axios.get(`${this.baseUrl}/pending/leo`);
    return response.data;
  }

  // Helper method to open HTML document in new window for printing
  async openDocumentForPrinting(id: string): Promise<void> {
    const htmlContent = await this.generateHTMLDocument(id);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      // Auto-print after content loads
      newWindow.onload = () => {
        newWindow.print();
      };
    }
  }
}

export const memoService = new MemoService(); 