'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plan } from '@/types/plan';
import { PlanType } from '@/types/activity';
import { planService } from '@/services/planService';
import Card from '@/components/ui/Card';
import { Eye, Edit, List, Plus, LayoutGrid, Table } from 'lucide-react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
} from '@/components/ui/modal';
import PlanForm from '@/components/PlanForm';

function PlanCardSkeleton() {
  return (
    <Card className="relative overflow-hidden border border-gray-100 bg-white p-6 rounded-2xl shadow-sm">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-100 to-transparent rounded-bl-full opacity-30"></div>

      <div className="relative flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse w-3/4 mb-2"></div>
          <div className="flex items-center gap-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
            <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
        </div>
        <div className="h-7 w-20 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      <div className="mb-5 space-y-4">
        {/* Plan Progress Skeleton */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-28"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 animate-pulse"></div>
        </div>

        {/* Budget Progress Skeleton */}
        <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex justify-between items-center mb-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 animate-pulse mb-2"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <div className="h-10 flex-1 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </Card>
  );
}

function PlansListContent() {
  const searchParams = useSearchParams();
  const planType = searchParams.get('type') as PlanType;

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fiscalYear, setFiscalYear] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

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
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    if (planType) {
      fetchPlans();
    }
  }, [search]);

  const handlePlanCreated = () => {
    setIsModalOpen(false);
    fetchPlans(); // Refresh the list
  };

  const handleEditClick = (plan: Plan) => {
    setEditingPlan(plan);
    setIsEditModalOpen(true);
  };

  const handlePlanUpdated = () => {
    setIsEditModalOpen(false);
    setEditingPlan(null);
    fetchPlans(); // Refresh the list
  };

  const handleEditPlan = async (data: any) => {
    if (editingPlan) {
      await planService.update(editingPlan.id, data);
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
      case 'LEO': return 'Lead Executive Officer Plan';
      default: return '';
    }
  };

  const getBudgetProgress = (plan: Plan) => {
    if (!plan.budget_allocated || plan.budget_allocated === 0) return 0;
    return Math.round((plan.budget_spent / plan.budget_allocated) * 100);
  };

  const getPlanProgress = (plan: Plan) => {
    // Backend now calculates progress from activities (which are calculated from subactivities)
    // Use calculated_progress if available, otherwise fall back to progress
    return plan.calculated_progress !== undefined ? plan.calculated_progress : plan.progress || 0;
  };

  const getActivityCount = (plan: Plan) => {
    return plan.activities?.length || 0;
  };

  if (!planType) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-800">Please select a plan type first</p>
      </div>
    );
  }

  if (initialLoad && loading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
          <div>
            <div className="h-9 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse w-80 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
          </div>
          <div className="h-12 w-48 bg-gradient-to-r from-blue-200 to-blue-300 rounded-xl animate-pulse shadow-lg"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
              <div className="h-11 w-52 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-11 flex-1 sm:max-w-md bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
            <div className="h-11 w-28 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>

        {viewMode === 'card' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <PlanCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-app-foreground uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-app-foreground uppercase tracking-wider">Fiscal Year</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-app-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-app-foreground uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-app-foreground uppercase tracking-wider">Budget</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-app-foreground uppercase tracking-wider">Activities</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-app-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {[...Array(6)].map((_, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-0">
                      <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded-lg animate-pulse w-40"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded-lg animate-pulse w-16"></div></td>
                      <td className="px-6 py-5"><div className="h-7 bg-gray-200 rounded-full animate-pulse w-20"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded-full animate-pulse w-32"></div></td>
                      <td className="px-6 py-5">
                        <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-36 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded-full animate-pulse w-28"></div>
                      </td>
                      <td className="px-6 py-5"><div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div></td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-1.5">
                          <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                          <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                          <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
    <div className="space-y-4 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold text-app-foreground">
          {getPlanTypeTitle(planType)}
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-app-foreground text-white rounded-lg hover:bg-app-foreground-light transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Create Initiative</span>
        </button>
      </div>

      {/* Filters and Controls Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 relative">
        {loading && !initialLoad && (
          <div className="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center z-10">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 rounded-full border-t-transparent"></div>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="block w-full sm:w-44 rounded-lg border border-gray-300 py-2 px-3 text-sm text-app-foreground bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Fiscal Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            <div className="relative flex-1 sm:max-w-xs">
              <input
                type="text"
                placeholder="Search initiatives..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 py-2 pl-3 pr-9 text-sm text-app-foreground bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-md transition ${viewMode === 'card'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-app-foreground'
                }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition ${viewMode === 'table'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-app-foreground'
                }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'card' ? (
        <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-opacity ${loading && !initialLoad ? 'opacity-50 pointer-events-none' : ''}`}>
          {plans.map((plan) => {
            const budgetProgress = getBudgetProgress(plan);
            const planProgress = getPlanProgress(plan);
            return (
              <Card
                key={plan.id}
                className="group border border-gray-200 bg-white p-4 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-app-foreground line-clamp-2 mb-1">
                      {plan.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>FY {plan.fiscal_year}</span>
                      <span>•</span>
                      <span>{getActivityCount(plan)} activities</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)} shrink-0 ml-2`}>
                    {plan.status?.charAt(0)?.toUpperCase() + plan.status?.slice(1)}
                  </span>
                </div>

                <div className="space-y-3 mb-3">
                  {/* Plan Progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{planProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-green-500 transition-all"
                        style={{ width: `${planProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-600">Budget</span>
                      <span className="font-semibold text-gray-900">{budgetProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1.5">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all"
                        style={{ width: `${budgetProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>${plan.budget_spent?.toLocaleString()}</span>
                      <span>${plan.budget_allocated?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Link
                    href={`/plans/${plan.id}/activities`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors text-sm font-medium"
                  >
                    <List className="w-4 h-4" />
                    Activities
                  </Link>
                  <Link
                    href={`/plans/${plan.id}/activities`}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleEditClick(plan)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-opacity ${loading && !initialLoad ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-app-foreground uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-app-foreground uppercase tracking-wider">
                    Fiscal Year
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-app-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-app-foreground uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-app-foreground uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-app-foreground uppercase tracking-wider">
                    Activities
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-app-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plans.map((plan) => {
                  const budgetProgress = getBudgetProgress(plan);
                  const planProgress = getPlanProgress(plan);
                  return (
                    <tr key={plan.id} className="hover:bg-blue-50/30 transition-colors duration-150 border-b border-gray-100 last:border-0">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm font-semibold text-app-foreground">{plan.title}</div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-app-foreground">{plan.fiscal_year}</div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-full ${getStatusColor(plan.status)}`}>
                          {plan.status?.charAt(0)?.toUpperCase() + plan.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full max-w-[140px]">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-green-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className="h-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                                  style={{ width: `${planProgress}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-green-700 min-w-[35px]">{planProgress}%</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-sm font-medium text-app-foreground mb-1.5">
                          ${plan.budget_spent?.toLocaleString()} / ${plan.budget_allocated?.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-blue-100 rounded-full h-2.5 max-w-[120px] overflow-hidden">
                            <div
                              className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-500"
                              style={{ width: `${budgetProgress}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-blue-700 min-w-[35px]">{budgetProgress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-sm font-bold text-app-foreground">
                          {getActivityCount(plan)}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/plans/${plan.id}/activities`}
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all"
                            title="Activities"
                          >
                            <List className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/plans/${plan.id}/activities`}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700 transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleEditClick(plan)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700 transition-all"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent
          className="max-w-2xl bg-white transition-all duration-300 transform"
        // Add animation classes for open/close transition
        >
          <ModalHeader>
            <ModalTitle>
              Create New {getPlanTypeTitle(planType)}
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <PlanForm
              planType={planType}
              mode="create"
              onSuccess={handlePlanCreated}
              onCancel={() => setIsModalOpen(false)}
              onSubmit={planService.create}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalContent className="max-w-2xl bg-white">
          <ModalHeader>
            <ModalTitle>Edit {getPlanTypeTitle(planType)}</ModalTitle>
          </ModalHeader>
          <ModalBody>
            {editingPlan && (
              <PlanForm
                initialData={editingPlan}
                mode="edit"
                onSuccess={handlePlanUpdated}
                onCancel={() => {
                  setIsEditModalOpen(false);
                  setEditingPlan(null);
                }}
                onSubmit={handleEditPlan}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
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
