import api from '@/utils/api';
import { Week } from '@/types/subactivity';

class WeekService {
  private readonly baseUrl = '/weeks';

  async getAll(year?: number): Promise<Week[]> {
    const url = year ? `${this.baseUrl}?year=${year}` : this.baseUrl;
    const response = await api.get(url);
    return response.data;
  }

  async getById(id: string): Promise<Week> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async generateForYear(year: number): Promise<Week[]> {
    const response = await api.get(`${this.baseUrl}/generate/${year}`);
    return response.data;
  }

  async create(week_number: number, year: number): Promise<Week> {
    const response = await api.post(this.baseUrl, { week_number, year });
    return response.data;
  }
}

export const weekService = new WeekService();

