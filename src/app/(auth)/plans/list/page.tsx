'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plan } from '@/types/plan';
import { PlanType } from '@/types/activity';
import { planService } from '@/services/planService';

export default function PlansListPage() {
  const searchParams = useSearchParams();
  const planType = searchParams.get('type') as PlanType;
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fiscalYear, setFiscalYear] = useState<string>('');

  useEffect(() => {
    if (planType) {
      fetchPlans();
    }
  }, [fiscalYear, planType]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await planService.getAll();
      // Filter plans by type and fiscal year
      const filteredPlans = data.filter(plan => 
        plan.plan_type === planType && 
        (!fiscalYear || plan.fiscal_year === fiscalYear)
      );
      setPlans(filteredPlans);
    } catch (err) {
      setError('Failed to fetch plans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Plan['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanTypeTitle = (type: PlanType) => {
    switch (type) {
      case 'PFRD': return 'Pre-Facility & Referral Development Plan';
      case 'ECCD': return 'Emergency & Critical Care Development Plan';
      case 'HDD': return 'Hospital Development Directorate Plan';
      case 'SRD': return 'Specialty & Rehabilitative Services Plan';
    }
  };

  if (!planType) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-800">Please select a plan type first</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getPlanTypeTitle(planType)}</h1>
          <div className="mt-2">
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="mt-1 block w-48 rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
            >
              <option value="">All Fiscal Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>
        <Link
          href={`/plans/new?type=${planType}`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create New Plan
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{plan.title}</h2>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                {plan.status?.charAt(0)?.toUpperCase() + plan.status?.slice(1)}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-gray-600">
                Fiscal Year: {plan.fiscal_year}
              </p>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{plan.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${plan.progress}%` }}
                  />
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  Budget: ${plan.budget_spent?.toLocaleString()} / ${plan.budget_allocated?.toLocaleString()}
                </p>
              </div>

              <div className="flex space-x-2 mt-4">
                <Link
                  href={`/plans/${plan.id}/activities`}
                  className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  Activities
                </Link>
                <Link
                  href={`/plans/${plan.id}`}
                  className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  View Details
                </Link>
                <Link
                  href={`/plans/${plan.id}/edit`}
                  className="px-3 py-1 text-sm text-gray-600 border border-gray-600 rounded hover:bg-gray-50"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 