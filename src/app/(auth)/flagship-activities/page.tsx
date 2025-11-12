'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity } from '@/types/activity';
import { activityService } from '@/services/activityService';
import { formatToEthiopianDate } from '@/utils/ethiopianDateUtils';
import Card from '@/components/ui/Card';
import {
  Star,
  Calendar,
  BarChart3,
  Activity as ActivityIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  User,
  Target,
  TrendingUp
} from 'lucide-react';

export default function FlagshipActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchFlagshipActivities();
  }, []);

  const fetchFlagshipActivities = async () => {
    try {
      setLoading(true);
      const data = await activityService.getFlagshipActivities();
      setActivities(data);
    } catch (err) {
      setError('Failed to fetch flagship activities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (activityId: string) => {
    setExpandedActivities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

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

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress > 0) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading flagship activities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100">
            <Star className="w-7 h-7 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Flagship Activities</h1>
            <p className="text-gray-600 text-sm mt-1">
              View and track all flagship activities and their sub-activities
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {activities.filter(a => a.status === 'IN_PROGRESS').length}
              </p>
            </div>
            <ActivityIcon className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {activities.filter(a => a.status === 'COMPLETED').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {activities.length > 0
                  ? Math.round(activities.reduce((sum, a) => sum + (a.progress || 0), 0) / activities.length)
                  : 0}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Activities List */}
      {activities.length === 0 ? (
        <Card className="p-8 text-center">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Flagship Activities</h3>
          <p className="text-gray-600">
            There are no flagship activities yet. Mark activities as flagship when creating them.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const statusInfo = getStatusInfo(activity.status);
            const StatusIcon = statusInfo.icon;
            const isExpanded = expandedActivities.has(activity.id);
            const subActivities = activity.subactivities || [];

            return (
              <Card key={activity.id} className="overflow-hidden">
                {/* Main Activity Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpand(activity.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusInfo.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{activity.strategic_objective}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatToEthiopianDate(activity.start_date)} -{' '}
                            {formatToEthiopianDate(activity.end_date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{activity.assigned_person}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          <span>{activity.responsible_department}</span>
                        </div>
                        {activity.plan && (
                          <Link
                            href={`/plans/${activity.plan_id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Plan: {activity.plan.title || activity.plan_id}
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-4">
                      {/* Progress Bar */}
                      <div className="w-32">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">Progress</span>
                          <span className="text-xs font-bold text-gray-900">{activity.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getProgressColor(activity.progress || 0)}`}
                            style={{ width: `${activity.progress || 0}%` }}
                          />
                        </div>
                      </div>
                      {/* Expand/Collapse Icon */}
                      {subActivities.length > 0 && (
                        <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sub-Activities */}
                {isExpanded && subActivities.length > 0 && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Sub-Activities ({subActivities.length})
                      </h4>
                      <div className="space-y-3">
                        {subActivities.map((subActivity: any) => {
                          const subStatusInfo = getStatusInfo(subActivity.status || 'NOT_STARTED');
                          const SubStatusIcon = subStatusInfo.icon;

                          return (
                            <div
                              key={subActivity.id}
                              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-medium text-gray-900">{subActivity.title}</h5>
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 ${subStatusInfo.color}`}
                                    >
                                      <SubStatusIcon className="w-3 h-3" />
                                      {subStatusInfo.label}
                                    </span>
                                  </div>
                                  {subActivity.description && (
                                    <p className="text-sm text-gray-600 mb-2">{subActivity.description}</p>
                                  )}
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                    {subActivity.user && (
                                      <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        <span>
                                          {subActivity.user.firstName} {subActivity.user.lastName}
                                        </span>
                                      </div>
                                    )}
                                    {subActivity.start_date && subActivity.end_date && (
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                          {formatToEthiopianDate(subActivity.start_date)} -{' '}
                                          {formatToEthiopianDate(subActivity.end_date)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="w-24">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs font-medium text-gray-700">Progress</span>
                                      <span className="text-xs font-bold text-gray-900">
                                        {subActivity.progress || 0}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full transition-all ${getProgressColor(
                                          subActivity.progress || 0
                                        )}`}
                                        style={{ width: `${subActivity.progress || 0}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

