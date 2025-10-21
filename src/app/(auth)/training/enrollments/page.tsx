'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trainingService } from '@/services/trainingService';
import { formatToEthiopianDate } from '@/utils/ethiopianDateUtils';
import {
  CourseEnrollment,
  EnrollmentFilters,
  EnrollmentStatus
} from '@/types/training';
import Card from '@/components/ui/Card';
import {
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  MoreVertical,
  User,
  BookOpen,
  TrendingUp
} from 'lucide-react';

export default function EnrollmentsPage() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<EnrollmentFilters>({
    search: '',
    status: undefined,
    course_id: undefined,
    trainee_id: undefined
  });

  useEffect(() => {
    loadEnrollments();
  }, [filters]);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const data = await trainingService.getAllEnrollments(filters);
      setEnrollments(data);
    } catch (error) {
      console.error('Failed to load enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadEnrollments();
  };

  const handleFilterChange = (key: keyof EnrollmentFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        await trainingService.deleteEnrollment(id);
        loadEnrollments();
      } catch (error) {
        console.error('Failed to delete enrollment:', error);
        alert('Failed to delete enrollment. Please try again.');
      }
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await trainingService.confirmEnrollment(id);
      loadEnrollments();
    } catch (error) {
      console.error('Failed to confirm enrollment:', error);
      alert('Failed to confirm enrollment. Please try again.');
    }
  };

  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this enrollment?')) {
      try {
        await trainingService.cancelEnrollment(id);
        loadEnrollments();
      } catch (error) {
        console.error('Failed to cancel enrollment:', error);
        alert('Failed to cancel enrollment. Please try again.');
      }
    }
  };

  const getStatusBadge = (status: EnrollmentStatus) => {
    const getColorClass = (status: EnrollmentStatus) => {
      switch (status) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'confirmed':
          return 'bg-blue-100 text-blue-800';
        case 'in_progress':
          return 'bg-green-100 text-green-800';
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        case 'failed':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    const getStatusLabel = (status: EnrollmentStatus) => {
      switch (status) {
        case 'pending':
          return 'Pending';
        case 'confirmed':
          return 'Confirmed';
        case 'in_progress':
          return 'In Progress';
        case 'completed':
          return 'Completed';
        case 'cancelled':
          return 'Cancelled';
        case 'failed':
          return 'Failed';
        default:
          return status;
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(status)}`}>
        {getStatusLabel(status)}
      </span>
    );
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Not set';
    return formatToEthiopianDate(date, 'medium');
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'Not paid';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Enrollments</h1>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-24 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enrollments</h1>
          <p className="text-gray-600 mt-1">Track course enrollments and progress</p>
        </div>
        <Link
          href="/training/enrollments/new"
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Enrollment</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search enrollments..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
                <input
                  type="text"
                  value={filters.course_id || ''}
                  onChange={(e) => handleFilterChange('course_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Filter by course ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trainee ID</label>
                <input
                  type="text"
                  value={filters.trainee_id || ''}
                  onChange={(e) => handleFilterChange('trainee_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Filter by trainee ID"
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Enrollments List */}
      {enrollments.length === 0 ? (
        <Card className="p-12 text-center">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollments found</h3>
          <p className="text-gray-600 mb-6">Get started by enrolling a trainee in a course.</p>
          <Link
            href="/training/enrollments/new"
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Enrollment</span>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-orange-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {enrollment.course?.title || 'Unknown Course'}
                        </h3>
                        {getStatusBadge(enrollment.status)}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{enrollment.trainee?.name}</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>{enrollment.course?.title || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Enrolled {formatDate(enrollment.enrolled_at)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Progress:</span>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-500 h-2 rounded-full"
                                style={{ width: `${enrollment.progress_percentage}%` }}
                              ></div>
                            </div>
                            <span className="font-medium">{enrollment.progress_percentage}%</span>
                          </div>
                        </div>

                        {enrollment.final_grade && (
                          <div>
                            <span className="text-gray-500">Grade:</span>
                            <span className="ml-1 font-medium">{enrollment.final_grade}%</span>
                          </div>
                        )}

                        <div>
                          <span className="text-gray-500">Attendance:</span>
                          <span className="ml-1 font-medium">
                            {enrollment.attendance_count || 0}/{enrollment.total_sessions}
                          </span>
                        </div>

                        {enrollment.amount_paid && (
                          <div>
                            <span className="text-gray-500">Paid:</span>
                            <span className="ml-1 font-medium">{formatCurrency(enrollment.amount_paid)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {enrollment.status === 'pending' && (
                    <button
                      onClick={() => handleConfirm(enrollment.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Confirm Enrollment"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}

                  {enrollment.status !== 'completed' && enrollment.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(enrollment.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Cancel Enrollment"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    onClick={() => router.push(`/training/enrollments/${enrollment.id}`)}
                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => router.push(`/training/enrollments/${enrollment.id}/edit`)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit Enrollment"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(enrollment.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete Enrollment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

