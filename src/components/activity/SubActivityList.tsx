'use client';

import React, { useState, useEffect } from 'react';
import { SubActivity, SubActivityStats } from '@/types/subactivity';
import { subActivityService } from '@/services/subactivityService';
import { userService } from '@/services/userService';

import SubActivityForm from '@/components/activity/SubActivityForm';
import ProgressUpdateModal from '@/components/activity/ProgressUpdateModal';

interface SubActivityListProps {
  activityId: string;
  activityTitle: string;
  canEdit?: boolean;
}

// SVG Icon Components
const PlusIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const UserIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ClockIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TargetIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircleIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.081 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

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
      case 'NOT_STARTED': return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'DELAYED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Subactivities for {activityTitle}
          </h2>
          {canEdit && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Subactivity</span>
            </button>
          )}
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <TargetIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Completed</p>
                  <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
                </div>
                <CheckCircleIcon className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.in_progress}</p>
                </div>
                <ClockIcon className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Not Started</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.not_started}</p>
                </div>
                <AlertCircleIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.average_progress}%</p>
                </div>
                <TargetIcon className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subactivities List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {subActivities.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No subactivities yet. Click "Add Subactivity" to create one.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {subActivities.map((subActivity) => (
              <div key={subActivity.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{subActivity.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(subActivity.status)}`}>
                        {subActivity.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(subActivity.priority)}`}>
                        {subActivity.priority} Priority
                      </span>
                    </div>
                    {subActivity.description && (
                      <p className="text-gray-600 mb-3">{subActivity.description}</p>
                    )}
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <UserIcon className="h-4 w-4" />
                        <span>{subActivity.user ? (subActivity.user.fullName || subActivity.user.firstName || subActivity.user.email) : 'Unknown User'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{new Date(subActivity.start_date).toLocaleDateString()} - {new Date(subActivity.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${subActivity.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {subActivity.progress}%
                        </span>
                      </div>
                    </div>
                    {subActivity.notes && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Notes:</strong> {subActivity.notes}
                      </p>
                    )}
                  </div>

                  {canEdit && (
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setProgressUpdateModal({ isOpen: true, subActivity })}
                        className="text-blue-600 hover:text-blue-800"
                        title="Update Progress"
                      >
                        <TargetIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingSubActivity(subActivity);
                          setShowForm(true);
                        }}
                        className="text-gray-600 hover:text-gray-800"
                        title="Edit"
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubActivity(subActivity.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
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