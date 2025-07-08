import { 
  Contact, 
  ContactFormData, 
  ContactFilters, 
  ContactSearchResponse, 
  ContactSuggestion, 
  ContactSuggestionFormData, 
  ContactStatistics, 
  AutocompleteResponse 
} from '@/types/contact';
import api from '@/utils/api';

class ContactService {
  private baseUrl = '/contacts';

  // Get contacts (both admin and staff use same endpoint)
  async getAllContacts(filters?: ContactFilters): Promise<ContactSearchResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.organizationType) params.append('organizationType', filters.organizationType);
      if (filters?.position) params.append('position', filters.position);
      if (filters?.region) params.append('region', filters.region);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`${this.baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  // Staff endpoints (same as admin for contacts)
  async getContactsForStaff(filters?: ContactFilters): Promise<ContactSearchResponse> {
    return this.getAllContacts(filters);
  }

  async getContactById(id: string): Promise<Contact> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) { 
      console.error('Error fetching contact:', error);
      throw error;
    }
  }

  async createContact(data: ContactFormData): Promise<Contact> {
    try {
      const response = await api.post(`${this.baseUrl}`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  async updateContact(id: string, data: ContactFormData): Promise<Contact> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  async deleteContact(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  // Suggestion endpoints
  async createSuggestion(data: ContactSuggestionFormData): Promise<ContactSuggestion> {
    try {
      const response = await api.post(`${this.baseUrl}/suggestions`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating suggestion:', error);
      throw error;
    }
  }

  async getSuggestions(status?: string): Promise<ContactSuggestion[]> {
    try {
      const params = status ? `?status=${status}` : '';
      const endpoint = this.isAdmin() ? '/suggestions/all' : '/suggestions/my';
      const response = await api.get(`${this.baseUrl}${endpoint}${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      throw error;
    }
  }

  async reviewSuggestion(id: string, action: 'APPROVE' | 'REJECT', comment?: string): Promise<ContactSuggestion> {
    try {
      // Map frontend action to backend status
      const status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      const response = await api.patch(`${this.baseUrl}/suggestions/${id}/review`, { 
        status, 
        reviewNotes: comment 
      });
      return response.data;
    } catch (error) {
      console.error('Error reviewing suggestion:', error);
      throw error;
    }
  }

  // Statistics and autocomplete
  async getStatistics(): Promise<ContactStatistics> {
    try {
      const response = await api.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  async getAutocomplete(query: string): Promise<AutocompleteResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/autocomplete?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching autocomplete:', error);
      throw error;
    }
  }

  // Export and import
  async exportContacts(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/export?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting contacts:', error);
      throw error;
    }
  }

  async importContacts(file: File): Promise<{ success: number; errors: string[] }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post(`${this.baseUrl}/bulk-import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error importing contacts:', error);
      throw error;
    }
  }

  // Helper method to determine if user is admin (you may need to adjust this based on your auth system)
  isAdmin(): boolean {
    // Check if user role is stored in localStorage or sessionStorage
    try {
      const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
      return userRole === 'admin' || userRole === 'administrator';
    } catch (error) {
      // Fallback: assume admin for now (should be updated when proper auth is implemented)
      console.warn('Unable to determine user role, defaulting to admin');
      return true;
    }
  }
}

export const contactService = new ContactService();
