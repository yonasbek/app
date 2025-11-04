import api from '../utils/api';
import {
    MedicalService,
    RegionalAmbulanceService,
    PaginationDto,
    PaginatedResponse,
    MedicalServiceStats,
    AmbulanceServiceStats,
    MedicalDashboardDto,
    RegionalAmbulanceDashboardDto,
    UniqueListResponseDto
} from '../types/medical-service';

export class MedicalServiceAPI {
    private baseUrl = '/medical-services';

    // Medical Services endpoints
    async getAllMedicalServices(pagination: PaginationDto = {}): Promise<MedicalService[]> {
        const params = new URLSearchParams();
        if (pagination.page) params.append('page', pagination.page.toString());
        if (pagination.limit) params.append('limit', pagination.limit.toString());

        const response = await api.get(`${this.baseUrl}/medical?${params.toString()}`);
        return response.data;
    }

    async getMedicalServiceById(id: string): Promise<MedicalService> {
        const response = await api.get(`${this.baseUrl}/medical/${id}`);
        return response.data;
    }

    async searchMedicalServicesByRegion(region: string, pagination: PaginationDto = {}): Promise<PaginatedResponse<MedicalService>> {
        const params = new URLSearchParams();
        params.append('region', region);
        if (pagination.page) params.append('page', pagination.page.toString());
        if (pagination.limit) params.append('limit', pagination.limit.toString());

        const response = await api.get(`${this.baseUrl}/medical/search/region?${params.toString()}`);
        return response.data;
    }

    async searchMedicalServicesByLevel(level: string, pagination: PaginationDto = {}): Promise<PaginatedResponse<MedicalService>> {
        const params = new URLSearchParams();
        params.append('level', level);
        if (pagination.page) params.append('page', pagination.page.toString());
        if (pagination.limit) params.append('limit', pagination.limit.toString());

        const response = await api.get(`${this.baseUrl}/medical/search/level?${params.toString()}`);
        return response.data;
    }

    // Regional Ambulance Services endpoints
    async getAllRegionalAmbulanceServices(pagination: PaginationDto = {}): Promise<PaginatedResponse<RegionalAmbulanceService>> {
        const params = new URLSearchParams();
        if (pagination.page) params.append('page', pagination.page.toString());
        if (pagination.limit) params.append('limit', pagination.limit.toString());

        const response = await api.get(`${this.baseUrl}/regional-ambulance?${params.toString()}`);
        return response.data;
    }

    async getRegionalAmbulanceServiceById(id: string): Promise<RegionalAmbulanceService> {
        const response = await api.get(`${this.baseUrl}/regional-ambulance/${id}`);
        return response.data;
    }

    async searchRegionalAmbulanceServicesByRegion(region: string, pagination: PaginationDto = {}): Promise<PaginatedResponse<RegionalAmbulanceService>> {
        const params = new URLSearchParams();
        params.append('region', region);
        if (pagination.page) params.append('page', pagination.page.toString());
        if (pagination.limit) params.append('limit', pagination.limit.toString());

        const response = await api.get(`${this.baseUrl}/regional-ambulance/search/region?${params.toString()}`);
        return response.data;
    }

    // Dashboard endpoints
    async getMedicalDashboard(): Promise<MedicalDashboardDto> {
        const response = await api.get(`${this.baseUrl}/medical/dashboard`);
        return response.data;
    }

    async getRegionalAmbulanceDashboard(): Promise<RegionalAmbulanceDashboardDto> {
        const response = await api.get(`${this.baseUrl}/regional-ambulance/dashboard`);
        return response.data;
    }

    // Lookup endpoints for unique values
    async getUniqueRegions(): Promise<UniqueListResponseDto> {
        const response = await api.get(`${this.baseUrl}/medical/unique/regions`);
        return response.data;
    }

    async getUniqueHospitals(): Promise<UniqueListResponseDto> {
        const response = await api.get(`${this.baseUrl}/medical/unique/hospitals`);
        return response.data;
    }

    async getUniqueHospitalLevels(): Promise<UniqueListResponseDto> {
        const response = await api.get(`${this.baseUrl}/medical/unique/hospital-levels`);
        return response.data;
    }

    async getUniqueImagingServices(): Promise<UniqueListResponseDto> {
        const response = await api.get(`${this.baseUrl}/medical/unique/imaging-services`);
        return response.data;
    }

    async getUniquePathologyServices(): Promise<UniqueListResponseDto> {
        const response = await api.get(`${this.baseUrl}/medical/unique/pathology-services`);
        return response.data;
    }

