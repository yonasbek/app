import { PlanType } from './activity';

export interface Plan {
  id: string;
  title: string;
  fiscal_year: string;
  plan_type: PlanType;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  progress: number;
  budget_allocated: number;
  budget_spent: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePlanDto {
  title: string;
  fiscal_year: string;
  plan_type: PlanType;
  status: Plan['status'];
  budget_allocated: number;
  owner: string;
}

export interface UpdatePlanDto extends Partial<CreatePlanDto> {} 