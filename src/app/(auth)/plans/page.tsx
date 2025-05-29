'use client';

import { useRouter } from 'next/navigation';
import { PlanType } from '@/types/activity';

const planTypes: { type: PlanType; title: string; description: string }[] = [
  {
    type: 'PFRD',
    title: 'Pre-Facility & Referral Development Plan',
    description: 'Strategic planning for pre-facility development and referral systems'
  },
  {
    type: 'ECCD',
    title: 'Emergency & Critical Care Development Plan',
    description: 'Planning for emergency services and critical care development'
  },
  {
    type: 'HDD',
    title: 'Hospital Development Directorate Plan',
    description: 'Comprehensive hospital development and management planning'
  },
  {
    type: 'SRD',
    title: 'Specialty & Rehabilitative Services Plan',
    description: 'Planning for specialty care and rehabilitation services'
  }
];

export default function PlanTypesPage() {
  const router = useRouter();

  const handlePlanTypeSelect = (type: PlanType) => {
    router.push(`/plans/list?type=${type}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Select Plan Type</h1>
        <p className="mt-2 text-gray-600">Choose a plan type to view or create plans</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {planTypes.map((planType) => (
          <div
            key={planType.type}
            onClick={() => handlePlanTypeSelect(planType.type)}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{planType.type}</h2>
              <span className="text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">{planType.title}</h3>
            <p className="text-gray-600">{planType.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 