export type TrainingType = 'workshop' | 'event' | 'mentorship' | 'field_trip' | 'other';
export type TrainingLocation = 'local' | 'abroad';

export interface Training {
  id: string;
  title: string;
  type: TrainingType;
  location_type: TrainingLocation;
  location?: string;
  country?: string;
  start_date: string;
  end_date: string;
  organizer?: string;
  description?: string;
  trip_report?: string[];
  photos?: string[];
  attendance?: string[];
  additional_letter?: string[];
  participants_count?: number;
  remarks?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTrainingDto {
  title: string;
  type: TrainingType;
  location_type: TrainingLocation;
  location?: string;
  country?: string;
  start_date: string;
  end_date: string;
  organizer?: string;
  description?: string;
  trip_report?: string[];
  photos?: string[];
  attendance?: string[];
  additional_letter?: string[];
  participants_count?: number;
  remarks?: string;
}

export interface UpdateTrainingDto extends Partial<CreateTrainingDto> {}
