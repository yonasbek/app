'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trainingService } from '@/services/trainingService';
import { formatToEthiopianDate } from '@/utils/ethiopianDateUtils';
import { Course, CourseStatistics } from '@/types/training';
import Card from '@/components/ui/Card';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Users,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Plus,
  GraduationCap
} from 'lucide-react';

interface CourseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [stats, setStats] = useState<CourseStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setCourseId(resolvedParams.id);
      if (resolvedParams.id) {
        loadCourse(resolvedParams.id);
      }
    };
    loadParams();
  }, [params]);

  const loadCourse = async (id: string) => {
    try {
      setLoading(true);
      const [courseData, statsData] = await Promise.all([
        trainingService.getCourseById(id),
        trainingService.getCourseStats(id).catch(() => null)
      ]);
      setCourse(courseData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load course:', error);
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        if (courseId) {
          await trainingService.deleteCourse(courseId);
        }
        router.push('/training/courses');
      } catch (error) {
        console.error('Failed to delete course:', error);
        alert('Failed to delete course. Please try again.');
      }
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Not set';
    return formatToEthiopianDate(date, 'medium');
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (isActive: boolean) => {
    const colorClass = isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="animate-pulse h-8 w-8 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-8 w-64 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/training/courses')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Not Found</h1>
            <p className="text-gray-600 mt-1">{error || 'The requested course could not be found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/training/courses')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              {getStatusBadge(course.is_active)}
            </div>
            {course.description && (
              <p className="text-gray-600 mt-1">{course.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push(`/training/courses/${course.id}/edit`)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Edit Course"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            title="Delete Course"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Description */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600">
              {course.description || 'No description provided'}
            </p>
          </Card>


          {/* Trainers */}
          {course.trainers && course.trainers.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Assigned Trainers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.trainers.map((trainer) => (
                  <div key={trainer.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {trainer.name}
                      </p>
                      <p className="text-sm text-gray-600">{trainer.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          {stats && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Enrollments</span>
                  <span className="font-semibold text-gray-900">{stats.total_enrollments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">{stats.completed_enrollments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-semibold text-blue-600">{stats.in_progress_enrollments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">{stats.pending_enrollments}</span>
                </div>
                {/* <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-gray-900">{stats.completion_rate.toFixed(1)}%</span>
                </div> */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Progress</span>
                  <span className="font-semibold text-gray-900">{stats.average_progress.toFixed(1)}%</span>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/training/courses/${course.id}/assign-trainers`)}
                className="w-full flex items-center space-x-2 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Users className="h-4 w-4" />
                <span>Assign Trainers</span>
              </button>
              <button
                onClick={() => router.push(`/training/enrollments/new?courseId=${course.id}`)}
                className="w-full flex items-center space-x-2 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Enroll Trainee</span>
              </button>
              <button
                onClick={() => router.push(`/training/enrollments?courseId=${course.id}`)}
                className="w-full flex items-center space-x-2 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <GraduationCap className="h-4 w-4" />
                <span>View Enrollments</span>
              </button>
            </div>
          </Card>

          {/* Course Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="text-gray-900">{formatDate(course.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-900">{formatDate(course.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-gray-900 capitalize">{course.is_active ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active</span>
                <span className={`font-medium ${course.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {course.is_active ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


