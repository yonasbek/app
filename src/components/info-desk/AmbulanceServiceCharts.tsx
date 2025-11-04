'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { RegionalAmbulanceService } from '../../types/medical-service';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

interface AmbulanceServiceChartsProps {
    data: RegionalAmbulanceService[];
    searchTerm: string;
    regionFilter: string;
}

export default function AmbulanceServiceCharts({
    data,
    searchTerm,
    regionFilter
}: AmbulanceServiceChartsProps) {

    // Client-side filtering for charts
    const filteredServices = useMemo(() => {
        let filtered = [...data];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.listOfRegions.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply region filter
        if (regionFilter) {
            filtered = filtered.filter(service => service.listOfRegions === regionFilter);
        }

        return filtered;
    }, [data, searchTerm, regionFilter]);

    // Process data for charts using filtered services
    const regionStats = filteredServices.reduce((acc, service) => {
        acc[service.listOfRegions] = {
            totalAmbulances: service.totalNoOfBasicAndAdvanced,
            functional: service.noOfAmbulanceFunctional,
            nonFunctional: service.noOfAmbulanceNonfunctional,
            damaged: service.noOfAmbulanceDamaged,
            functionalityRate: service.totalNoOfBasicAndAdvanced > 0
                ? (service.noOfAmbulanceFunctional / service.totalNoOfBasicAndAdvanced) * 100
                : 0,
            totalBeds: service.noOfBeds,
            paramedics: service.noOfParamedicsEmt,
            workingParamedics: service.noOfParamedicsEmtWorkingOnAmbulance
        };
        return acc;
    }, {} as Record<string, any>);

    const totalStats = filteredServices.reduce((acc, service) => {
        acc.totalAmbulances += service.totalNoOfBasicAndAdvanced;
        acc.functional += service.noOfAmbulanceFunctional;
        acc.nonFunctional += service.noOfAmbulanceNonfunctional;
        acc.damaged += service.noOfAmbulanceDamaged;
        acc.totalBeds += service.noOfBeds;
        acc.paramedics += service.noOfParamedicsEmt;
        acc.workingParamedics += service.noOfParamedicsEmtWorkingOnAmbulance;
        acc.dispatchCenters += service.noOfAmbulanceDispatchCenter;
        acc.callCenters += service.noOfAmbulanceCallCenter;
        acc.oxygenPlants += service.noOfFunctionalOxygenPlant;
        acc.privateHospitals += service.noOfPrivateHospitals;
        return acc;
    }, {
        totalAmbulances: 0,
        functional: 0,
        nonFunctional: 0,
        damaged: 0,
        totalBeds: 0,
        paramedics: 0,
        workingParamedics: 0,
        dispatchCenters: 0,
        callCenters: 0,
        oxygenPlants: 0,
        privateHospitals: 0
    });

    // Chart configurations
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Ambulance Services Analysis',
            },
        },
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
    };

    // Charts data
    const ambulanceStatusData = {
        labels: Object.keys(regionStats),
        datasets: [
            {
                label: 'Functional',
                data: Object.values(regionStats).map((r: any) => r.functional),
                backgroundColor: '#10B981',
                borderColor: '#059669',
                borderWidth: 2,
            },
            {
                label: 'Non-Functional',
                data: Object.values(regionStats).map((r: any) => r.nonFunctional),
                backgroundColor: '#F59E0B',
                borderColor: '#D97706',
                borderWidth: 2,
            },
            {
                label: 'Damaged',
                data: Object.values(regionStats).map((r: any) => r.damaged),
                backgroundColor: '#EF4444',
                borderColor: '#DC2626',
                borderWidth: 2,
            },
        ],
    };

    const functionalityRatesData = {
        labels: Object.keys(regionStats),
        datasets: [
            {
                label: 'Functionality Rate (%)',
                data: Object.values(regionStats).map((r: any) => r.functionalityRate),
                backgroundColor: '#3B82F6',
                borderColor: '#1E40AF',
                borderWidth: 2,
            },
        ],
    };

    const ambulanceTypesData = {
        labels: ['Basic Ambulances', 'Advanced Ambulances', 'Private Ambulances'],
        datasets: [
            {
                label: 'Count',
                data: [
                    filteredServices.reduce((sum, s) => sum + s.noOfBasicAmbulances, 0),
                    filteredServices.reduce((sum, s) => sum + s.noOfAdvancedAmbulances, 0),
                    filteredServices.reduce((sum, s) => sum + s.noOfFunctionalPrivateAmbulances, 0)
                ],
                backgroundColor: ['#3B82F6', '#8B5CF6', '#F59E0B'],
                borderColor: ['#1E40AF', '#7C3AED', '#D97706'],
                borderWidth: 2,
            },
        ],
    };

    const infrastructureData = {
        labels: ['Dispatch Centers', 'Call Centers', 'Oxygen Plants', 'Private Hospitals'],
        datasets: [
            {
                label: 'Count',
                data: [
                    totalStats.dispatchCenters,
                    totalStats.callCenters,
                    totalStats.oxygenPlants,
                    totalStats.privateHospitals
                ],
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
                borderColor: ['#1E40AF', '#059669', '#D97706', '#DC2626'],
                borderWidth: 2,
            },
        ],
    };

    const paramedicsData = {
        labels: Object.keys(regionStats),
        datasets: [
            {
                label: 'Total Paramedics',
                data: Object.values(regionStats).map((r: any) => r.paramedics),
                backgroundColor: '#3B82F6',
                borderColor: '#1E40AF',
                borderWidth: 2,
            },
            {
                label: 'Working on Ambulances',
                data: Object.values(regionStats).map((r: any) => r.workingParamedics),
                backgroundColor: '#10B981',
                borderColor: '#059669',
                borderWidth: 2,
            },
        ],
    };

    const bedDistributionData = {
        labels: Object.keys(regionStats),
        datasets: [
            {
                label: 'Total Beds',
                data: Object.values(regionStats).map((r: any) => r.totalBeds),
                backgroundColor: '#8B5CF6',
                borderColor: '#7C3AED',
                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-red-600">Total Ambulances</h3>
                    <p className="text-2xl font-bold text-red-700">{totalStats.totalAmbulances.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-600">Functional</h3>
                    <p className="text-2xl font-bold text-green-700">{totalStats.functional.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-600">Functionality Rate</h3>
                    <p className="text-2xl font-bold text-blue-700">
                        {totalStats.totalAmbulances > 0
                            ? ((totalStats.functional / totalStats.totalAmbulances) * 100).toFixed(1)
                            : 0}%
                    </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-600">Total Paramedics</h3>
                    <p className="text-2xl font-bold text-purple-700">{totalStats.paramedics.toLocaleString()}</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ambulance Status by Region */}
                <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
                    <h3 className="text-lg font-medium text-app-foreground mb-4">Ambulance Status by Region</h3>
                    <div className="h-80">
                        <Bar data={ambulanceStatusData} options={chartOptions} />
                    </div>
                </div>

                {/* Functionality Rates */}
                <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
                    <h3 className="text-lg font-medium text-app-foreground mb-4">Functionality Rates by Region</h3>
                    <div className="h-80">
                        <Bar data={functionalityRatesData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Ambulance Types and Infrastructure */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ambulance Types */}
                <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
                    <h3 className="text-lg font-medium text-app-foreground mb-4">Ambulance Types</h3>
                    <div className="h-80">
                        <Doughnut data={ambulanceTypesData} options={doughnutOptions} />
                    </div>
                </div>

                {/* Infrastructure */}
                <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
                    <h3 className="text-lg font-medium text-app-foreground mb-4">Infrastructure Facilities</h3>
                    <div className="h-80">
                        <Bar data={infrastructureData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Paramedics and Beds */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Paramedics Distribution */}
                <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
                    <h3 className="text-lg font-medium text-app-foreground mb-4">Paramedics Distribution</h3>
                    <div className="h-80">
                        <Bar data={paramedicsData} options={chartOptions} />
                    </div>
                </div>

                {/* Bed Distribution */}
                <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
                    <h3 className="text-lg font-medium text-app-foreground mb-4">Bed Distribution by Region</h3>
                    <div className="h-80">
                        <Bar data={bedDistributionData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Regional Analysis Table */}
            <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
                <h3 className="text-lg font-medium text-app-foreground mb-4">Regional Analysis</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-app-secondary">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Region
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Total Ambulances
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Functional
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Functionality Rate
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Total Beds
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Paramedics
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-app-secondary">
                            {Object.entries(regionStats).map(([region, stats]) => (
                                <tr key={region}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-app-foreground">
                                        {region}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                        {stats.totalAmbulances}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                        {stats.functional}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                        <span className={`font-medium ${stats.functionalityRate >= 80 ? 'text-green-600' :
                                            stats.functionalityRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                            {stats.functionalityRate.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                        {stats.totalBeds.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                        {stats.paramedics}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
