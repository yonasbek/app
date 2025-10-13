'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import {
  Calendar,
  AlertTriangle,
  Building,
  Heart,
  User2Icon,
  ArrowRight,
  Plus,
  BarChart3,
  Target,
  Cog,
  DollarSign,
  Users,
  Laptop
} from 'lucide-react';
import Link from 'next/link';
import { planService } from '@/services/planService';

const planTypesConfig = [
  {
    type: 'PFRD',
    title: 'Pre-Facility & Referral Development Plan',
    description: 'Strategic planning for pre-facility development and referral systems',
    icon: Target,
    color: 'from-app-primary to-app-primary-light',
  },
  {
    type: 'ECCD',
    title: 'Emergency & Critical Care Development Plan',
    description: 'Planning for emergency services and critical care development',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
  },
  {
    type: 'HDD',
    title: 'Hospital Development Directorate Plan',
    description: 'Comprehensive hospital development and management planning',
    icon: Users,
    color: 'from-app-primary-light to-app-primary',
  },
  {
    type: 'SRD',
    title: 'Specialty & Rehabilitative Services Plan',
    description: 'Planning for specialty care and rehabilitation services',
    icon: Laptop,
    color: 'from-orange-500 to-red-500',
  },
  {
    type: 'LEO',
    title: 'Lead Executive Officer Plan',
    description: 'Strategic planning and management for lead executive officer initiatives',
    icon: Users,
    color: 'from-app-primary-light to-app-primary',
  }
];

export default function PlanTypesPage() {
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const data = await planService.getOverallStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalActive = statistics?.active_plans || 0;
  const totalPlans = statistics?.total_plans || 0;
  const totalActivities = statistics?.total_activities || 0;

  const getPlanTypeStats = (type: string) => {
    if (!statistics?.by_plan_type) return { total_plans: 0, total_activities: 0, average_progress: 0 };
    const typeStats = statistics.by_plan_type.find((pt: any) => pt.plan_type === type);
    return typeStats || { total_plans: 0, total_activities: 0, average_progress: 0 };
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-app-foreground mb-2">Annual Plans</h1>
        <p className="text-neutral-600">Create and view Strategic Initiative, Main Acivities and Sub-activites.</p>
      </div>

      {/* Quick Stats */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin h-8 w-8 border-4 border-app-primary rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border border-app-secondary">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-app-primary bg-opacity-10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-app-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-app-foreground">{totalActive}</p>
                <p className="text-sm text-neutral-600">Active Plans</p>
              </div>
            </div>
          </Card>

          <Card className="border border-green-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-app-foreground">{totalPlans}</p>
                <p className="text-sm text-neutral-600">Total Plans</p>
              </div>
            </div>
          </Card>

          <Card className="border border-app-secondary">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-app-accent rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-app-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-app-foreground">{totalActivities}</p>
                <p className="text-sm text-neutral-600">Total Activities</p>
              </div>
            </div>
          </Card>

          <Card className="border border-amber-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-app-foreground">
                  {statistics?.completed_plans || 0}
                </p>
                <p className="text-sm text-neutral-600">Completed Plans</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Plan Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-app-foreground mb-6">Plan Categories</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {planTypesConfig.map((planType, index) => {
            const Icon = planType.icon;
            const typeStats = getPlanTypeStats(planType.type);
            const completionRate = typeStats.average_progress || 0;

            return (
              <Card key={index} className="group card-hover cursor-pointer relative overflow-hidden">
                <Link href={`/plans/list?type=${planType.type}`}>
                  <div className="space-y-4">
                    {/* Header with icon and stats */}
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${planType.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-app-foreground">{typeStats.total_plans}</span>
                        <span className="text-sm text-neutral-500"> plans</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">{typeStats.total_activities} activities</p>
                    </div>

                    {/* Title and description */}
                    <div>
                      <h3 className="text-lg font-semibold text-app-foreground group-hover:text-app-primary transition-colors">
                        {planType.title}
                      </h3>
                      <div className="w-16 bg-app-secondary rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${planType.color}`}
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Plan description */}
                    <div>
                      <h4 className="font-medium text-neutral-800 mb-2">{planType.title}</h4>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {planType.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-app-secondary">
                      <div className="flex items-center text-sm text-neutral-500">
                        <BarChart3 className="w-4 h-4 mr-1" />
                        <span>{completionRate}% progress</span>
                      </div>
                      <div className="flex items-center text-app-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>View Plans</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-app-accent border border-app-secondary">
        <div className="text-center">
          <h3 className="font-semibold text-app-foreground mb-2">Quick Actions</h3>
          <p className="text-sm text-neutral-600">Get started with common tasks</p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
            <Link
              href="/plans/list"
              className="px-4 py-2 bg-app-secondary text-neutral-700 rounded-lg hover:bg-app-primary hover:text-white transition-colors duration-200 flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>View All Plans</span>
            </Link>

            <Link
              href="/plans/new"
              className="px-4 py-2 bg-app-primary text-white rounded-lg hover:bg-app-primary-light transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Strategic Initiative</span>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
} 