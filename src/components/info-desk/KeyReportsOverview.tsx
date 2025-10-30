'use client';

import { useState, useEffect } from 'react';
import { medicalServiceAPI } from '../../services/medicalService';
import { MedicalDashboardDto, RegionalAmbulanceDashboardDto } from '../../types/medical-service';
import {
  Hospital,
  Bed,
  Activity,
  MapPin,
  TrendingUp,
  Users,
  Building2,
  Stethoscope,
  Ambulance,
  Heart
} from 'lucide-react';

export default function KeyReportsOverview() {
  const [medicalData, setMedicalData] = useState<MedicalDashboardDto | null>(null);
  const [ambulanceData, setAmbulanceData] = useState<RegionalAmbulanceDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [medical, ambulance] = await Promise.all([
          medicalServiceAPI.getMedicalDashboard(),
          medicalServiceAPI.getRegionalAmbulanceDashboard()
        ]);
        setMedicalData(medical);
        setAmbulanceData(ambulance);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  return (
    <div className="space-y-6">
      {/* Medical Services Summary */}
      <div className="bg-white border-y-2 py-6 border-app-secondary">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-app-foreground flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            Medical Services Overview
          </h3>
          <a
            href="/info-desk/medical-service"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            View Full Report →
          </a>
        </div>

        {medicalData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {medicalData.cards.slice(0, 4).map((card, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">{card.title}</p>
                    <p className="text-2xl font-bold text-app-foreground">{card.value.toLocaleString()}</p>

                  </div>
                  <div className={`${card.colorClass || 'text-blue-900'}`}>
                    {index === 0 && <Hospital className="w-6 h-6 text-blue-900/80" />}
                    {index === 1 && <Bed className="w-6 h-6 text-blue-900/80" />}
                    {index === 2 && <Activity className="w-6 h-6 text-blue-900/80" />}
                    {index === 3 && <MapPin className="w-6 h-6 text-blue-900/80" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500">
            No medical services data available
          </div>
        )}
      </div>

      {/* Ambulance Services Summary */}
      <div className="bg-white border-b-2 pb-6 border-app-secondary">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-app-foreground flex items-center gap-2">
            <Ambulance className="w-5 h-5 text-red-600" />
            Ambulance Services Overview
          </h3>
          <a
            href="/info-desk/ambulance"
            className="text-sm text-red-600 hover:text-red-500 font-medium"
          >
            View Full Report →
          </a>
        </div>

        {ambulanceData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ambulanceData.cards.slice(0, 4).map((card, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">{card.title}</p>
                    <p className="text-2xl font-bold text-app-foreground">{card.value.toLocaleString()}</p>

                  </div>
                  <div className={`${card.colorClass || 'text-red-900'}`}>
                    {index === 0 && <Ambulance className="w-6 h-6 text-red-900/80" />}
                    {index === 1 && <Activity className="w-6 h-6 text-red-900/80" />}
                    {index === 2 && <TrendingUp className="w-6 h-6 text-red-900/80" />}
                    {index === 3 && <MapPin className="w-6 h-6 text-red-900/80" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500">
            No ambulance services data available
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medical Services Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
          <h4 className="font-medium text-app-foreground mb-3">Medical Services Quick Stats</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Total Regions Covered</span>
              <span className="font-medium">{medicalData?.regionStats.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Hospital Levels</span>
              <span className="font-medium">{medicalData?.hospitalLevelStats.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Service Types</span>
              <span className="font-medium">{medicalData?.serviceAvailability.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Ambulance Services Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-6">
          <h4 className="font-medium text-app-foreground mb-3">Ambulance Services Quick Stats</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Regions Covered</span>
              <span className="font-medium">{ambulanceData?.regionStats.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Ambulance Types</span>
              <span className="font-medium">{ambulanceData?.ambulanceTypeStats.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Infrastructure Facilities</span>
              <span className="font-medium">{ambulanceData?.infrastructureStats.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
