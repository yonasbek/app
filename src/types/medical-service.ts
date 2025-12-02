export interface MedicalService {
  id: string;
  hospitalName: string;
  levelOfHospital?: string;
  region: string;
  distanceFromCity: number;
  noOfNicuBeds: number;
  noOfPediatricsICUBeds: number;
  noOfIcuBeds: number;
  noOfEmergencyBeds: number;
  noOfGeneralWardBeds: number;
  noOfOrTables: number;
  essentialLabratoryServicesAvailable?: string;
  typeCodeOfImagingServices?: string[];
  typeCodeOfPatologyServices?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RegionalAmbulanceService {
  id: string;
  listOfRegions: string;
  noOfBeds: number;
  noOfNicuBeds: number;
  noOfPediatricsIcuBeds: number;
  noOfIcuBeds: number;
  noOfEmergencyBeds: number;
  noOfGeneralWardBeds: number;
  noOfOrTables: number;
  noOfFunctionalOxygenPlant: number;
  noOfPrivateHospitals: number;
  noOfBasicAmbulances: number;
  noOfAdvancedAmbulances: number;
  totalNoOfBasicAndAdvanced: number;
  noOfAmbulanceFunctional: number;
  noOfAmbulanceNonfunctional: number;
  noOfAmbulanceDamaged: number;
  TotalNoOfNonfunctionalAndDamgedAmbulance: number;
  noOfRefurbishedAmbulances: number;
  noOfAmbulanceDispatchCenter: number;
  noOfAmbulanceCallCenter: number;
  noOfFunctionalPrivateAmbulances: number;
  noOfParamedicsEmt: number;
  noOfParamedicsEmtWorkingOnAmbulance: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Medical Dashboard DTOs
export interface DashboardCardDto {
  title: string;
  value: number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  colorClass?: string;
}

export interface RegionStatsDto {
  region: string;
  hospitalCount: number;
  totalBeds: number;
  icuBeds: number;
  emergencyBeds: number;
  orTables: number;
}

export interface HospitalLevelStatsDto {
  level: string;
  count: number;
  percentage: number;
}

export interface ServiceAvailabilityDto {
  service: string;
  available: number;
  notAvailable: number;
  percentage: number;
}

export interface ImagingServiceStatsDto {
  service: string;
  count: number;
  percentage: number;
}

export interface PathologyServiceStatsDto {
  service: string;
  count: number;
  percentage: number;
}

export interface DistanceAnalysisDto {
  range: string;
  count: number;
  percentage: number;
}

export interface MedicalDashboardDto {
  cards: DashboardCardDto[];
  regionStats: RegionStatsDto[];
  hospitalLevelStats: HospitalLevelStatsDto[];
  serviceAvailability: ServiceAvailabilityDto[];
  imagingServices: ImagingServiceStatsDto[];
  pathologyServices: PathologyServiceStatsDto[];
  distanceAnalysis: DistanceAnalysisDto[];
}

// Regional Ambulance Dashboard DTOs
export interface AmbulanceDashboardCardDto {
  title: string;
  value: number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  colorClass?: string;
}

export interface AmbulanceRegionStatsDto {
  region: string;
  totalAmbulances: number;
  functionalAmbulances: number;
  nonFunctionalAmbulances: number;
  damagedAmbulances: number;
  functionalityRate: number;
}

export interface AmbulanceTypeStatsDto {
  type: string;
  count: number;
  percentage: number;
}

export interface ParamedicStatsDto {
  title: string;
  total: number;
  workingOnAmbulance: number;
  utilizationRate: number;
}

export interface InfrastructureStatsDto {
  facility: string;
  count: number;
  colorClass: string;
}

export interface RegionalAmbulanceDashboardDto {
  cards: AmbulanceDashboardCardDto[];
  regionStats: AmbulanceRegionStatsDto[];
  ambulanceTypeStats: AmbulanceTypeStatsDto[];
  paramedicStats: ParamedicStatsDto;
  infrastructureStats: InfrastructureStatsDto[];
}

// Lookup API DTOs
export interface UniqueListResponseDto {
  data: string[];
  total: number;
}

// Legacy interfaces for backward compatibility
export interface MedicalServiceStats {
  totalHospitals: number;
  totalBeds: number;
  totalNicuBeds: number;
  totalIcuBeds: number;
  totalEmergencyBeds: number;
  totalOrTables: number;
  averageDistanceFromCity: number;
  hospitalsByRegion: { region: string; count: number }[];
  hospitalsByLevel: { level: string; count: number }[];
}

export interface AmbulanceServiceStats {
  totalRegions: number;
  totalBeds: number;
  totalAmbulances: number;
  functionalAmbulances: number;
  nonFunctionalAmbulances: number;
  totalParamedics: number;
  paramedicsOnAmbulance: number;
  privateHospitals: number;
  oxygenPlants: number;
  dispatchCenters: number;
  callCenters: number;
}
