'use client';

import React, { useState, useEffect } from 'react';
import { SubActivity, SubActivityStats } from '@/types/subactivity';
import { subActivityService } from '@/services/subactivityService';
import { userService } from '@/services/userService';
import { formatToEthiopianDate, formatEthiopianDateRange } from '@/utils/ethiopianDateUtils';
import {
  Plus,
  Edit2,
  Trash2,
  User,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  Calendar,
  TrendingUp,
  FileText,
  Pause,
  BarChart3
} from 'lucide-react';

import SubActivityForm from '@/components/activity/SubActivityForm';
import ProgressUpdateModal from '@/components/activity/ProgressUpdateModal';
import Card from '@/components/ui/Card';

interface SubActivityListProps {
  activityId: string;
  activityTitle: string;
  canEdit?: boolean;
}

export default function SubActivityList({ activityId, activityTitle, canEdit = true }: SubActivityListProps) {
  const [subActivities, setSubActivities] = useState<SubActivity[]>([]);
  const [stats, setStats] = useState<SubActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSubActivity, setEditingSubActivity] = useState<SubActivity | null>(null);
  const [progressUpdateModal, setProgressUpdateModal] = useState<{ isOpen: boolean; subActivity: SubActivity | null }>({
    isOpen: false,
    subActivity: null
  });
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchSubActivities();
    fetchStats();
    fetchUsers();
  }, [activityId]);

  const fetchSubActivities = async () => {
    try {
      setLoading(true);
      const data = await subActivityService.getByActivityId(activityId);
      setSubActivities(data);
    } catch (err) {
      setError('Failed to fetch subactivities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await subActivityService.getSubActivityStats(activityId);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersData = await userService.getAll();
      setUsers(usersData);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleCreateSubActivity = async (data: any) => {
    try {
      await subActivityService.create({
        ...data,
        activity_id: activityId
      });
      setShowForm(false);
      fetchSubActivities();
      fetchStats();
    } catch (err) {
      console.error('Failed to create subactivity:', err);
    }
  };

  const handleUpdateSubActivity = async (data: any) => {
    if (!editingSubActivity) return;

    try {
      await subActivityService.update(editingSubActivity.id, data);
      setEditingSubActivity(null);
      setShowForm(false);
      fetchSubActivities();
      fetchStats();
    } catch (err) {
      console.error('Failed to update subactivity:', err);
    }
  };

  const handleUpdateProgress = async (subActivityId: string, data: any) => {
    try {
      console.log(data, 'data here');
      await subActivityService.updateProgress(subActivityId, { progress: data.progress, notes: data.notes });
      setProgressUpdateModal({ isOpen: false, subActivity: null });
      fetchSubActivities();
      fetchStats();
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const handleDeleteSubActivity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subactivity?')) return;

    try {
      await subActivityService.delete(id);
      fetchSubActivities();
      fetchStats();
    } catch (err) {
      console.error('Failed to delete subactivity:', err);
    }
  };

  const getStatusColor = (status: SubActivity['status']) => {
    switch (status) {
      case 'NOT_STARTED': return 'bg-neutral-100 text-neutral-700 border-neutral-200';
      case 'IN_PROGRESS': return 'bg-blue-50 text-app-primary border-blue-200';
      case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-200';
      case 'DELAYED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getStatusIcon = (status: SubActivity['status']) => {
    switch (status) {
      case 'NOT_STARTED': return <Pause className="w-3 h-3" />;
      case 'IN_PROGRESS': return <Clock className="w-3 h-3" />;
      case 'COMPLETED': return <CheckCircle2 className="w-3 h-3" />;
      case 'DELAYED': return <AlertCircle className="w-3 h-3" />;
      default: return <Target className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Summary Stats Skeleton */}
        <div className="bg-gradient-to-br from-white to-app-accent rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <div className="h-8 w-64 bg-neutral-200 rounded animate-pulse"></div>
              <div className="h-4 w-48 bg-neutral-100 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-neutral-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg border border-neutral-200">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 bg-neutral-200 rounded-full animate-pulse"></div>
                  <div className="w-full space-y-2">
                    <div className="h-10 w-16 mx-auto bg-neutral-200 rounded animate-pulse"></div>
                    <div className="h-3 w-20 mx-auto bg-neutral-100 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Separator */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-neutral-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-app-bg px-4 text-sm font-medium text-neutral-500 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Sub-Activities List
            </span>
          </div>
        </div>

        {/* Sub-Activities List Skeleton */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
          <div className="divide-y divide-neutral-100">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6">
                <div className="space-y-4">
                  {/* Title and Badges Skeleton */}
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-neutral-200 rounded animate-pulse"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-24 bg-neutral-100 rounded-full animate-pulse"></div>
                      <div className="h-6 w-20 bg-neutral-100 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* Description Skeleton */}
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-neutral-100 rounded animate-pulse"></div>
                    <div className="h-4 w-5/6 bg-neutral-100 rounded animate-pulse"></div>
                  </div>

                  {/* Meta Info Skeleton */}
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-neutral-200 rounded-full animate-pulse"></div>
                      <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-neutral-200 rounded-full animate-pulse"></div>
                      <div className="h-4 w-32 bg-neutral-100 rounded animate-pulse"></div>
                    </div>
                  </div>

                  {/* Progress Bar Skeleton */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-3 w-16 bg-neutral-100 rounded animate-pulse"></div>
                      <div className="h-3 w-12 bg-neutral-100 rounded animate-pulse"></div>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Error Loading Sub-Activities</h3>
            <p className="text-sm text-neutral-600 mt-1">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Stats Section */}
      <div className="bg-gradient-to-br from-white to-app-accent rounded-xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-app-foreground mb-1">Sub-Activities Summary</h2>
            <p className="text-sm text-neutral-600">{activityTitle}</p>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-app-primary text-white rounded-lg hover:bg-app-primary-light transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add New</span>
            </button>
          )}
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-lg border border-neutral-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-app-accent rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-app-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-app-foreground">{stats.total}</p>
                  <p className="text-xs text-neutral-600 mt-1">Total</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-700">{stats.completed}</p>
                  <p className="text-xs text-neutral-600 mt-1">Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-700">{stats.in_progress}</p>
                  <p className="text-xs text-neutral-600 mt-1">In Progress</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-neutral-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center">
                  <Pause className="w-6 h-6 text-neutral-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-neutral-700">{stats.not_started}</p>
                  <p className="text-xs text-neutral-600 mt-1">Not Started</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-700">{stats.average_progress}%</p>
                  <p className="text-xs text-neutral-600 mt-1">Avg Progress</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visual Separator */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-neutral-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-app-bg px-4 text-sm font-medium text-neutral-500 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Sub-Activities List
          </span>
        </div>
      </div>

      {/* Sub-Activities List Section */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
        {subActivities.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-20 h-20 bg-gradient-to-br from-app-primary to-app-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-app-foreground mb-2">No Sub-Activities Yet</h3>
            <p className="text-neutral-500 mb-6 max-w-md mx-auto">Create your first sub-activity to start tracking progress and manage tasks effectively.</p>
            {canEdit && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-app-primary text-white rounded-lg hover:bg-app-primary-light transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Create Sub-Activity</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {subActivities.map((subActivity) => (
              <div key={subActivity.id} className="p-6 hover:bg-app-accent/30 transition-colors group">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    {/* Title and Badges */}
                    <div className="flex flex-wrap items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-app-foreground mb-2">{subActivity.title}</h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(subActivity.status)}`}>
                            {getStatusIcon(subActivity.status)}
                            {subActivity.status.replace('_', ' ')}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(subActivity.priority)}`}>
                            {subActivity.priority}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {subActivity.description && (
                      <p className="text-neutral-600 text-sm leading-relaxed">{subActivity.description}</p>
                    )}

                    {/* Meta Info Row */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-600">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-app-accent rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-app-primary" />
                        </div>
                        <span className="font-medium">
                          {subActivity.user ? (subActivity.user.fullName || subActivity.user.firstName || subActivity.user.email) : 'Unassigned'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-app-accent rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-app-primary" />
                        </div>
                        <span>
                          {formatEthiopianDateRange(subActivity.start_date, subActivity.end_date)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-neutral-600">Progress</span>
                        <span className="text-sm font-bold text-app-foreground">{subActivity.progress}%</span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-app-primary to-app-primary-light h-full rounded-full transition-all duration-500"
                          style={{ width: `${subActivity.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    {subActivity.notes && (
                      <div className="bg-app-accent/50 p-3 rounded-lg">
                        <p className="text-sm text-neutral-700">
                          <span className="font-semibold text-app-foreground">Notes:</span> {subActivity.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {canEdit && (
                    <div className="flex lg:flex-col items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setProgressUpdateModal({ isOpen: true, subActivity })}
                        className="p-2.5 text-app-primary hover:bg-app-primary/10 rounded-lg transition-colors"
                        title="Update Progress"
                      >
                        <Target className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingSubActivity(subActivity);
                          setShowForm(true);
                        }}
                        className="p-2.5 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubActivity(subActivity.id)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <SubActivityForm
          activityId={activityId}
          subActivity={editingSubActivity}
          users={users}
          onSubmit={editingSubActivity ? handleUpdateSubActivity : handleCreateSubActivity}
          onCancel={() => {
            setShowForm(false);
            setEditingSubActivity(null);
          }}
        />
      )}

      {/* Progress Update Modal */}
      {progressUpdateModal.isOpen && progressUpdateModal.subActivity && (
        <ProgressUpdateModal
          open={progressUpdateModal.isOpen}
          subActivity={progressUpdateModal.subActivity}
          onSubmit={(data: any) => handleUpdateProgress(progressUpdateModal.subActivity!.id, data)}
          onCancel={() => setProgressUpdateModal({ isOpen: false, subActivity: null })}
        />
      )}
    </div>
  );
} 