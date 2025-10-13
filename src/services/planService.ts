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
  },

  getOverallStatistics: async (): Promise<{
    total_plans: number;
    total_activities: number;
    active_plans: number;
    completed_plans: number;
    by_plan_type: Array<{
      plan_type: string;
      total_plans: number;
      total_activities: number;
      average_progress: number;
    }>;
  }> => {
    const response = await api.get(`${PLANS_API}/statistics/overall`);
    return response.data;
  },

  getPlanTypeStatistics: async (planType: string): Promise<{
    plan_type: string;
    total_plans: number;
    total_activities: number;
    active_plans: number;
    completed_plans: number;
    average_progress: number;
    plans: Array<{
      plan_id: string;
      plan_title: string;
      fiscal_year: string;
      status: string;
      progress: number;
      activities_count: number;
    }>;
  }> => {
    const response = await api.get(`${PLANS_API}/statistics/type/${planType}`);
    return response.data;
  },

  getPlanProgressSummary: async (planId: string): Promise<{
    plan_id: string;
    plan_title: string;
    overall_progress: number;
    total_activities: number;
    activities_breakdown: Array<{
      activity_id: string;
      activity_title: string;
      activity_progress: number;
      total_subactivities: number;
      completed_subactivities: number;
    }>;
  }> => {
    const response = await api.get(`${PLANS_API}/${planId}/progress-summary`);
    return response.data;
  }
}; 