// Enums
export enum EnrollmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

// Main Entities
export interface Course {
  id: string;
  title: string;
  description?: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  trainers?: Trainer[];
  enrollments?: CourseEnrollment[];
}

export interface Trainer {
  id: string;
  name: string;
  phone?: string;
  email: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  courses?: Course[];
}

export interface Trainee {
  id: string;
  name: string;
  phone?: string;
  email: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  enrollments?: CourseEnrollment[];
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  trainee_id: string;
  status: EnrollmentStatus;
  enrolled_at: Date;
  started_at?: Date;
  completed_at?: Date;
  progress_percentage?: number;
  final_grade?: number;
  attendance_required: boolean;
  total_sessions: number;
  payment_required: boolean;
  amount_paid?: number;
  payment_method?: string;
  payment_reference?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  course?: Course;
  trainee?: Trainee;
}

// Form Data Types
export interface CourseFormData {
  title: string;
  description?: string;
  is_active: boolean;
}

export interface TrainerFormData {
  name: string;
  phone?: string;
  email: string;
  is_active: boolean;
}

export interface TraineeFormData {
  name: string;
  phone?: string;
  email: string;
  is_active: boolean;
}

export interface EnrollmentFormData {
  course_id: string;
  trainee_id: string;
  attendance_required: boolean;
  total_sessions: number;
  payment_required: boolean;
  amount_paid?: number;
  payment_method?: string;
  payment_reference?: string;
  notes?: string;
}

export interface AssignTrainerFormData {
  trainer_ids: string[];
}

// Filter Types
export interface CourseFilters {
  search?: string;
  status?: string;
  level?: string;
  is_active?: boolean;
}

export interface TrainerFilters {
  search?: string;
  status?: string;
  specialization?: string;
  is_active?: boolean;
}

export interface TraineeFilters {
  search?: string;
  status?: string;
  organization?: string;
  is_active?: boolean;
}

export interface EnrollmentFilters {
  search?: string;
  status?: string;
  course_id?: string;
  trainee_id?: string;
}

// Statistics Types
export interface CourseStatistics {
  total_enrollments: number;
  completed_enrollments: number;
  in_progress_enrollments: number;
  pending_enrollments: number;
  completion_rate: number;
  average_progress: number;
}

export interface TrainerStatistics {
  total_courses: number;
  active_courses: number;
  total_trainees: number;
  average_rating: number;
}

export interface TraineeStatistics {
  total_enrollments: number;
  completed_courses: number;
  in_progress_courses: number;
  average_grade: number;
}

export interface EnrollmentStatistics {
  total_enrollments: number;
  by_status: Record<string, number>;
  by_course: Record<string, number>;
  completion_rate: number;
}