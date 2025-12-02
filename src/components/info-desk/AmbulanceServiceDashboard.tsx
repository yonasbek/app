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
import { RegionalAmbulanceDashboardDto } from '../../types/medical-service';
import {
  Ambulance,
  Bed,
  Activity,
  MapPin,
  TrendingUp,
  Users,
  Building2,
  Phone,
  Wrench,
  Heart
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

export default function AmbulanceServiceDashboard() {
  const [dashboardData, setDashboardData] = useState<RegionalAmbulanceDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await medicalServiceAPI.getRegionalAmbulanceDashboard();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load ambulance service dashboard data');
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

  if (!dashboardData) return null;

  // Chart data for ambulance status by region
  const ambulanceStatusData = {
    labels: dashboardData.regionStats.map(item => item.region),
    datasets: [
      {
        label: 'Functional',
        data: dashboardData.regionStats.map(item => item.functionalAmbulances),
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 2,
      },
      {
        label: 'Non-Functional',
        data: dashboardData.regionStats.map(item => item.nonFunctionalAmbulances),
        backgroundColor: '#F59E0B',
        borderColor: '#D97706',
        borderWidth: 2,
      },
      {
        label: 'Damaged',
        data: dashboardData.regionStats.map(item => item.damagedAmbulances),
        backgroundColor: '#EF4444',
        borderColor: '#DC2626',
        borderWidth: 2,
      },
    ],
  };

  // Chart data for ambulance types
  const ambulanceTypesData = {
    labels: dashboardData.ambulanceTypeStats.map(item => item.type),
    datasets: [
      {
        label: 'Number of Ambulances',
        data: dashboardData.ambulanceTypeStats.map(item => item.count),
        backgroundColor: [
          '#3B82F6',
          '#8B5CF6',
          '#F59E0B',
          '#10B981',
        ],
        borderColor: [
          '#1E40AF',
          '#7C3AED',
          '#D97706',
          '#059669',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Chart data for functionality rates by region
  const functionalityRatesData = {
    labels: dashboardData.regionStats.map(item => item.region),
    datasets: [
      {
        label: 'Functionality Rate (%)',
        data: dashboardData.regionStats.map(item => item.functionalityRate),
        backgroundColor: '#3B82F6',
        borderColor: '#1E40AF',
        borderWidth: 2,
      },
    ],
  };

  // Chart data for infrastructure
  const infrastructureData = {
    labels: dashboardData.infrastructureStats.map(item => item.facility),
    datasets: [
      {
        label: 'Count',
        data: dashboardData.infrastructureStats.map(item => item.count),
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
        text: 'Ambulance Services Distribution',
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

  // Calculate overall functionality rate
  const totalAmbulances = dashboardData.regionStats.reduce((sum, region) => sum + region.totalAmbulances, 0);
  const totalFunctional = dashboardData.regionStats.reduce((sum, region) => sum + region.functionalAmbulances, 0);
  const overallFunctionalityRate = totalAmbulances > 0 ? (totalFunctional / totalAmbulances) * 100 : 0;

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
              <div className={`flex-shrink-0 ${card.colorClass || 'text-red-600'}`}>
                {index === 0 && <Ambulance className="h-8 w-8" />}
                {index === 1 && <Activity className="h-8 w-8" />}
                {index === 2 && <TrendingUp className="h-8 w-8" />}
                {index === 3 && <MapPin className="h-8 w-8" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paramedic Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
        <h3 className="text-lg font-medium text-app-foreground mb-4">Paramedic Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Paramedics</p>
            <p className="text-2xl font-bold text-blue-700">{dashboardData.paramedicStats.total.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Working on Ambulances</p>
            <p className="text-2xl font-bold text-green-700">{dashboardData.paramedicStats.workingOnAmbulance.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Utilization Rate</p>
            <p className="text-2xl font-bold text-purple-700">{dashboardData.paramedicStats.utilizationRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Infrastructure Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
        <h3 className="text-lg font-medium text-app-foreground mb-4">Infrastructure Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData.infrastructureStats.map((facility, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-app-foreground">{facility.facility}</h4>
                <span className={`text-2xl font-bold ${facility.colorClass}`}>{facility.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ambulance Status by Region Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
          <h3 className="text-lg font-medium text-app-foreground mb-4">Ambulance Status by Region</h3>
          <div className="h-80">
            <Bar data={ambulanceStatusData} options={chartOptions} />
          </div>
        </div>

        {/* Ambulance Types Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
          <h3 className="text-lg font-medium text-app-foreground mb-4">Ambulance Types</h3>
          <div className="h-80">
            <Doughnut data={ambulanceTypesData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Functionality Rates and Infrastructure Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Functionality Rates Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
          <h3 className="text-lg font-medium text-app-foreground mb-4">Functionality Rates by Region</h3>
          <div className="h-80">
            <Bar data={functionalityRatesData} options={chartOptions} />
          </div>
        </div>

        {/* Infrastructure Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
          <h3 className="text-lg font-medium text-app-foreground mb-4">Infrastructure Facilities</h3>
          <div className="h-80">
            <Bar data={infrastructureData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Regional Breakdown Table */}
      <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
        <h3 className="text-lg font-medium text-app-foreground mb-4">Regional Ambulance Breakdown</h3>
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
                  Non-Functional
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Damaged
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Functionality Rate
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
                    {item.totalAmbulances}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {item.functionalAmbulances}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                    {item.nonFunctionalAmbulances}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {item.damagedAmbulances}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {item.functionalityRate.toFixed(1)}%
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
