'use client';

import React, { useState, useEffect } from 'react';
import { SubActivity } from '@/types/subactivity';
import { subActivityService } from '@/services/subactivityService';
import ProgressUpdateModal from '@/components/activity/ProgressUpdateModal';

// SVG Icon Components
const CheckCircleIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertTriangleIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.081 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const TargetIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CalendarIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default function MyTasksPage() {
  const [myTasks, setMyTasks] = useState<SubActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [progressUpdateModal, setProgressUpdateModal] = useState<{ isOpen: boolean; subActivity: SubActivity | null }>({
    isOpen: false,
    subActivity: null
  });

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const tasks = await subActivityService.getMyTasks();
      setMyTasks(tasks);
    } catch (err) {
      setError('Failed to fetch your tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (subActivityId: string, data: any) => {
    try {
      console.log(data, 'data here');
      await subActivityService.updateProgress(subActivityId, { progress: data.progress, notes: data.notes });
      setProgressUpdateModal({ isOpen: false, subActivity: null });
      fetchMyTasks(); // Refresh the list
    } catch (err) {
      console.error('Failed to update progress:', err);
      alert('Failed to update progress. Please try again.');
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

  const getFilteredTasks = () => {
    switch (filter) {
      case 'pending':
        return myTasks.filter(task => task.status === 'NOT_STARTED');
      case 'in_progress':
        return myTasks.filter(task => task.status === 'IN_PROGRESS');
      case 'completed':
        return myTasks.filter(task => task.status === 'COMPLETED');
      default:
        return myTasks;
    }
  };

  const getTaskStats = () => {
    const total = myTasks.length;
    const completed = myTasks.filter(task => task.status === 'COMPLETED').length;
    const inProgress = myTasks.filter(task => task.status === 'IN_PROGRESS').length;
    const pending = myTasks.filter(task => task.status === 'NOT_STARTED').length;
    const delayed = myTasks.filter(task => task.status === 'DELAYED').length;

    return { total, completed, inProgress, pending, delayed };
  };

  const isOverdue = (endDate: string) => {
    return new Date(endDate) < new Date() && new Date(endDate).toDateString() !== new Date().toDateString();
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

  const stats = getTaskStats();
  const filteredTasks = getFilteredTasks();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-600 mt-1">Manage your assigned subactivities and track your progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <TargetIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-900">{stats.inProgress}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <AlertTriangleIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Delayed</p>
              <p className="text-2xl font-bold text-red-900">{stats.delayed}</p>
            </div>
            <AlertTriangleIcon className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { key: 'all', label: 'All Tasks', count: stats.total },
              { key: 'pending', label: 'Pending', count: stats.pending },
              { key: 'in_progress', label: 'In Progress', count: stats.inProgress },
              { key: 'completed', label: 'Completed', count: stats.completed }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${filter === tab.key
                  ? 'border-app-foreground text-app-foreground'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Tasks List */}
        <div>
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {filter === 'all' ? 'No tasks assigned to you yet.' : `No ${filter.replace('_', ' ')} tasks.`}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <div key={task.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority} Priority
                        </span>
                        {isOverdue(task.end_date) && task.status !== 'COMPLETED' && (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            Overdue
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-gray-600 mb-3">{task.description}</p>
                      )}

                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <TargetIcon className="h-4 w-4" />
                          <span>Activity: {task.activity?.title}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Due: {new Date(task.end_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-app-foreground h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {task.progress}%
                        </span>
                      </div>

                      {task.notes && (
                        <p className="text-sm text-gray-600">
                          <strong>Latest Notes:</strong> {task.notes}
                        </p>
                      )}
                    </div>

                    <div className="ml-4">
                      <button
                        onClick={() => setProgressUpdateModal({ isOpen: true, subActivity: task })}
                        className="bg-app-foreground text-white px-4 py-2 rounded-lg hover:bg-app-foreground/90 flex items-center space-x-2"
                      >
                        <TargetIcon className="h-4 w-4" />
                        <span>Update Progress</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Update Modal */}
      {progressUpdateModal.isOpen && progressUpdateModal.subActivity && (
        <ProgressUpdateModal
          subActivity={progressUpdateModal.subActivity}
          onSubmit={(data) => {
            console.log(data, 'data here');
            handleUpdateProgress(progressUpdateModal.subActivity!.id, data)
          }}
          onCancel={() => setProgressUpdateModal({ isOpen: false, subActivity: null })}
          open={progressUpdateModal.isOpen}
        />
      )}
    </div>
  );
} 