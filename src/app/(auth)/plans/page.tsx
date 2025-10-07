'use client';


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

const planTypes = [

  {
    type: 'PFRD',
    title: 'Pre-Facility & Referral Development Plan',
    description: 'Strategic planning for pre-facility development and referral systems',
    icon: Target,
    color: 'from-app-primary to-app-primary-light',
    stats: { active: 0, total: 0 }
    
  },
  {
    type: 'ECCD',
    title: 'Emergency & Critical Care Development Plan',
    description: 'Planning for emergency services and critical care development',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
    stats: { active: 0, total: 0 }
  },
  {
    type: 'HDD',
    title: 'Hospital Development Directorate Plan',
    description: 'Comprehensive hospital development and management planning',
    icon: Users,
    color: 'from-app-primary-light to-app-primary',
    stats: { active: 0, total: 0 }
  },
  {
    type: 'SRD',
    title: 'Specialty & Rehabilitative Services Plan',
    description: 'Planning for specialty care and rehabilitation services',
    icon: Laptop,
    color: 'from-orange-500 to-red-500',
    stats: { active: 0, total: 0 }
  },
  {
    type: 'LEO',
    title: 'Lead Executive Officer Plan',
    description: 'Strategic planning and management for lead executive officer initiatives',
    icon: Users,
    color: 'from-app-primary-light to-app-primary',
    stats: { active: 0, total: 0 }
  }
];

export default function PlanTypesPage() {
  const totalActive = planTypes.reduce((sum, plan) => sum + plan.stats.active, 0);
  const totalPlans = planTypes.reduce((sum, plan) => sum + plan.stats.total, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-app-foreground mb-2">Annual Plans</h1>
        <p className="text-neutral-600">Select a plan type to view or create plans</p>
      </div>

      {/* Quick Stats */}
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
              <p className="text-2xl font-bold text-app-foreground">{planTypes.length}</p>
              <p className="text-sm text-neutral-600">Plan Types</p>
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
                {Math.round((totalActive / totalPlans == 0? 1 : totalActive / totalPlans) * 100)}%
              </p>
              <p className="text-sm text-neutral-600">Completion Rate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Plan Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-app-foreground mb-6">Plan Categories</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {planTypes.map((planType, index) => {
            const Icon = planType.icon;
            const completionRate = Math.round((planType.stats.active / planType.stats.total) * 100);

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
                        <span className="text-lg font-bold text-app-foreground">{planType.stats.active}</span>
                        <span className="text-sm text-neutral-500">/ {planType.stats.total}</span>
                      </div>
                      <p className="text-xs text-neutral-500">Active / Total</p>
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
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{planType.stats.active} active</span>
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
              <span>Create New Plan</span>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
} 