'use client';

import { useState, useEffect, useMemo } from 'react';
import { medicalServiceAPI } from '../../services/medicalService';
import { RegionalAmbulanceService } from '../../types/medical-service';
import { Download, Plus, Activity, MapPin, BarChart3 } from 'lucide-react';
import AmbulanceServiceCharts from './AmbulanceServiceCharts';

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

interface AmbulanceServiceReportsProps {
    onViewDetails?: (service: RegionalAmbulanceService) => void;
    onEdit?: (service: RegionalAmbulanceService) => void;
    onDelete?: (service: RegionalAmbulanceService) => void;
    onCreate?: () => void;
}

export default function AmbulanceServiceReports({
    onViewDetails,
    onEdit,
    onDelete,
    onCreate
}: AmbulanceServiceReportsProps) {
    // Data states
    const [allServices, setAllServices] = useState<RegionalAmbulanceService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewType, setViewType] = useState<'table' | 'charts'>('table');

    // Filter states
    const [regionFilter, setRegionFilter] = useState('');
    const [sortBy, setSortBy] = useState<keyof RegionalAmbulanceService>('listOfRegions');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Available options for filters
    const [availableRegions, setAvailableRegions] = useState<string[]>([]);

    // Memoize filter fields to prevent unnecessary re-renders
    const filterFields = useMemo(() => ({
        listOfRegions: {
            value: regionFilter,
            onChange: setRegionFilter,
            options: availableRegions.map(region => ({ value: region, label: region }))
        }
    }), [regionFilter, availableRegions]);

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
        searchFields: ['listOfRegions'],
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

            const response = await medicalServiceAPI.getAllRegionalAmbulanceServices();
            setAllServices(response.data);

            // Extract unique regions for filter options
            const regions = [...new Set(response.data.map(s => s.listOfRegions))].sort();
            setAvailableRegions(regions);

        } catch (err) {
            setError('Failed to load ambulance services');
            console.error('Error fetching services:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        const headers = [
            'Regions',
            'Total Beds',
            'NICU Beds',
            'Pediatric ICU Beds',
            'ICU Beds',
            'Emergency Beds',
            'General Ward Beds',
            'OR Tables',
            'Functional Oxygen Plants',
            'Private Hospitals',
            'Basic Ambulances',
            'Advanced Ambulances',
            'Total Basic & Advanced',
            'Functional Ambulances',
            'Non-Functional Ambulances',
            'Damaged Ambulances',
            'Refurbished Ambulances',
            'Dispatch Centers',
            'Call Centers',
            'Private Ambulances',
            'Total Paramedics',
            'Paramedics on Ambulance'
        ];

        const csvData = displayedServices.map(service => [
            service.listOfRegions,
            service.noOfBeds,
            service.noOfNicuBeds,
            service.noOfPediatricsIcuBeds,
            service.noOfIcuBeds,
            service.noOfEmergencyBeds,
            service.noOfGeneralWardBeds,
            service.noOfOrTables,
            service.noOfFunctionalOxygenPlant,
            service.noOfPrivateHospitals,
            service.noOfBasicAmbulances,
            service.noOfAdvancedAmbulances,
            service.totalNoOfBasicAndAdvanced,
            service.noOfAmbulanceFunctional,
            service.noOfAmbulanceNonfunctional,
            service.noOfAmbulanceDamaged,
            service.noOfRefurbishedAmbulances,
            service.noOfAmbulanceDispatchCenter,
            service.noOfAmbulanceCallCenter,
            service.noOfFunctionalPrivateAmbulances,
            service.noOfParamedicsEmt,
            service.noOfParamedicsEmtWorkingOnAmbulance
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `ambulance-services-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getFunctionalityRate = (service: RegionalAmbulanceService) => {
        const total = service.totalNoOfBasicAndAdvanced;
        const functional = service.noOfAmbulanceFunctional;
        return total > 0 ? ((functional / total) * 100).toFixed(1) : '0.0';
    };

    // Table columns configuration - memoized to prevent re-renders
    const columns = useMemo(() => [
        {
            key: 'listOfRegions',
            label: 'Regions',
            render: (value: string) => (
                <div className="text-sm font-semibold text-app-foreground">{value}</div>
            )
        },
        {
            key: 'noOfBeds',
            label: 'Total Beds',
            render: (value: number) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {value.toLocaleString()}
                </span>
            )
        },
        {
            key: 'totalNoOfBasicAndAdvanced',
            label: 'Total Ambulances',
            render: (value: number) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {value}
                </span>
            )
        },
        {
            key: 'noOfAmbulanceFunctional',
            label: 'Functional',
            render: (value: number) => (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
                    {value}
                </span>
            )
        },
        {
            key: 'functionalityRate',
            label: 'Functionality Rate',
            render: (value: any, item: RegionalAmbulanceService) => {
                const rate = parseFloat(getFunctionalityRate(item));
                return (
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${rate >= 80 ? 'bg-green-100 text-green-800' :
                        rate >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {rate}%
                    </span>
                );
            }
        },
        {
            key: 'noOfParamedicsEmt',
            label: 'Paramedics',
            render: (value: number) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
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
                title="Ambulance Services Reports"
                description="Comprehensive ambulance services data with export and filtering"
            >
                <ViewToggle
                    viewType={viewType}
                    onViewChange={setViewType}
                    theme="red"
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
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 hover:shadow-md"
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
                searchPlaceholder="Type region name..."
                filters={[
                    {
                        label: 'Region',
                        value: regionFilter,
                        options: availableRegions.map(region => ({ value: region, label: region })),
                        onChange: setRegionFilter,
                        onClear: () => setRegionFilter('')
                    }
                ]}
                isFiltering={isFiltering}
                hasActiveFilters={hasActiveFilters}
                filterCount={getFilterCount()}
                onClearAll={clearFilters}
                filteredCount={filteredServices.length}
                totalCount={allServices.length}
                theme="red"
            />

            {/* Sort Controls */}
            <div className="flex justify-between items-center">
                <SortControls
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortChange={(field) => setSortBy(field as keyof RegionalAmbulanceService)}
                    onSortOrderToggle={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    sortOptions={[
                        { value: 'listOfRegions', label: 'Regions' },
                        { value: 'totalNoOfBasicAndAdvanced', label: 'Total Ambulances' },
                        { value: 'noOfAmbulanceFunctional', label: 'Functional Ambulances' },
                        { value: 'noOfBeds', label: 'Total Beds' }
                    ]}
                    theme="red"
                />
            </div>



            {/* Conditional Rendering with Transition */}
            <ViewTransition viewType={viewType}>
                {viewType === 'charts' ? (
                    <AmbulanceServiceCharts
                        data={allServices}
                        searchTerm={debouncedSearchTerm}
                        regionFilter={regionFilter}
                    />
                ) : (
                    <>
                        {/* Results Summary */}
                        <ResultsSummary
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.totalItems}
                            itemsPerPage={pagination.itemsPerPage}
                            hasActiveFilters={hasActiveFilters}
                            theme="red"
                        />

                        {/* Multiple Reports Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 my-4">
                            {/* Quick Stats Report */}
                            <ReportCard title="Quick Stats" icon={Activity} color="red">
                                <div className="space-y-4">
                                    <StatsCard
                                        title="Total Regions"
                                        value={filteredServices.length}
                                        icon={Activity}
                                        color="red"
                                    />
                                    <StatsCard
                                        title="Total Ambulances"
                                        value={filteredServices.reduce((sum, s) => sum + s.totalNoOfBasicAndAdvanced, 0)}
                                        icon={BarChart3}
                                        color="green"
                                    />
                                    <StatsCard
                                        title="Functional"
                                        value={filteredServices.reduce((sum, s) => sum + s.noOfAmbulanceFunctional, 0)}
                                        icon={BarChart3}
                                        color="blue"
                                    />
                                    <StatsCard
                                        title="Total Beds"
                                        value={filteredServices.reduce((sum, s) => sum + s.noOfBeds, 0).toLocaleString()}
                                        icon={BarChart3}
                                        color="purple"
                                    />
                                </div>
                            </ReportCard>

                            {/* Functionality Report */}
                            <ReportCard title="Functionality Rate" icon={BarChart3} color="green">
                                <div className="space-y-3">
                                    {filteredServices
                                        .map(service => ({
                                            region: service.listOfRegions,
                                            rate: parseFloat(getFunctionalityRate(service))
                                        }))
                                        .sort((a, b) => b.rate - a.rate)
                                        .slice(0, 5)
                                        .map(({ region, rate }) => (
                                            <div key={region} className="flex justify-between items-center">
                                                <span className="text-sm text-neutral-600 truncate">{region}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 bg-neutral-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${rate >= 80 ? 'bg-green-500' :
                                                                rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${rate}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-sm font-semibold ${rate >= 80 ? 'text-green-600' :
                                                        rate >= 60 ? 'text-yellow-600' : 'text-red-600'
                                                        }`}>
                                                        {rate}%
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </ReportCard>

                            {/* Infrastructure Report */}
                            <ReportCard title="Infrastructure" icon={MapPin} color="purple">
                                <div className="space-y-3">
                                    <StatsCard
                                        title="Dispatch Centers"
                                        value={filteredServices.reduce((sum, s) => sum + s.noOfAmbulanceDispatchCenter, 0)}
                                        icon={MapPin}
                                        color="blue"
                                    />
                                    <StatsCard
                                        title="Call Centers"
                                        value={filteredServices.reduce((sum, s) => sum + s.noOfAmbulanceCallCenter, 0)}
                                        icon={MapPin}
                                        color="green"
                                    />
                                    <StatsCard
                                        title="Oxygen Plants"
                                        value={filteredServices.reduce((sum, s) => sum + s.noOfFunctionalOxygenPlant, 0)}
                                        icon={MapPin}
                                        color="orange"
                                    />
                                    <StatsCard
                                        title="Private Hospitals"
                                        value={filteredServices.reduce((sum, s) => sum + s.noOfPrivateHospitals, 0)}
                                        icon={MapPin}
                                        color="purple"
                                    />
                                </div>
                            </ReportCard>
                        </div>
                        {/* Data Table */}
                        <DataTable
                            data={displayedServices}
                            columns={columns}
                            actions={actions}
                            theme="red"
                        />

                        {/* Pagination */}
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={setCurrentPage}
                            theme="red"
                        />
                    </>
                )}
            </ViewTransition>
        </div>
    );
}