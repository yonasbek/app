import { ContactFormData } from '@/components/contact/ContactForm';
import api from '@/utils/api';

export interface Contact extends ContactFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

class ContactService {
  private baseUrl = '/contacts';

  async getAll(): Promise<Contact[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Contact> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  }

  async create(data: ContactFormData): Promise<Contact> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  async update(id: string, data: ContactFormData): Promise<Contact> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }
}

export const contactService = new ContactService();
