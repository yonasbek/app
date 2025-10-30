'use client';

import { useState, useEffect, useMemo } from 'react';
import { medicalServiceAPI } from '../../services/medicalService';
import { MedicalService } from '../../types/medical-service';
import { Download, Plus, BarChart3, MapPin, Stethoscope } from 'lucide-react';
import MedicalServiceCharts from './MedicalServiceCharts';

// Reusable components
import AdvancedFilterPanel from './common/AdvancedFilterPanel';
import DataTable from './common/DataTable';
import Pagination from './common/Pagination';
import ViewToggle from './common/ViewToggle';
import PageHeader from './common/PageHeader';
import ResultsSummary from './common/ResultsSummary';
import ReportCard from './common/ReportCard';
import StatsCard from './common/StatsCard';
import SortControls from './common/SortControls';
import ViewTransition from './common/ViewTransition';
import { useDataFiltering } from '../../hooks/useDataFiltering';

interface MedicalServiceReportsProps {
    onViewDetails?: (service: MedicalService) => void;
    onEdit?: (service: MedicalService) => void;
    onDelete?: (service: MedicalService) => void;
    onCreate?: () => void;
}

export default function MedicalServiceReports({
    onViewDetails,
    onEdit,
    onDelete,
    onCreate
}: MedicalServiceReportsProps) {
    // Data states
    const [allServices, setAllServices] = useState<MedicalService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewType, setViewType] = useState<'table' | 'charts'>('table');

    // Filter states
    const [regionFilter, setRegionFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [sortBy, setSortBy] = useState<keyof MedicalService>('hospitalName');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Available options for filters
    const [availableRegions, setAvailableRegions] = useState<string[]>([]);
    const [availableLevels, setAvailableLevels] = useState<string[]>([]);

    // Memoize filter fields to prevent unnecessary re-renders
    const filterFields = useMemo(() => ({
        region: {
            value: regionFilter,
            onChange: setRegionFilter,
            options: availableRegions.map(region => ({ value: region, label: region }))
        },
        levelOfHospital: {
            value: levelFilter,
            onChange: setLevelFilter,
            options: availableLevels.map(level => ({ value: level, label: level }))
        }
    }), [regionFilter, levelFilter, availableRegions, availableLevels]);

    // Use custom hook for data filtering
    const {
        filteredData: filteredServices,
        paginatedData: displayedServices,
        searchTerm,
        setSearchTerm,
        debouncedSearchTerm,
        pagination,
        setCurrentPage,
        isFiltering,
        hasActiveFilters,
        getFilterCount,
        clearFilters
    } = useDataFiltering({
        data: allServices,
        searchFields: ['hospitalName', 'region', 'levelOfHospital'],
        filterFields,
        sortField: sortBy,
        sortOrder,
        onSortChange: setSortBy,
        onSortOrderToggle: () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc'),
        itemsPerPage: 10
    });

    // Fetch all data once on component mount
    useEffect(() => {
        fetchAllServices();
    }, []);

    const fetchAllServices = async () => {
        try {
            setLoading(true);

            const services = await medicalServiceAPI.getAllMedicalServices();
            setAllServices(services);

            // Extract unique regions and levels for filter options
            const regions = [...new Set(services.map(s => s.region))].sort();
            const levels = [...new Set(services.map(s => s.levelOfHospital).filter(Boolean))].sort() as string[];

            setAvailableRegions(regions);
            setAvailableLevels(levels);

        } catch (err) {
            setError('Failed to load medical services');
            console.error('Error fetching services:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        const headers = [
            'Hospital Name',
            'Level of Hospital',
            'Region',
            'Distance from City (km)',
            'NICU Beds',
            'Pediatric ICU Beds',
            'ICU Beds',
            'Emergency Beds',
            'General Ward Beds',
            'OR Tables',
            'Essential Laboratory Services',
            'Imaging Services',
            'Pathology Services'
        ];

        const csvData = displayedServices.map(service => [
            service.hospitalName,
            service.levelOfHospital || '',
            service.region,
            service.distanceFromCity,
            service.noOfNicuBeds,
            service.noOfPediatricsICUBeds,
            service.noOfIcuBeds,
            service.noOfEmergencyBeds,
            service.noOfGeneralWardBeds,
            service.noOfOrTables,
            service.essentialLabratoryServicesAvailable || '',
            service.typeCodeOfImagingServices?.join(', ') || '',
            service.typeCodeOfPatologyServices?.join(', ') || ''
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `medical-services-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Table columns configuration - memoized to prevent re-renders
    const columns = useMemo(() => [
        {
            key: 'hospitalName',
            label: 'Hospital Name',
            render: (value: string) => (
                <div className="text-sm font-semibold text-app-foreground">{value}</div>
            )
        },
        {
            key: 'levelOfHospital',
            label: 'Level',
            render: (value: string) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {value || 'N/A'}
                </span>
            )
        },
        {
            key: 'region',
            label: 'Region',
            render: (value: string) => (
                <span className="text-sm text-neutral-600">{value}</span>
            )
        },
        {
            key: 'distanceFromCity',
            label: 'Distance (km)',
            render: (value: number) => (
                <span className="text-sm text-neutral-600">{value} km</span>
            )
        },
        {
            key: 'noOfIcuBeds',
            label: 'ICU Beds',
            render: (value: number) => (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800">
                    {value}
                </span>
            )
        },
        {
            key: 'noOfEmergencyBeds',
            label: 'Emergency Beds',
            render: (value: number) => (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-orange-100 text-orange-800">
                    {value}
                </span>
            )
        }
    ], []);

    // Table actions configuration - memoized to prevent re-renders
    const actions = useMemo(() => [
        ...(onViewDetails ? [{
            icon: require('lucide-react').Eye,
            label: 'View Details',
            onClick: onViewDetails,
            color: 'blue' as const
        }] : []),
        ...(onEdit ? [{
            icon: require('lucide-react').Edit,
            label: 'Edit',
            onClick: onEdit,
            color: 'green' as const
        }] : []),
        ...(onDelete ? [{
            icon: require('lucide-react').Trash2,
            label: 'Delete',
            onClick: onDelete,
            color: 'red' as const
        }] : [])
    ], [onViewDetails, onEdit, onDelete]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Medical Services Reports"
                description="Comprehensive medical services data with export and filtering"
            >
                <ViewToggle
                    viewType={viewType}
                    onViewChange={setViewType}
                    theme="blue"
                />
                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-app-foreground text-white rounded-lg  transition-all duration-200 hover:shadow-md"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
                {/* {onCreate && (
                    <button
                        onClick={onCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        Add Service
                    </button>
                )} */}
            </PageHeader>

            {/* Advanced Filter Panel */}
            <AdvancedFilterPanel
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Type hospital name, region, or level..."
                filters={[
                    {
                        label: 'Region',
                        value: regionFilter,
                        options: availableRegions.map(region => ({ value: region, label: region })),
                        onChange: setRegionFilter,
                        onClear: () => setRegionFilter('')
                    },
                    {
                        label: 'Level',
                        value: levelFilter,
                        options: availableLevels.map(level => ({ value: level, label: level })),
                        onChange: setLevelFilter,
                        onClear: () => setLevelFilter('')
                    }
                ]}
                isFiltering={isFiltering}
                hasActiveFilters={hasActiveFilters}
                filterCount={getFilterCount()}
                onClearAll={clearFilters}
                filteredCount={filteredServices.length}
                totalCount={allServices.length}
                theme="blue"
            />





            {/* Conditional Rendering with Transition */}
            <ViewTransition viewType={viewType}>
                {viewType === 'charts' ? (
                    <MedicalServiceCharts
                        data={allServices}
                        searchTerm={debouncedSearchTerm}
                        regionFilter={regionFilter}
                        levelFilter={levelFilter}
                    />
                ) : (
                    <>
                        {/* Sort Controls */}
                        <div className="flex justify-between items-center my-4">
                            <SortControls
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSortChange={(field) => setSortBy(field as keyof MedicalService)}
                                onSortOrderToggle={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                sortOptions={[
                                    { value: 'hospitalName', label: 'Hospital Name' },
                                    { value: 'region', label: 'Region' },
                                    { value: 'levelOfHospital', label: 'Level' },
                                    { value: 'distanceFromCity', label: 'Distance' }
                                ]}
                                theme="blue"
                            />
                        </div>

                        {/* Results Summary */}
                        <ResultsSummary
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.totalItems}
                            itemsPerPage={pagination.itemsPerPage}
                            hasActiveFilters={hasActiveFilters}
                            theme="blue"
                        />
                        {/* Multiple Reports Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 my-4">
                            {/* Quick Stats Report */}
                            <ReportCard title="Quick Stats" icon={BarChart3} color="blue">
                                <div className="space-y-4">
                                    <StatsCard
                                        title="Total Hospitals"
                                        value={filteredServices.length}
                                        icon={Stethoscope}
                                        color="blue"
                                    />
                                    <StatsCard
                                        title="Total ICU Beds"
                                        value={filteredServices.reduce((sum, s) => sum + s.noOfIcuBeds, 0)}
                                        icon={BarChart3}
                                        color="green"
                                    />
                                    <StatsCard
                                        title="Emergency Beds"
                                        value={filteredServices.reduce((sum, s) => sum + s.noOfEmergencyBeds, 0)}
                                        icon={BarChart3}
                                        color="orange"
                                    />
                                    <StatsCard
                                        title="OR Tables"
                                        value={filteredServices.reduce((sum, s) => sum + s.noOfOrTables, 0)}
                                        icon={BarChart3}
                                        color="purple"
                                    />
                                </div>
                            </ReportCard>

                            {/* Regional Distribution Report */}
                            <ReportCard title="Regional Distribution" icon={MapPin} color="green">
                                <div className="space-y-3">
                                    {Object.entries(
                                        filteredServices.reduce((acc, service) => {
                                            acc[service.region] = (acc[service.region] || 0) + 1;
                                            return acc;
                                        }, {} as Record<string, number>)
                                    )
                                        .sort(([, a], [, b]) => b - a)
                                        .slice(0, 5)
                                        .map(([region, count]) => (
                                            <div key={region} className="flex justify-between items-center">
                                                <span className="text-sm text-neutral-600">{region}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 bg-neutral-200 rounded-full h-2">
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${(count / Math.max(...Object.values(
                                                                    filteredServices.reduce((acc, service) => {
                                                                        acc[service.region] = (acc[service.region] || 0) + 1;
                                                                        return acc;
                                                                    }, {} as Record<string, number>)
                                                                ))) * 100}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-semibold text-app-foreground">{count}</span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </ReportCard>

                            {/* Hospital Levels Report */}
                            <ReportCard title="Hospital Levels" icon={Stethoscope} color="purple">
                                <div className="space-y-3">
                                    {Object.entries(
                                        filteredServices.reduce((acc, service) => {
                                            const level = service.levelOfHospital || 'Unknown';
                                            acc[level] = (acc[level] || 0) + 1;
                                            return acc;
                                        }, {} as Record<string, number>)
                                    )
                                        .sort(([, a], [, b]) => b - a)
                                        .map(([level, count]) => (
                                            <div key={level} className="flex justify-between items-center p-2 bg-neutral-50 rounded-lg">
                                                <span className="text-sm font-medium text-app-foreground">{level}</span>
                                                <span className="text-sm font-bold text-purple-600">{count}</span>
                                            </div>
                                        ))}
                                </div>
                            </ReportCard>
                        </div>
                        {/* Data Table */}
                        <DataTable
                            data={displayedServices}
                            columns={columns}
                            actions={actions}
                            theme="blue"
                        />

                        {/* Pagination */}
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={setCurrentPage}
                            theme="blue"
                        />
                    </>
                )}
            </ViewTransition>
        </div>
    );
}