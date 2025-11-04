import { PlanType } from './activity';

export interface Plan {
  id: string;
  title: string;
  fiscal_year: string;
  plan_type: PlanType;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  progress: number;
  calculated_progress?: number; // Calculated from activities' progress
  budget_allocated: number;
  budget_spent: number;
  budget_source?: string[]; // Budget sources: internal, donor, government, partner
  owner: string;
  created_at?: string;
  updated_at?: string;
  activities?: any[]; // Activities array when included in response
}

export interface CreatePlanDto {
  title: string;
  fiscal_year: string;
  plan_type: PlanType;
  status: Plan['status'];
  budget_allocated: number;
  budget_source?: string[]; // Budget sources: internal, donor, government, partner
  owner: string;
}

export interface UpdatePlanDto extends Partial<CreatePlanDto> {} 