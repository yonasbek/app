'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plan } from '@/types/plan';
import { PlanType } from '@/types/activity';
import { planService } from '@/services/planService';
import Card from '@/components/ui/Card';
import { Eye, Edit, List } from 'lucide-react';

function PlansListContent() {
  const searchParams = useSearchParams();
  const planType = searchParams.get('type') as PlanType;
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fiscalYear, setFiscalYear] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (planType) {
      fetchPlans();
    }
    
  }, [fiscalYear, planType]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await planService.getAll();
      let filteredPlans = data.filter(plan => 
        plan.plan_type === planType && 
        (!fiscalYear || plan.fiscal_year === fiscalYear)
      );
      if (search.trim()) {
        filteredPlans = filteredPlans.filter(plan =>
          plan.title.toLowerCase().includes(search.toLowerCase())
        );
      }
      setPlans(filteredPlans);
    } catch (err) {
      setError('Failed to fetch plans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (planType) {
      fetchPlans();
    }
  }, [search]);

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
      case 'LEO': return 'Lead Executive Officer Plan';
      default: return '';
    }
  };

  const getBudgetProgress = (plan: Plan) => {
    if (!plan.budget_allocated || plan.budget_allocated === 0) return 0;
    return Math.round((plan.budget_spent / plan.budget_allocated) * 100);
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
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <h1 className="text-2xl font-bold text-app-foreground">{getPlanTypeTitle(planType)}</h1>
          <select
            value={fiscalYear}
            onChange={(e) => setFiscalYear(e.target.value)}
            className="block w-48 rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Fiscal Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <input
            type="text"
            placeholder="Search plans..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="block w-64 rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <Link
          href={`/plans/new?type=${planType}`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <span className="font-semibold">Create New Plan</span>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const budgetProgress = getBudgetProgress(plan);
          return (
            <Card
              key={plan.id}
              className="group card-hover cursor-pointer relative overflow-hidden border border-gray-200 bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-app-foreground group-hover:text-blue-700 transition-colors">
                    {plan.title}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">Fiscal Year: {plan.fiscal_year}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                  {plan.status?.charAt(0)?.toUpperCase() + plan.status?.slice(1)}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span>Budget Progress</span>
                  <span>{budgetProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
                    style={{ width: `${budgetProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                  <span>
                    ${plan.budget_spent?.toLocaleString()} spent
                  </span>
                  <span>
                    / ${plan.budget_allocated?.toLocaleString()} allocated
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Link
                  href={`/plans/${plan.id}/activities`}
                  className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition"
                  title="Activities"
                >
                  <List className="w-5 h-5" />
                </Link>
                <Link
                  href={`/plans/${plan.id}`}
                  className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition"
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </Link>
                <Link
                  href={`/plans/${plan.id}/edit`}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-300 text-gray-600 hover:text-gray-900 transition"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function PlansListPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    }>
      <PlansListContent />
    </Suspense>
  );
}
