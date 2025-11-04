export interface Week {
  id: string;
  week_number: number;
  year: number;
  label: string;
  created_at?: string;
  updated_at?: string;
}

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
  start_week_id: string;
  start_week?: Week;
  end_week_id: string;
  end_week?: Week;
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
  weight?: number;

}

export interface CreateSubActivityDto {
  title: string;
  description?: string;
  user_id: string;
  start_week_id: string;
  end_week_id: string;
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