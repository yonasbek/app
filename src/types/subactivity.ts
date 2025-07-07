export interface SubActivity {
  id: string;
  title: string;
  description?: string;
  user_id: string;
  user?: {
    id: string;
    email: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
  };
  start_date: string;
  end_date: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  progress: number;
  notes?: string;
  priority: string;
  activity_id: string;
  activity?: {
    id: string;
    title: string;
    plan_type: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CreateSubActivityDto {
  title: string;
  description?: string;
  user_id: string;
  start_date: string;
  end_date: string;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  progress?: number;
  notes?: string;
  priority?: string;
  activity_id: string;
}

export interface UpdateSubActivityDto extends Partial<CreateSubActivityDto> {}

export interface UpdateSubActivityProgressDto {
  progress: number;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  notes?: string;
}

export interface SubActivityStats {
  total: number;
  completed: number;
  in_progress: number;
  not_started: number;
  average_progress: number;
} 