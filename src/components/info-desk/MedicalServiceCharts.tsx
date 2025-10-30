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
import { MedicalService } from '../../types/medical-service';

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

interface MedicalServiceChartsProps {
  data: MedicalService[];
  searchTerm: string;
  regionFilter: string;
  levelFilter: string;
}

export default function MedicalServiceCharts({ 
  data,
  searchTerm, 
  regionFilter, 
  levelFilter 
}: MedicalServiceChartsProps) {

  // Client-side filtering for charts
  const filteredServices = useMemo(() => {
    let filtered = [...data];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.levelOfHospital && service.levelOfHospital.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply region filter
    if (regionFilter) {
      filtered = filtered.filter(service => service.region === regionFilter);
    }

    // Apply level filter
    if (levelFilter) {
      filtered = filtered.filter(service => service.levelOfHospital === levelFilter);
    }

        return filtered;
      }, [data, searchTerm, regionFilter, levelFilter]);

  // Process data for charts using filtered services
  const regionStats = filteredServices.reduce((acc, service) => {
    acc[service.region] = (acc[service.region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const levelStats = filteredServices.reduce((acc, service) => {
    const level = service.levelOfHospital || 'Unknown';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bedStats = filteredServices.reduce((acc, service) => {
    acc.totalBeds = (acc.totalBeds || 0) + service.noOfGeneralWardBeds + service.noOfIcuBeds + service.noOfEmergencyBeds + service.noOfNicuBeds + service.noOfPediatricsICUBeds;
    acc.icuBeds = (acc.icuBeds || 0) + service.noOfIcuBeds;
    acc.emergencyBeds = (acc.emergencyBeds || 0) + service.noOfEmergencyBeds;
    acc.nicuBeds = (acc.nicuBeds || 0) + service.noOfNicuBeds;
    acc.pediatricIcuBeds = (acc.pediatricIcuBeds || 0) + service.noOfPediatricsICUBeds;
    acc.orTables = (acc.orTables || 0) + service.noOfOrTables;
    return acc;
  }, {} as Record<string, number>);

  // Distance analysis
  const distanceRanges = filteredServices.reduce((acc, service) => {
    const distance = service.distanceFromCity;
    if (distance <= 50) acc['0-50 km'] = (acc['0-50 km'] || 0) + 1;
    else if (distance <= 100) acc['51-100 km'] = (acc['51-100 km'] || 0) + 1;
    else if (distance <= 200) acc['101-200 km'] = (acc['101-200 km'] || 0) + 1;
    else acc['200+ km'] = (acc['200+ km'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Chart configurations
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Medical Services Analysis',
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
  const regionChartData = {
    labels: Object.keys(regionStats),
    datasets: [
      {
        label: 'Number of Hospitals',
        data: Object.values(regionStats),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
          '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
        ],
        borderColor: [
          '#1E40AF', '#059669', '#D97706', '#DC2626', '#7C3AED',
          '#0891B2', '#65A30D', '#EA580C', '#DB2777', '#4F46E5'
        ],
        borderWidth: 2,
      },
    ],
  };

  const levelChartData = {
    labels: Object.keys(levelStats),
    datasets: [
      {
        label: 'Number of Hospitals',
        data: Object.values(levelStats),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
        ],
        borderColor: [
          '#1E40AF', '#059669', '#D97706', '#DC2626', '#7C3AED'
        ],
        borderWidth: 2,
      },
    ],
  };

  const bedDistributionData = {
    labels: ['ICU Beds', 'Emergency Beds', 'NICU Beds', 'Pediatric ICU Beds', 'General Ward Beds'],
    datasets: [
      {
        label: 'Number of Beds',
        data: [
          bedStats.icuBeds || 0,
          bedStats.emergencyBeds || 0,
          bedStats.nicuBeds || 0,
          bedStats.pediatricIcuBeds || 0,
          (bedStats.totalBeds || 0) - (bedStats.icuBeds || 0) - (bedStats.emergencyBeds || 0) - (bedStats.nicuBeds || 0) - (bedStats.pediatricIcuBeds || 0)
        ],
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
        ],
        borderColor: [
          '#1E40AF', '#059669', '#D97706', '#DC2626', '#7C3AED'
        ],
        borderWidth: 2,
      },
    ],
  };

  const distanceChartData = {
    labels: Object.keys(distanceRanges),
    datasets: [
      {
        label: 'Number of Hospitals',
        data: Object.values(distanceRanges),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444'
        ],
        borderColor: [
          '#1E40AF', '#059669', '#D97706', '#DC2626'
        ],
        borderWidth: 2,
      },
    ],
  };

  const orTablesData = {
    labels: Object.keys(regionStats),
    datasets: [
      {
        label: 'OR Tables',
        data: Object.keys(regionStats).map(region => 
          filteredServices
            .filter(s => s.region === region)
            .reduce((sum, s) => sum + s.noOfOrTables, 0)
        ),
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
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600">Total Hospitals</h3>
          <p className="text-2xl font-bold text-blue-700">{filteredServices.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-600">Total Beds</h3>
          <p className="text-2xl font-bold text-green-700">{bedStats.totalBeds?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-600">ICU Beds</h3>
          <p className="text-2xl font-bold text-purple-700">{bedStats.icuBeds?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-orange-600">OR Tables</h3>
          <p className="text-2xl font-bold text-orange-700">{bedStats.orTables?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hospitals by Region */}
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
          <h3 className="text-lg font-medium text-app-foreground mb-4">Hospitals by Region</h3>
          <div className="h-80">
            <Bar data={regionChartData} options={chartOptions} />
          </div>
        </div>

        {/* Hospitals by Level */}
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
          <h3 className="text-lg font-medium text-app-foreground mb-4">Hospitals by Level</h3>
          <div className="h-80">
            <Doughnut data={levelChartData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Bed Distribution and Distance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bed Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
          <h3 className="text-lg font-medium text-app-foreground mb-4">Bed Distribution</h3>
          <div className="h-80">
            <Bar data={bedDistributionData} options={chartOptions} />
          </div>
        </div>

        {/* Distance Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
          <h3 className="text-lg font-medium text-app-foreground mb-4">Distance from City</h3>
          <div className="h-80">
            <Pie data={distanceChartData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* OR Tables by Region */}
      <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
        <h3 className="text-lg font-medium text-app-foreground mb-4">OR Tables by Region</h3>
        <div className="h-80">
          <Bar data={orTablesData} options={chartOptions} />
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
                  Hospitals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Total Beds
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  ICU Beds
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Emergency Beds
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  OR Tables
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-app-secondary">
              {Object.entries(regionStats).map(([region, count]) => {
                const regionServices = filteredServices.filter(s => s.region === region);
                const totalBeds = regionServices.reduce((sum, s) => 
                  sum + s.noOfGeneralWardBeds + s.noOfIcuBeds + s.noOfEmergencyBeds + s.noOfNicuBeds + s.noOfPediatricsICUBeds, 0
                );
                const icuBeds = regionServices.reduce((sum, s) => sum + s.noOfIcuBeds, 0);
                const emergencyBeds = regionServices.reduce((sum, s) => sum + s.noOfEmergencyBeds, 0);
                const orTables = regionServices.reduce((sum, s) => sum + s.noOfOrTables, 0);

                return (
                  <tr key={region}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-app-foreground">
                      {region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {totalBeds.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {icuBeds.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {emergencyBeds.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {orTables.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
