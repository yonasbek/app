'use client';

import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { Plan } from '@/types/plan';
import { activityService } from '@/services/activityService';
import { planService } from '@/services/planService';
import { formatToEthiopianDate } from '@/utils/ethiopianDateUtils';
import { use } from 'react';
import {
  ArrowLeft,
  Edit2,
  Calendar,
  User,
  DollarSign,
  Target,
  FileText,
  CalendarCheck,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Pause
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import SubActivityList from '@/components/activity/SubActivityList';

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
      case 'NOT_STARTED': return 'bg-neutral-100 text-neutral-700 border-neutral-200';
      case 'IN_PROGRESS': return 'bg-blue-50 text-app-primary border-blue-200';
      case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-200';
      case 'DELAYED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getStatusIcon = (status: Activity['status']) => {
    switch (status) {
      case 'NOT_STARTED': return <Pause className="w-4 h-4" />;
      case 'IN_PROGRESS': return <Clock className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4" />;
      case 'DELAYED': return <AlertCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-app-primary rounded-full border-t-transparent mx-auto"></div>
          <p className="text-app-foreground text-sm">Loading activity details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Error Loading Activity</h3>
            <p className="text-sm text-neutral-600 mt-1">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!activity) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <div className="flex items-center space-x-3 text-yellow-600">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Activity Not Found</h3>
            <p className="text-sm text-neutral-600 mt-1">The requested activity could not be found.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/plans/${resolvedParams.id}/activities`)}
        className="inline-flex items-center text-app-primary hover:text-app-primary-light transition-colors duration-200 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Activities</span>
      </button>

      {/* Activity Title */}
      <div>
        <h1 className="text-3xl font-bold text-app-foreground mb-2">{activity?.title}</h1>
        {activity?.description && (
          <p className="text-neutral-600 leading-relaxed">{activity.description}</p>
        )}
      </div>



      {/* Main Layout: Sub-Activities List + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area - Sub-Activities List */}
        <div className="flex-1 min-w-0">
          <SubActivityList
            activityId={activity.id}
            activityTitle={activity.title}
          />
        </div>

        {/* Sidebar with Activity Details */}
        <div className="w-full lg:w-96 lg:flex-shrink-0 space-y-4 lg:sticky lg:top-6 lg:self-start">
          {/* Status Card */}
          <Card className="space-y-4">
            {/* Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Target className="w-4 h-4" />
                <span className="font-medium">Status</span>
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getStatusColor(activity?.status)}`}>
                {getStatusIcon(activity?.status)}
                <span className="font-medium text-xs">{activity?.status?.replace('_', ' ') || 'Not Set'}</span>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <CalendarCheck className="w-4 h-4" />
                <span className="font-medium">Due Date</span>
              </div>
              <p className="text-sm text-app-foreground font-medium">
                {activity?.end_date
                  ? formatToEthiopianDate(activity.end_date, 'long')
                  : 'Not set'}
              </p>
            </div>

            {/* Start Date */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Start Date</span>
              </div>
              <p className="text-sm text-app-foreground font-medium">
                {activity?.start_date
                  ? formatToEthiopianDate(activity.start_date, 'long')
                  : 'Not set'}
              </p>
            </div>

            {/* Assignee */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <User className="w-4 h-4" />
                <span className="font-medium">Assignee</span>
              </div>
              {activity?.assigned_to ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-app-primary to-app-primary-light rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-app-foreground font-medium">{activity.assigned_to}</span>
                </div>
              ) : (
                <span className="text-sm text-neutral-500">Not assigned</span>
              )}
            </div>

            {/* Budget */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">Budget</span>
              </div>
              <p className="text-sm text-app-foreground font-medium">
                {activity?.budget_allocated
                  ? `$${activity.budget_allocated.toLocaleString()}`
                  : 'Not set'}
              </p>
            </div>

            {/* Progress */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Progress</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-app-primary">
                    {activity?.progress_percentage || 0}%
                  </span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-app-primary to-app-primary-light h-full rounded-full transition-all duration-500"
                    style={{ width: `${activity?.progress_percentage || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Strategic Initiative Card */}
          {plan?.title && (
            <Card className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <FileText className="w-4 h-4" />
                <span className="font-medium">Strategic Initiative</span>
              </div>
              <p className="text-sm text-app-foreground font-medium">{plan.title}</p>
            </Card>
          )}

          {/* Edit Button */}
          <button
            onClick={() => router.push(`/plans/${resolvedParams.id}/activities/${activity.id}/edit`)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-app-primary text-white rounded-lg hover:bg-app-primary-light transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Edit2 className="w-4 h-4" />
            <span className="font-medium">Edit Activity</span>
          </button>
        </div>
      </div>
    </div>
  );
} 