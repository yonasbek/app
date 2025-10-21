'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity } from '@/types/activity';
import { Plan } from '@/types/plan';
import { activityService } from '@/services/activityService';
import { planService } from '@/services/planService';
import { formatToEthiopianDate } from '@/utils/ethiopianDateUtils';
import { use } from 'react';
import Card from '@/components/ui/Card';
import {
  ArrowLeft,
  Plus,
  Edit,
  Eye,
  Calendar,
  BarChart3,
  Activity as ActivityIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  Search
} from 'lucide-react';

export default function PlanActivitiesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Activity['status'] | 'ALL'>('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [planData, activitiesData] = await Promise.all([
        planService.getById(resolvedParams.id),
        activityService.getByPlanId(resolvedParams.id)
      ]);
      setPlan(planData);
      setActivities(activitiesData);
    } catch (err) {
      setError('Failed to fetch activities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter activities based on search and status
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.remarks && activity.remarks.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || activity.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status: Activity['status']) => {
    switch (status) {
      case 'NOT_STARTED':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock,
          label: 'Not Started'
        };
      case 'IN_PROGRESS':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: ActivityIcon,
          label: 'In Progress'
        };
      case 'COMPLETED':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          label: 'Completed'
        };
      case 'DELAYED':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertCircle,
          label: 'Delayed'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock,
          label: 'Unknown'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-app-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back Button */}
      <div className="flex justify-left items-center">
        <button
          onClick={() => window.history.back()}
          className="link flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Plans</span>
        </button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 mb-3">
            <div className="w-10 h-10 bg-app-foreground rounded-xl flex items-center justify-center">
              <ActivityIcon className="w-6 h-6 text-white" />
            </div>
            <span className="px-3 py-1 bg-app-foreground text-white rounded-lg text-sm font-semibold">
              Main Activities
            </span>
          </div>
          <h1 className="text-3xl font-bold text-app-foreground mb-2">
            {plan?.title}
          </h1>
          <div className="flex items-center space-x-4 text-neutral-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Fiscal Year: {plan?.fiscal_year}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">{activities.length} Activities</span>
            </div>
          </div>
          <p className="text-sm text-app-primary mt-2 italic flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>Activity progress is automatically calculated from subactivities</span>
          </p>
        </div>
        <Link
          href={`/plans/${resolvedParams.id}/activities/new`}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-app-foreground text-white rounded-lg hover:bg-app-primary-light transition-colors duration-200 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Main Activity</span>
        </Link>
      </div>

      {/* Summary Stats */}
      {activities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-app-secondary">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ActivityIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-app-foreground">{activities.length}</p>
                <p className="text-sm text-neutral-600">Total Activities</p>
              </div>
            </div>
          </Card>

          <Card className="border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-app-foreground">
                  {activities.filter(a => a.status === 'COMPLETED').length}
                </p>
                <p className="text-sm text-neutral-600">Completed</p>
              </div>
            </div>
          </Card>

          <Card className="border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-app-foreground">
                  {activities.filter(a => a.status === 'IN_PROGRESS').length}
                </p>
                <p className="text-sm text-neutral-600">In Progress</p>
              </div>
            </div>
          </Card>

          <Card className="border border-amber-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-app-foreground">
                  {Math.round(activities.reduce((sum, a) => sum + a.progress, 0) / activities.length)}%
                </p>
                <p className="text-sm text-neutral-600">Avg Progress</p>
              </div>
            </div>
          </Card>
        </div>
      )}
      {/* Activities Table */}
      <Card className="overflow-hidden">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-app-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <ActivityIcon className="w-8 h-8 text-app-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-app-foreground mb-2">No Activities Yet</h3>
            <p className="text-neutral-600 mb-6">Get started by adding your first main activity</p>
            <Link
              href={`/plans/${resolvedParams.id}/activities/new`}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-app-foreground text-white rounded-lg hover:bg-app-primary-light transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Add Main Activity</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="p-6 border-b border-app-secondary">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-app-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-app-foreground text-sm"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Activity['status'] | 'ALL')}
                  className="px-4 py-2 bg-white border border-app-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-app-foreground text-sm cursor-pointer"
                >
                  <option value="ALL">All Status</option>
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="DELAYED">Delayed</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {filteredActivities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-500">No activities found</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('ALL');
                    }}
                    className="mt-2 text-app-foreground text-sm hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-app-secondary">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-app-secondary">
                    {filteredActivities.map((activity) => {
                      const statusInfo = getStatusInfo(activity.status);
                      const StatusIcon = statusInfo.icon;

                      return (
                        <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-app-foreground">{activity.title}</div>
                            {activity.remarks && (
                              <div className="text-sm text-neutral-500 mt-1">{activity.remarks}</div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-app-secondary rounded-full h-2 max-w-[100px]">
                                <div
                                  className="bg-app-primary h-2 rounded-full transition-all"
                                  style={{ width: `${activity.progress}%` }}
                                />
                              </div>
                              <span className="text-sm text-neutral-600 font-medium">{activity.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-600">
                            {formatToEthiopianDate(activity.start_date, 'medium')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/plans/${resolvedParams.id}/activities/${activity.id}`}
                                className="p-1.5 text-neutral-600 hover:text-app-primary hover:bg-app-accent rounded transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <Link
                                href={`/plans/${resolvedParams.id}/activities/${activity.id}/edit`}
                                className="p-1.5 text-app-foreground hover:bg-app-accent rounded transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </Card>


    </div>
  );
} 