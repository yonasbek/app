'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity } from '@/types/activity';
import { Plan } from '@/types/plan';
import { activityService } from '@/services/activityService';
import { planService } from '@/services/planService';

export default function PlanActivitiesPage({ params }: { params: { id: string } }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [planData, activitiesData] = await Promise.all([
        planService.getById(params.id),
        activityService.getByPlanId(params.id)
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Activities for {plan?.title}
          </h1>
          <p className="text-gray-600 mt-1">
            Fiscal Year: {plan?.fiscal_year}
          </p>
        </div>
        <Link
          href={`/plans/${params.id}/activities/new`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Activity
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3 font-medium text-gray-500">Title</div>
              <div className="col-span-3 font-medium text-gray-500">Status</div>
              <div className="col-span-2 font-medium text-gray-500">Progress</div>
              <div className="col-span-2 font-medium text-gray-500">Start Date</div>
              <div className="col-span-2 font-medium text-gray-500">Actions</div>
            </div>
          </div>

          <div className="bg-white divide-y divide-gray-200">
            {activities.length === 0 ? (
              <div className="px-6 py-4 text-center text-gray-500">
                No activities found. Click "Add Activity" to create one.
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <p className="text-gray-900 font-medium">{activity.title}</p>
                      <p className="text-gray-500 text-sm truncate">{activity.remarks}</p>
                    </div>
                    <div className="col-span-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)}`}>
                        {activity.status.replace('_', ' ').charAt(0).toUpperCase() + 
                         activity.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${activity.progress}%` }}
                          />
                        </div>
                        <span className="ml-2 text-gray-600 text-sm">
                          {activity.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">
                        {new Date(activity.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <div className="flex space-x-2">
                        <Link
                          href={`/plans/${params.id}/activities/${activity.id}/edit`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/plans/${params.id}/activities/${activity.id}`}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 