    async getHospitalsByRegion(region: string): Promise<UniqueListResponseDto> {
        const response = await api.get(`${this.baseUrl}/medical/unique/hospitals/by-region?region=${encodeURIComponent(region)}`);
        return response.data;
    }

    async getHospitalsByLevel(level: string): Promise<UniqueListResponseDto> {
        const response = await api.get(`${this.baseUrl}/medical/unique/hospitals/by-level?level=${encodeURIComponent(level)}`);
        return response.data;
    }

    async getUniqueAmbulanceRegions(): Promise<UniqueListResponseDto> {
        const response = await api.get(`${this.baseUrl}/medical/unique/regions`);
        return response.data;
    }

    // Legacy analytics methods (kept for backward compatibility)
    async getMedicalServiceStats(): Promise<MedicalServiceStats> {
        const response = await this.getAllMedicalServices(); // Get all for stats
        const data = response;

        const totalHospitals = data.length;
        const totalBeds = data.reduce((sum, hospital) =>
            sum + hospital.noOfGeneralWardBeds + hospital.noOfIcuBeds + hospital.noOfEmergencyBeds +
            hospital.noOfNicuBeds + hospital.noOfPediatricsICUBeds, 0
        );
        const totalNicuBeds = data.reduce((sum, hospital) => sum + hospital.noOfNicuBeds, 0);
        const totalIcuBeds = data.reduce((sum, hospital) => sum + hospital.noOfIcuBeds, 0);
        const totalEmergencyBeds = data.reduce((sum, hospital) => sum + hospital.noOfEmergencyBeds, 0);
        const totalOrTables = data.reduce((sum, hospital) => sum + hospital.noOfOrTables, 0);
        const averageDistanceFromCity = data.reduce((sum, hospital) => sum + hospital.distanceFromCity, 0) / totalHospitals;

        // Group by region
        const regionMap = new Map<string, number>();
        data.forEach(hospital => {
            const count = regionMap.get(hospital.region) || 0;
            regionMap.set(hospital.region, count + 1);
        });
        const hospitalsByRegion = Array.from(regionMap.entries()).map(([region, count]) => ({ region, count }));

        // Group by level
        const levelMap = new Map<string, number>();
        data.forEach(hospital => {
            const level = hospital.levelOfHospital || 'Unknown';
            const count = levelMap.get(level) || 0;
            levelMap.set(level, count + 1);
        });
        const hospitalsByLevel = Array.from(levelMap.entries()).map(([level, count]) => ({ level, count }));

        return {
            totalHospitals,
            totalBeds,
            totalNicuBeds,
            totalIcuBeds,
            totalEmergencyBeds,
            totalOrTables,
            averageDistanceFromCity,
            hospitalsByRegion,
            hospitalsByLevel
        };
    }

    async getAmbulanceServiceStats(): Promise<AmbulanceServiceStats> {
        const response = await this.getAllRegionalAmbulanceServices({ limit: 1000 }); // Get all for stats
        const data = response.data;

        const totalRegions = data.length;
        const totalBeds = data.reduce((sum, service) => sum + service.noOfBeds, 0);
        const totalAmbulances = data.reduce((sum, service) => sum + service.totalNoOfBasicAndAdvanced, 0);
        const functionalAmbulances = data.reduce((sum, service) => sum + service.noOfAmbulanceFunctional, 0);
        const nonFunctionalAmbulances = data.reduce((sum, service) => sum + service.TotalNoOfNonfunctionalAndDamgedAmbulance, 0);
        const totalParamedics = data.reduce((sum, service) => sum + service.noOfParamedicsEmt, 0);
        const paramedicsOnAmbulance = data.reduce((sum, service) => sum + service.noOfParamedicsEmtWorkingOnAmbulance, 0);
        const privateHospitals = data.reduce((sum, service) => sum + service.noOfPrivateHospitals, 0);
        const oxygenPlants = data.reduce((sum, service) => sum + service.noOfFunctionalOxygenPlant, 0);
        const dispatchCenters = data.reduce((sum, service) => sum + service.noOfAmbulanceDispatchCenter, 0);
        const callCenters = data.reduce((sum, service) => sum + service.noOfAmbulanceCallCenter, 0);

        return {
            totalRegions,
            totalBeds,
            totalAmbulances,
            functionalAmbulances,
            nonFunctionalAmbulances,
            totalParamedics,
            paramedicsOnAmbulance,
            privateHospitals,
            oxygenPlants,
            dispatchCenters,
            callCenters
        };
    }
}

export const medicalServiceAPI = new MedicalServiceAPI();
