import type { DepartmentCodeType } from '@/constants/departments';

/** Same as department codes: PFRD, ECCD, HDD, SRD, LEO. Use DEPARTMENT_OPTIONS from @/constants/departments for labels. */
export type PlanType = DepartmentCodeType;

export interface Activity {
  id: string;
  plan_type: PlanType;
  plan_year: string;
  title: string;
  strategic_objective: string;
  responsible_department: string;
  assigned_person: string;
  start_date: string;
  end_date: string;
  budget_allocated: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  progress: number;
  remarks?: string;
  supporting_documents?: string[];
  created_at?: string;
  updated_at?: string;
  plan_id: string;
  flagship_activity?: boolean;
  subactivities?: any[];
}

export interface CreateActivityDto {
  plan_type: PlanType;
  plan_year: string;
  title: string;
  strategic_objective: string;
  responsible_department: string;
  assigned_person: string;
  start_date: string;
  end_date: string;
  budget_allocated: number;
  status: Activity['status'];
  remarks?: string;
  supporting_documents?: string[];
  plan_id: string;
  flagship_activity?: boolean;
  main_activity: string;
}

export interface UpdateActivityDto extends Partial<CreateActivityDto> {} 