'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trainingService } from '@/services/trainingService';
import { Trainee, CourseEnrollment } from '@/types/training';
import Card from '@/components/ui/Card';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface TraineeDetailPageProps {
  params: {
    id: string;
  };
}

export default function TraineeDetailPage({ params }: TraineeDetailPageProps) {
  const router = useRouter();
  const [trainee, setTrainee] = useState<Trainee | null>(null);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadTrainee();
    }
  }, [params.id]);

  const loadTrainee = async () => {
    try {
      setLoading(true);
      const [traineeData, enrollmentsData] = await Promise.all([
        trainingService.getTraineeById(params.id),
        trainingService.getTraineeEnrollments(params.id).catch(() => [])
      ]);
      setTrainee(traineeData);
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error('Failed to load trainee:', error);
      setError('Failed to load trainee details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trainee?')) {
      try {
        await trainingService.deleteTrainee(params.id);
        router.push('/training/trainees');
      } catch (error) {
        console.error('Failed to delete trainee:', error);
        alert('Failed to delete trainee. Please try again.');
      }
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800'
    };

    const colorClass = statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'cancelled':
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
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

  if (error || !trainee) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/training/trainees')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trainee Not Found</h1>
            <p className="text-gray-600 mt-1">{error || 'The requested trainee could not be found'}</p>
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
            onClick={() => router.push('/training/trainees')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {trainee.first_name} {trainee.last_name}
            </h1>
            <p className="text-gray-600 mt-1">{trainee.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push(`/training/trainees/${trainee.id}/edit`)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Edit Trainee"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            title="Delete Trainee"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{trainee.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900">{trainee.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-gray-900">{trainee.location || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                    <p className="text-gray-900">{formatDate(trainee.date_of_birth)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Award className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Education Level</p>
                    <p className="text-gray-900">{trainee.education_level || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Company</p>
                    <p className="text-gray-900">{trainee.company || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Course Enrollments */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Enrollments</h2>
            {enrollments.length > 0 ? (
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {enrollment.course?.title || 'Course Title'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {enrollment.course?.code || 'Course Code'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(enrollment.status)}
                        {getStatusBadge(enrollment.status)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Enrolled:</span>
                        <span className="ml-2 text-gray-900">
                          {formatDate(enrollment.enrolled_at)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Progress:</span>
                        <span className="ml-2 text-gray-900">
                          {enrollment.progress_percentage || 0}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Sessions:</span>
                        <span className="ml-2 text-gray-900">
                          {enrollment.total_sessions || 0}
                        </span>
                      </div>
                    </div>

                    {enrollment.final_grade && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Final Grade:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {enrollment.final_grade}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No course enrollments found</p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/training/trainees/${trainee.id}/edit`)}
                className="w-full flex items-center space-x-2 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Trainee</span>
              </button>
              <button
                onClick={() => router.push(`/training/enrollments/new?traineeId=${trainee.id}`)}
                className="w-full flex items-center space-x-2 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <BookOpen className="h-4 w-4" />
                <span>Enroll in Course</span>
              </button>
            </div>
          </Card>

          {/* Trainee Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trainee Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="text-gray-900">{formatDate(trainee.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-900">{formatDate(trainee.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`font-medium ${trainee.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {trainee.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Enrollments</span>
                <span className="text-gray-900">{enrollments.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

