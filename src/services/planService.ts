import api from '@/utils/api';
import { Plan, CreatePlanDto, UpdatePlanDto } from '@/types/plan';

const PLANS_API = '/plans';

export const planService = {
  getAll: async (): Promise<Plan[]> => {
    const response = await api.get(PLANS_API);
    return response.data;
  },

  getByFiscalYear: async (fiscalYear: string): Promise<Plan[]> => {
    const response = await api.get(`${PLANS_API}?fiscal_year=${fiscalYear}`);
    return response.data;
  },

  getById: async (id: string): Promise<Plan> => {
    const response = await api.get(`${PLANS_API}/${id}`);
    return response.data;
  },

  create: async (plan: CreatePlanDto): Promise<Plan> => {
    const response = await api.post(PLANS_API, plan);
    return response.data;
  },

  update: async (id: string, plan: UpdatePlanDto): Promise<Plan> => {
    const response = await api.patch(`${PLANS_API}/${id}`, plan);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${PLANS_API}/${id}`);
  }
}; 