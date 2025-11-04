'use client';

import React, { useState, useEffect } from 'react';
import { SubActivity, Week } from '@/types/subactivity';
import { subActivityService } from '@/services/subactivityService';
import { weekService } from '@/services/weekService';
import { formatToEthiopianDate } from '@/utils/ethiopianDateUtils';
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
const CalendarIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default function MyTasksPage() {
  const [myTasks, setMyTasks] = useState<SubActivity[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [weekFilter, setWeekFilter] = useState<string>('all');
  const [progressUpdateModal, setProgressUpdateModal] = useState<{ isOpen: boolean; subActivity: SubActivity | null }>({
    isOpen: false,
    subActivity: null
  });

  // --- due-date helpers ---
  const daysUntil = (dateStr: string) => {
    const today = new Date();
    const due = new Date(dateStr);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const d = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
    const diffMs = d - t;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const isDueSoon = (dateStr: string, status: SubActivity['status'], daysThreshold = 7) => {
    // Only consider tasks that are pending or in progress
    if (status === 'COMPLETED') return false;
    const d = daysUntil(dateStr);
    return d <= daysThreshold && d >= 0;
  };

  useEffect(() => {
    fetchMyTasks();
    fetchWeeks();
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

  const fetchWeeks = async () => {
    try {
      const currentYear = new Date().getFullYear();
      let weeksData = await weekService.getAll(currentYear);
      
      // If no weeks exist for current year, generate them
      if (weeksData.length === 0) {
        await weekService.generateForYear(currentYear);
        weeksData = await weekService.getAll(currentYear);
      }
      
      setWeeks(weeksData);
    } catch (err) {
      console.error('Failed to fetch weeks:', err);
    }
  };

  const handleUpdateProgress = async (subActivityId: string, data: any) => {
    try {
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
    let filtered = myTasks;

    // Filter by status
    switch (filter) {
      case 'pending':
        filtered = filtered.filter(task => task.status === 'NOT_STARTED');
        break;
      case 'in_progress':
        filtered = filtered.filter(task => task.status === 'IN_PROGRESS');
        break;
      case 'completed':
        filtered = filtered.filter(task => task.status === 'COMPLETED');
        break;
      default:
        break;
    }

    // Filter by week
    if (weekFilter !== 'all') {
      const selectedWeek = weeks.find(w => w.id === weekFilter);
      if (selectedWeek) {
        filtered = filtered.filter(task => {
          if (!task.start_week || !task.end_week) return false;
          
          const startWeek = task.start_week;
          const endWeek = task.end_week;
          
          // Task starts, ends, or overlaps with selected week
          if (startWeek.year === selectedWeek.year && endWeek.year === selectedWeek.year) {
            // Same year: check if selected week is between start and end
            return startWeek.week_number <= selectedWeek.week_number && 
                   selectedWeek.week_number <= endWeek.week_number;
          } else if (startWeek.year === selectedWeek.year) {
            // Task starts in selected year, check if selected week is >= start week
            return startWeek.week_number <= selectedWeek.week_number;
          } else if (endWeek.year === selectedWeek.year) {
            // Task ends in selected year, check if selected week is <= end week
            return selectedWeek.week_number <= endWeek.week_number;
          } else {
            // Task spans across selected year
            return startWeek.year < selectedWeek.year && endWeek.year > selectedWeek.year;
          }
        });
      }
    }

    return filtered;
  };

  const getTaskStats = () => {
    const filtered = getFilteredTasks();
    const total = filtered.length;
    const completed = filtered.filter(task => task.status === 'COMPLETED').length;
    const inProgress = filtered.filter(task => task.status === 'IN_PROGRESS').length;
    const pending = filtered.filter(task => task.status === 'NOT_STARTED').length;
    const delayed = filtered.filter(task => task.status === 'DELAYED').length;

    return { total, completed, inProgress, pending, delayed };
  };

  const isOverdue = (task: SubActivity) => {
    if (!task.end_week) return false;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentWeek = getWeekNumber(currentDate);
    
    // Check if end week has passed
    if (task.end_week.year < currentYear) return true;
    if (task.end_week.year === currentYear && task.end_week.week_number < currentWeek) return true;
    
    return false;
  };

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
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
        <div className="border-b border-gray-200 px-6 pt-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            <nav className="-mb-px flex space-x-8 flex-1">
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
            <div className="flex items-center space-x-2">
              <label htmlFor="week-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter by Week:
              </label>
              <select
                id="week-filter"
                value={weekFilter}
                onChange={(e) => setWeekFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Weeks</option>
                {weeks.map((week) => (
                  <option key={week.id} value={week.id}>
                    {week.label} ({week.year})
                  </option>
                ))}
              </select>
            </div>
          </div>
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
                        {isOverdue(task) && task.status !== 'COMPLETED' && (
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
                          <span>
                            Weeks: {task.start_week?.label || 'N/A'} - {task.end_week?.label || 'N/A'}
                            {task.start_week?.year && task.start_week.year === task.end_week?.year && (
                              ` (${task.start_week.year})`
                            )}
                          </span>
                          {/* <span>Due: {formatToEthiopianDate(task.end_date, 'medium')}</span>

                          {isDueSoon(task.end_date, task.status) && (
                            <span className="ml-3 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                              Due in {daysUntil(task.end_date)} day{daysUntil(task.end_date) !== 1 ? 's' : ''}
                            </span>
                          )} */}
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
            handleUpdateProgress(progressUpdateModal.subActivity!.id, data)
          }}
          onCancel={() => setProgressUpdateModal({ isOpen: false, subActivity: null })}
          open={progressUpdateModal.isOpen}
        />
      )}
    </div>
  );
}
