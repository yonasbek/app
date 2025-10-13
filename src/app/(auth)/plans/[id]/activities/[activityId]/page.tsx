'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity } from '@/types/activity';
import { Plan } from '@/types/plan';
import { activityService } from '@/services/activityService';
import { planService } from '@/services/planService';
import { use } from 'react';

import SubActivityList from '@/components/activity/SubActivityList';
import { useParams, useRouter } from 'next/navigation';

// SVG Icon Components
const ArrowLeftIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const EditIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const CalendarIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const DollarSignIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const TargetIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FileTextIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default function ActivityDetailPage({ params }: { params: Promise<{ id: string; activityId: string }> }) {
  const resolvedParams = use(params);
  const [activity, setActivity] = useState<any | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [planData, activityData] = await Promise.all([
        planService.getById(resolvedParams.id),
        activityService.getById(resolvedParams.activityId)
      ]);
      setPlan(planData);
      setActivity(activityData);
    } catch (err) {
      setError('Failed to fetch activity');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'NOT_STARTED': return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'DELAYED': return 'bg-red-100 text-red-800';
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

  if (!activity) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-800">Activity not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <button
          onClick={() => router.push(`/plans/${resolvedParams.id}/activities`)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4"
        >
          <ArrowLeftIcon className="mr-2" />
          Back to Main Activities
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{activity?.title}</h1>
            <p className="text-gray-600 mb-4">{activity?.description}</p>
            <div className="text-sm text-gray-500 mb-4">
              Strategic Initiative: {plan?.title}
            </div>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <EditIcon className="mr-2" />
            Edit Main Activity
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-2">
            <CalendarIcon className="text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Start Date</h3>
          </div>
          <p className="text-gray-600">{activity?.start_date ? new Date(activity.start_date).toLocaleDateString() : 'Not set'}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-2">
            <CalendarIcon className="text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">End Date</h3>
          </div>
          <p className="text-gray-600">{activity?.end_date ? new Date(activity.end_date).toLocaleDateString() : 'Not set'}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-2">
            <UserIcon className="text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Assigned To</h3>
          </div>
          <p className="text-gray-600">{activity?.assigned_to || 'Not assigned'}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-2">
            <DollarSignIcon className="text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Budget</h3>
          </div>
          <p className="text-gray-600">{activity?.budget_allocated ? `$${activity.budget_allocated.toLocaleString()}` : 'Not set'}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-2">
            <TargetIcon className="text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Status</h3>
          </div>
          <p className="text-gray-600">{activity?.status || 'Not set'}</p>
        </div>

        {/* s */}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sub-Activities</h2>
        {activity && (
          <SubActivityList 
            activityId={activity.id} 
            activityTitle={activity.title}
            // onSubActivityChange={fetchData}
          />
        )}
      </div>
    </div>
  );
} 