'use client';

import React, { useState, useEffect } from 'react';
import { planService } from '@/services/planService';
import { activityService } from '@/services/activityService';
import { subActivityService } from '@/services/subactivityService';
import { Plan } from '@/types/plan';
import { Activity } from '@/types/activity';
import { SubActivity } from '@/types/subactivity';
import { ChevronDown, ChevronRight, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface BudgetSummary {
  plan_id: string;
  plan_title: string;
  plan_type: string;
  fiscal_year: string;
  currency?: string;
  plan_budget_allocated: number;
  plan_budget_spent: number;
  calculated_activity_budget_allocated: number;
  calculated_activity_budget_spent: number;
  activities: ActivityBudget[];
}

interface ActivityBudget {
  activity_id: string;
  activity_title: string;
  activity_budget_allocated: number;
  activity_budget_spent: number;
  calculated_subactivity_budget_allocated: number;
  calculated_subactivity_budget_spent: number;
  subactivities: SubActivityBudget[];
}

interface SubActivityBudget {
  subactivity_id: string;
  subactivity_title: string;
  calculated_budget_allocated: number;
  calculated_budget_spent: number;
  weight?: number;
}

export default function BudgetPage() {
  const [budgetSummaries, setBudgetSummaries] = useState<BudgetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const plans = await planService.getAll();
      
      const summaries: BudgetSummary[] = [];

      for (const plan of plans) {
        const activities = await activityService.getByPlanId(plan.id);
        
        const activityBudgets: ActivityBudget[] = [];

        for (const activity of activities) {
          const subactivities = await subActivityService.getByActivityId(activity.id);
          
          // Calculate sub-activity budgets proportionally based on weight
          // Each sub-activity gets a portion of the activity's budget_allocated
          const totalWeight = subactivities.reduce((sum, sub) => sum + (sub.weight || 1), 0);
          
          const subactivityBudgets: SubActivityBudget[] = subactivities.map(sub => {
            const weight = sub.weight || 1;
            const ratio = totalWeight > 0 ? weight / totalWeight : 1 / subactivities.length;
            
            // Each sub-activity's allocated portion of the activity budget
            const calculated_allocated = activity.budget_allocated * ratio;
            
            // Budget is "spent" only when sub-activity reaches 100% progress
            // When progress = 100%, the sub-activity consumes its allocated portion
            const calculated_spent = sub.progress === 100 ? calculated_allocated : 0;
            
            return {
              subactivity_id: sub.id,
              subactivity_title: sub.title,
              calculated_budget_allocated: calculated_allocated,
              calculated_budget_spent: calculated_spent,
              weight: sub.weight
            };
          });

          // Activity's budget_spent is the sum of all completed sub-activities' allocated portions
          const calculatedSubactivityBudgetAllocated = subactivityBudgets.reduce(
            (sum, sub) => sum + sub.calculated_budget_allocated, 0
          );
          const calculatedSubactivityBudgetSpent = subactivityBudgets.reduce(
            (sum, sub) => sum + sub.calculated_budget_spent, 0
          );

          // Activity's budget_spent should be calculated from completed sub-activities
          // The calculated_subactivity_budget_spent is the sum of all completed sub-activities
          // This represents the actual budget consumed when sub-activities reach 100%
          activityBudgets.push({
            activity_id: activity.id,
            activity_title: activity.title,
            activity_budget_allocated: activity.budget_allocated || 0,
            // Use calculated budget spent from completed sub-activities instead of activity's budget_spent
            activity_budget_spent: calculatedSubactivityBudgetSpent,
            calculated_subactivity_budget_allocated: calculatedSubactivityBudgetAllocated,
            calculated_subactivity_budget_spent: calculatedSubactivityBudgetSpent,
            subactivities: subactivityBudgets
          });
        }

        const calculatedActivityBudgetAllocated = activityBudgets.reduce(
          (sum, act) => sum + act.activity_budget_allocated, 0
        );
        const calculatedActivityBudgetSpent = activityBudgets.reduce(
          (sum, act) => sum + act.activity_budget_spent, 0
        );

        summaries.push({
          plan_id: plan.id,
          plan_title: plan.title,
          plan_type: plan.plan_type,
          fiscal_year: plan.fiscal_year,
          currency: plan.currency || 'ETB',
          // Plan budget allocated: use sum of activity budgets (or plan's own budget if different)
          plan_budget_allocated: plan.budget_allocated || calculatedActivityBudgetAllocated,
          // Plan budget spent: calculated from completed sub-activities across all activities
          plan_budget_spent: calculatedActivityBudgetSpent,
          calculated_activity_budget_allocated: calculatedActivityBudgetAllocated,
          calculated_activity_budget_spent: calculatedActivityBudgetSpent,
          activities: activityBudgets
        });
      }

      setBudgetSummaries(summaries);
    } catch (error) {
      console.error('Failed to fetch budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlan = (planId: string) => {
    const newExpanded = new Set(expandedPlans);
    if (newExpanded.has(planId)) {
      newExpanded.delete(planId);
    } else {
      newExpanded.add(planId);
    }
    setExpandedPlans(newExpanded);
  };

  const toggleActivity = (activityId: string) => {
    const newExpanded = new Set(expandedActivities);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedActivities(newExpanded);
  };

  const formatCurrency = (amount: number, currency: string = 'ETB') => {
    const currencySymbols: { [key: string]: string } = {
      'ETB': 'Br',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CNY': '¥'
    };
    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${amount?.toLocaleString() || 0}`;
  };

  const calculateBudgetUtilization = (allocated: number, spent: number) => {
    if (allocated === 0) return 0;
    return Math.round((spent / allocated) * 100);
  };

  const getBudgetStatusColor = (allocated: number, spent: number) => {
    const utilization = calculateBudgetUtilization(allocated, spent);
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading budget data...</p>
        </div>
      </div>
    );
  }

  const totalPlanBudgetAllocated = budgetSummaries.reduce(
    (sum, plan) => sum + plan.plan_budget_allocated, 0
  );
  const totalPlanBudgetSpent = budgetSummaries.reduce(
    (sum, plan) => sum + plan.plan_budget_spent, 0
  );
  const totalActivityBudgetAllocated = budgetSummaries.reduce(
    (sum, plan) => sum + plan.calculated_activity_budget_allocated, 0
  );
  const totalActivityBudgetSpent = budgetSummaries.reduce(
    (sum, plan) => sum + plan.calculated_activity_budget_spent, 0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Tracking</h1>
          <p className="text-gray-600 mt-1">Track budget allocations across plans, activities, and sub-activities</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Plan Budget</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalPlanBudgetAllocated)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Spent: {formatCurrency(totalPlanBudgetSpent)}</p>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${calculateBudgetUtilization(totalPlanBudgetAllocated, totalPlanBudgetSpent)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Activity Budget</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalActivityBudgetAllocated)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Spent: {formatCurrency(totalActivityBudgetSpent)}</p>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${calculateBudgetUtilization(totalActivityBudgetAllocated, totalActivityBudgetSpent)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining Budget</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(totalPlanBudgetAllocated - totalPlanBudgetSpent)}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-600" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {calculateBudgetUtilization(totalPlanBudgetAllocated, totalPlanBudgetSpent)}% utilized
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{budgetSummaries.length}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {budgetSummaries.reduce((sum, plan) => sum + plan.activities.length, 0)} activities
            </p>
          </div>
        </div>
      </div>

      {/* Budget Details */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Budget Breakdown by Plan</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {budgetSummaries.map((summary) => (
            <div key={summary.plan_id} className="p-6">
              {/* Plan Level */}
              <div
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                onClick={() => togglePlan(summary.plan_id)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  {expandedPlans.has(summary.plan_id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{summary.plan_title}</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {summary.plan_type}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                        {summary.fiscal_year}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center space-x-6">
                      <div>
                        <span className="text-sm text-gray-600">Allocated: </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(summary.plan_budget_allocated)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Spent: </span>
                        <span className={`text-sm font-semibold ${getBudgetStatusColor(summary.plan_budget_allocated, summary.plan_budget_spent)}`}>
                          {formatCurrency(summary.plan_budget_spent)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Remaining: </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(summary.plan_budget_allocated - summary.plan_budget_spent)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Utilization: </span>
                        <span className={`text-sm font-semibold ${getBudgetStatusColor(summary.plan_budget_allocated, summary.plan_budget_spent)}`}>
                          {calculateBudgetUtilization(summary.plan_budget_allocated, summary.plan_budget_spent)}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          calculateBudgetUtilization(summary.plan_budget_allocated, summary.plan_budget_spent) >= 90
                            ? 'bg-red-600'
                            : calculateBudgetUtilization(summary.plan_budget_allocated, summary.plan_budget_spent) >= 75
                            ? 'bg-yellow-600'
                            : 'bg-green-600'
                        }`}
                        style={{
                          width: `${Math.min(calculateBudgetUtilization(summary.plan_budget_allocated, summary.plan_budget_spent), 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activities Level */}
              {expandedPlans.has(summary.plan_id) && (
                <div className="mt-4 ml-8 space-y-4">
                  {summary.activities.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No activities found</p>
                  ) : (
                    summary.activities.map((activity) => (
                      <div key={activity.activity_id} className="border-l-2 border-gray-200 pl-4">
                        <div
                          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                          onClick={() => toggleActivity(activity.activity_id)}
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            {expandedActivities.has(activity.activity_id) ? (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                            <div className="flex-1">
                              <h4 className="text-base font-medium text-gray-800">{activity.activity_title}</h4>
                              <div className="mt-1 flex items-center space-x-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Allocated: </span>
                                  <span className="font-semibold text-gray-900">
                                    {formatCurrency(activity.activity_budget_allocated, summary.currency)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Spent: </span>
                                  <span className={`font-semibold ${getBudgetStatusColor(activity.activity_budget_allocated, activity.activity_budget_spent)}`}>
                                    {formatCurrency(activity.activity_budget_spent, summary.currency)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Utilization: </span>
                                  <span className={`font-semibold ${getBudgetStatusColor(activity.activity_budget_allocated, activity.activity_budget_spent)}`}>
                                    {calculateBudgetUtilization(activity.activity_budget_allocated, activity.activity_budget_spent)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Sub-Activities Level */}
                        {expandedActivities.has(activity.activity_id) && (
                          <div className="mt-3 ml-8 space-y-2">
                            {activity.subactivities.length === 0 ? (
                              <p className="text-sm text-gray-500 italic">No sub-activities found</p>
                            ) : (
                              activity.subactivities.map((subactivity) => (
                                <div
                                  key={subactivity.subactivity_id}
                                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <h5 className="text-sm font-medium text-gray-700">
                                        {subactivity.subactivity_title}
                                      </h5>
                                      <div className="mt-1 flex items-center space-x-3 text-xs">
                                        <div>
                                          <span className="text-gray-600">Allocated: </span>
                                          <span className="font-semibold text-gray-900">
                                            {formatCurrency(subactivity.calculated_budget_allocated, summary.currency)}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">Spent: </span>
                                          <span className={`font-semibold ${getBudgetStatusColor(subactivity.calculated_budget_allocated, subactivity.calculated_budget_spent)}`}>
                                            {formatCurrency(subactivity.calculated_budget_spent, summary.currency)}
                                          </span>
                                        </div>
                                        {subactivity.weight !== undefined && (
                                          <div>
                                            <span className="text-gray-600">Weight: </span>
                                            <span className="font-semibold text-gray-900">{subactivity.weight}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {budgetSummaries.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500">No budget data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

