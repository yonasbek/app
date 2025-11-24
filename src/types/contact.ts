export enum ContactType {
  MOH_AGENCIES = 'MOH_AGENCIES',
  REGIONAL_HEALTH_BUREAU = 'REGIONAL_HEALTH_BUREAU',
  FEDERAL_HOSPITALS = 'FEDERAL_HOSPITALS',
  ADDIS_ABABA_HOSPITALS = 'ADDIS_ABABA_HOSPITALS',
  UNIVERSITY_HOSPITALS = 'UNIVERSITY_HOSPITALS',
  ASSOCIATIONS = 'ASSOCIATIONS',
  PARTNERS = 'PARTNERS',
  MOH = 'MOH',
  OTHER = 'OTHER',
}

export enum ContactPosition {
  HEAD = 'HEAD',
  DEPUTY_HEAD = 'DEPUTY_HEAD',
  MEDICAL_SERVICE_LEAD = 'MEDICAL_SERVICE_LEAD',
  CHIEF_EXECUTIVE_DIRECTOR = 'CHIEF_EXECUTIVE_DIRECTOR',
  MEDICAL_DIRECTOR = 'MEDICAL_DIRECTOR',
  CEO = 'CEO',
  OTHER = 'OTHER',
}

export enum SuggestionType {
  UPDATE = 'UPDATE',
  ADD = 'ADD',
  DELETE = 'DELETE',
}

export enum SuggestionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Contact {
  id: string;
  instituteName: string;
  individualName: string;
  position: ContactPosition;
  phoneNumber: string;
  emailAddress: string;
  organizationType: ContactType;
  region?: string;
  location?: string;
  availableHours?: string;
  alternativePhone?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  instituteName: string;
  individualName: string;
  position: ContactPosition;
  phoneNumber: string;
  emailAddress: string;
  organizationType: ContactType;
  region?: string;
  location?: string;
  availableHours?: string;
  alternativePhone?: string;
  notes?: string;
}

export interface ContactSuggestion {
  id: string;
  suggestionType: SuggestionType;
  status: SuggestionStatus;
  contact_id?: string;
  existingData?: Partial<Contact>;
  suggestedChanges: Partial<Contact>;
  reason?: string;
  adminComment?: string;
  suggestedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reviewedByUser?: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ContactSuggestionFormData {
  suggestionType: SuggestionType;
  contact_id?: string;
  suggestedChanges: Partial<ContactFormData>;
  reason?: string;
}

export interface ContactFilters {
  search?: string;
  organizationType?: ContactType;
  position?: ContactPosition;
  region?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface ContactSearchResponse {
  contacts: Contact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ContactStatistics {
  totalContacts: number;
  activeContacts: number;
  inactiveContacts: number;
  byOrganizationType: Record<ContactType, number>;
  pendingSuggestions: number;
}

export interface AutocompleteResponse {
  institutions: string[];
  regions: string[];
}

export enum RegionType {
  ADDIS_ABABA = 'ADDIS_ABABA',
  AMHARA = 'AMHARA',
  OROMIA = 'OROMIA',
  SNNP = 'SNNP',
  TIGRAY = 'TIGRAY',
  HARARI = 'HARARI',
  GAMBELA = 'GAMBELA',
  BENISHANGUL_GUMUZ = 'BENISHANGUL_GUMUZ',
  AFAR = 'AFAR',
  CENTRAL_ETHIOPIA = 'CENTRAL_ETHIOPIA',
  SIDAMA = 'SIDAMA',
  SOMALI = 'SOMALI',
  SOUTH_ETHIOPIA = 'SOUTH_ETHIOPIA',
  OTHER = 'OTHER',
}

export const Region_LABELS: Record<RegionType, string> = { 
  [RegionType.ADDIS_ABABA]: 'Addis Ababa',
  [RegionType.AMHARA]: 'Amhara',
  [RegionType.OROMIA]: 'Oromia',
  [RegionType.SNNP]: 'SNNP',
  [RegionType.TIGRAY]: 'Tigray',
  [RegionType.HARARI]: 'Harari',
  [RegionType.GAMBELA]: 'Gambela',
  [RegionType.BENISHANGUL_GUMUZ]: 'Benishangul Gumuz',
  [RegionType.AFAR]: 'Afar',
  [RegionType.CENTRAL_ETHIOPIA]: 'Central Ethiopia',
  [RegionType.SIDAMA]: 'Sidama',
  [RegionType.SOMALI]: 'Somali',
  [RegionType.SOUTH_ETHIOPIA]: 'South Ethiopia',
  [RegionType.OTHER]: 'Other',
}

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  [ContactType.MOH_AGENCIES]: 'MoH Agencies',
  [ContactType.REGIONAL_HEALTH_BUREAU]: 'Regional Health Bureau',
  [ContactType.FEDERAL_HOSPITALS]: 'Federal Hospitals',
  [ContactType.ADDIS_ABABA_HOSPITALS]: 'Addis Ababa Hospitals',
  [ContactType.UNIVERSITY_HOSPITALS]: 'University Hospitals',
  [ContactType.ASSOCIATIONS]: 'Associations',
  [ContactType.PARTNERS]: 'Partners',
  [ContactType.MOH]: 'MoH',
  [ContactType.OTHER]: 'Other',
};

export const CONTACT_POSITION_LABELS: Record<ContactPosition, string> = {
  [ContactPosition.HEAD]: 'Head',
  [ContactPosition.DEPUTY_HEAD]: 'Deputy Head',
  [ContactPosition.MEDICAL_SERVICE_LEAD]: 'Medical Service Lead',
  [ContactPosition.CHIEF_EXECUTIVE_DIRECTOR]: 'Chief Executive Director',
  [ContactPosition.MEDICAL_DIRECTOR]: 'Medical Director',
  [ContactPosition.CEO]: 'CEO',
  [ContactPosition.OTHER]: 'Other',
};

export const SUGGESTION_TYPE_LABELS: Record<SuggestionType, string> = {
  [SuggestionType.UPDATE]: 'Update Contact',
  [SuggestionType.ADD]: 'Add New Contact',
  [SuggestionType.DELETE]: 'Delete Contact',
};

export const SUGGESTION_STATUS_LABELS: Record<SuggestionStatus, string> = {
  [SuggestionStatus.PENDING]: 'Pending',
  [SuggestionStatus.APPROVED]: 'Approved',
  [SuggestionStatus.REJECTED]: 'Rejected',
}; 