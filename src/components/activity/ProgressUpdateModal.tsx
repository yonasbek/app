'use client';

import React, { useState } from 'react';
import { SubActivity } from '@/types/subactivity';

// SVG Icon Components
const XIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface ProgressUpdateModalProps {
  subActivity: SubActivity;
  onSubmit: (data: {progress: number, notes?: string}) => void;
  onCancel: () => void;
}

export default function ProgressUpdateModal({ subActivity, onSubmit, onCancel }: ProgressUpdateModalProps) {
  const [progress, setProgress] = useState(subActivity.progress);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {progress, notes};
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Update Progress
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {subActivity.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {subActivity.description}
            </p>
          </div>

          <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700 mb-2"> 
              Progress ({progress}%)
             </label>
             <select
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="block w-full rounded-md border-grey-300 shadow-sm focus:border-grey-500 focus:ring-blue-500 text-md">
              <option value={0}>Draft</option>
              <option value={50}>In Progress</option>
              <option value={100}>Completed</option>
            </select>
          </div>


          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes about the progress..."
            />
          </div>

          <div className="flex justify-end space-x-3">
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
              Update Progress
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
