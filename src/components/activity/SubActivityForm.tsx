'use client';

import React, { useState, useEffect } from 'react';
import { SubActivity, Week } from '@/types/subactivity';
import { weekService } from '@/services/weekService';

// SVG Icon Components
const XIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface User {
  id: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
}

interface SubActivityFormProps {
  subActivity?: SubActivity | null;
  activityId: string;
  users: User[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function SubActivityForm({ subActivity, activityId, users, onSubmit, onCancel }: SubActivityFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    user_id: '',
    start_week_id: '',
    end_week_id: '',
    priority: 'MEDIUM' as 'HIGH' | 'MEDIUM' | 'LOW',
    notes: '',
    weight: 0
  });

  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loadingWeeks, setLoadingWeeks] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchWeeks();
  }, []);

  useEffect(() => {
    if (subActivity) {
      setFormData({
        title: subActivity.title || '',
        description: subActivity.description || '',
        user_id: subActivity.user_id || '',
        start_week_id: subActivity.start_week_id || '',
        end_week_id: subActivity.end_week_id || '',
        priority: subActivity.priority as 'HIGH' | 'MEDIUM' | 'LOW' || 'MEDIUM' as ``,
        notes: subActivity.notes || '',
        weight: subActivity.weight || 0
      });
    }
  }, [subActivity]);

  const fetchWeeks = async () => {
    try {
      setLoadingWeeks(true);
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
    } finally {
      setLoadingWeeks(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.user_id) {
      newErrors.user_id = 'Please select a user';
    }

    if (!formData.start_week_id) {
      newErrors.start_week_id = 'Start week is required';
    }

    if (!formData.end_week_id) {
      newErrors.end_week_id = 'End week is required';
    }

    if (formData.start_week_id && formData.end_week_id) {
      const startWeek = weeks.find(w => w.id === formData.start_week_id);
      const endWeek = weeks.find(w => w.id === formData.end_week_id);
      
      if (startWeek && endWeek) {
        if (startWeek.year > endWeek.year || (startWeek.year === endWeek.year && startWeek.week_number > endWeek.week_number)) {
          newErrors.end_week_id = 'End week must be after or equal to start week';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      activity_id: activityId
    };

    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getUserDisplayName = (user: User): string => {
    if (user.fullName) return user.fullName;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    return user.email;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {subActivity ? 'Edit Sub-Activity' : 'Create New Sub-Activity'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter sub-activity title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter sub-activity description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign to User *
            </label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.user_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {getUserDisplayName(user)}
                </option>
              ))}
            </select>
            {errors.user_id && (
              <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Week *
              </label>
              <select
                name="start_week_id"
                value={formData.start_week_id}
                onChange={handleChange}
                disabled={loadingWeeks}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.start_week_id ? 'border-red-500' : 'border-gray-300'
                } ${loadingWeeks ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">Select start week</option>
                {weeks.map((week) => (
                  <option key={week.id} value={week.id}>
                    {week.label} ({week.year})
                  </option>
                ))}
              </select>
              {errors.start_week_id && (
                <p className="text-red-500 text-sm mt-1">{errors.start_week_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Week *
              </label>
              <select
                name="end_week_id"
                value={formData.end_week_id}
                onChange={handleChange}
                disabled={loadingWeeks}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.end_week_id ? 'border-red-500' : 'border-gray-300'
                } ${loadingWeeks ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">Select end week</option>
                {weeks.map((week) => (
                  <option key={week.id} value={week.id}>
                    {week.label} ({week.year})
                  </option>
                ))}
              </select>
              {errors.end_week_id && (
                <p className="text-red-500 text-sm mt-1">{errors.end_week_id}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any additional notes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter weight"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {subActivity ? 'Update' : 'Create'} Sub-Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 