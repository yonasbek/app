'use client';

import { useState, useEffect } from 'react';
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
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { medicalServiceAPI } from '../../services/medicalService';
import { MedicalDashboardDto } from '../../types/medical-service';
import {
  Hospital,
  Bed,
  Activity,
  MapPin,
  TrendingUp,
  Users,
  Building2,
  Stethoscope
} from 'lucide-react';

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

export default function MedicalServiceDashboard() {
  const [dashboardData, setDashboardData] = useState<MedicalDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await medicalServiceAPI.getMedicalDashboard();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load medical service dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  if (!dashboardData) return null;

  // Chart data for hospitals by region
  const regionChartData = {
    labels: dashboardData.regionStats.map(item => item.region),
    datasets: [
      {
        label: 'Number of Hospitals',
        data: dashboardData.regionStats.map(item => item.hospitalCount),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#06B6D4',
          '#84CC16',
          '#F97316',
        ],
        borderColor: [
          '#1E40AF',
          '#059669',
          '#D97706',
          '#DC2626',
          '#7C3AED',
          '#0891B2',
          '#65A30D',
          '#EA580C',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Chart data for hospitals by level
  const levelChartData = {
    labels: dashboardData.hospitalLevelStats.map(item => item.level),
    datasets: [
      {
        label: 'Number of Hospitals',
        data: dashboardData.hospitalLevelStats.map(item => item.count),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
        borderColor: [
          '#1E40AF',
          '#059669',
          '#D97706',
          '#DC2626',
          '#7C3AED',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Chart data for bed distribution by region
  const bedDistributionData = {
    labels: dashboardData.regionStats.map(item => item.region),
    datasets: [
      {
        label: 'Total Beds',
        data: dashboardData.regionStats.map(item => item.totalBeds),
        backgroundColor: '#3B82F6',
        borderColor: '#1E40AF',
        borderWidth: 2,
      },
      {
        label: 'ICU Beds',
        data: dashboardData.regionStats.map(item => item.icuBeds),
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 2,
      },
      {
        label: 'Emergency Beds',
        data: dashboardData.regionStats.map(item => item.emergencyBeds),
        backgroundColor: '#F59E0B',
        borderColor: '#D97706',
        borderWidth: 2,
      },
    ],
  };

  // Chart data for service availability
  const serviceAvailabilityData = {
    labels: dashboardData.serviceAvailability.map(item => item.service),
    datasets: [
      {
        label: 'Available',
        data: dashboardData.serviceAvailability.map(item => item.available),
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 2,
      },
      {
        label: 'Not Available',
        data: dashboardData.serviceAvailability.map(item => item.notAvailable),
        backgroundColor: '#EF4444',
        borderColor: '#DC2626',
        borderWidth: 2,
      },
    ],
  };

  // Chart data for imaging services
  const imagingServicesData = {
    labels: dashboardData.imagingServices.map(item => item.service),
    datasets: [
      {
        label: 'Count',
        data: dashboardData.imagingServices.map(item => item.count),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#06B6D4',
        ],
        borderColor: [
          '#1E40AF',
          '#059669',
          '#D97706',
          '#DC2626',
          '#7C3AED',
          '#0891B2',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Chart data for distance analysis
  const distanceAnalysisData = {
    labels: dashboardData.distanceAnalysis.map(item => item.range),
    datasets: [
      {
        label: 'Number of Hospitals',
        data: dashboardData.distanceAnalysis.map(item => item.count),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
        borderColor: [
          '#1E40AF',
          '#059669',
          '#D97706',
          '#DC2626',
          '#7C3AED',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Medical Services Distribution',
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">{card.title}</p>
                <p className="text-2xl font-bold text-app-foreground">{card.value.toLocaleString()}</p>
                {card.change && (
                  <div className="flex items-center mt-1">
                    <span className={`text-sm font-medium ${card.trend === 'up' ? 'text-green-600' :
                      card.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                      {card.change}
                    </span>
                  </div>
                )}
              </div>
              <div className={`flex-shrink-0 ${card.colorClass || 'text-blue-600'}`}>
                {index === 0 && <Hospital className="h-8 w-8" />}
                {index === 1 && <Bed className="h-8 w-8" />}
                {index === 2 && <Activity className="h-8 w-8" />}
                {index === 3 && <MapPin className="h-8 w-8" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Availability Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
        <h3 className="text-lg font-medium text-app-foreground mb-4">Service Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData.serviceAvailability.map((service, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-app-foreground">{service.service}</h4>
                <span className="text-sm font-bold text-green-600">{service.percentage.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Available: {service.available}</span>
                <span>Not Available: {service.notAvailable}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hospitals by Region Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
          <h3 className="text-lg font-medium text-app-foreground mb-4">Hospitals by Region</h3>
          <div className="h-80">
            <Bar data={regionChartData} options={chartOptions} />
          </div>
        </div>

        {/* Hospitals by Level Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
          <h3 className="text-lg font-medium text-app-foreground mb-4">Hospitals by Level</h3>
          <div className="h-80">
            <Doughnut data={levelChartData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Bed Distribution and Service Availability Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bed Distribution Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
          <h3 className="text-lg font-medium text-app-foreground mb-4">Bed Distribution by Region</h3>
          <div className="h-80">
            <Bar data={bedDistributionData} options={chartOptions} />
          </div>
        </div>

        {/* Service Availability Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
          <h3 className="text-lg font-medium text-app-foreground mb-4">Service Availability</h3>
          <div className="h-80">
            <Bar data={serviceAvailabilityData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Imaging Services and Distance Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Imaging Services Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
          <h3 className="text-lg font-medium text-app-foreground mb-4">Imaging Services</h3>
          <div className="h-80">
            <Bar data={imagingServicesData} options={chartOptions} />
          </div>
        </div>

        {/* Distance Analysis Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
          <h3 className="text-lg font-medium text-app-foreground mb-4">Distance from City Analysis</h3>
          <div className="h-80">
            <Bar data={distanceAnalysisData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Regional Breakdown Table */}
      <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
        <h3 className="text-lg font-medium text-app-foreground mb-4">Regional Breakdown</h3>
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
              {dashboardData.regionStats.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-app-foreground">
                    {item.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {item.hospitalCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {item.totalBeds.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {item.icuBeds.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {item.emergencyBeds.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {item.orTables.toLocaleString()}
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
