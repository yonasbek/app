'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trainingService } from '@/services/trainingService';
import { Trainer } from '@/types/training';
import Card from '@/components/ui/Card';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  BookOpen,
  Award,
  Users,
  Star
} from 'lucide-react';

interface TrainerDetailPageProps {
  params: {
    id: string;
  };
}

export default function TrainerDetailPage({ params }: TrainerDetailPageProps) {
  const router = useRouter();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadTrainer();
    }
  }, [params.id]);

  const loadTrainer = async () => {
    try {
      setLoading(true);
      const trainerData = await trainingService.getTrainerById(params.id);
      setTrainer(trainerData);
    } catch (error) {
      console.error('Failed to load trainer:', error);
      setError('Failed to load trainer details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await trainingService.deleteTrainer(params.id);
        router.push('/training/trainers');
      } catch (error) {
        console.error('Failed to delete trainer:', error);
        alert('Failed to delete trainer. Please try again.');
      }
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getSpecializationBadges = (specializations: string[]) => {
    if (!specializations || specializations.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2">
        {specializations.map((spec, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {spec}
          </span>
        ))}
      </div>
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

  if (error || !trainer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/training/trainers')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trainer Not Found</h1>
            <p className="text-gray-600 mt-1">{error || 'The requested trainer could not be found'}</p>
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
            onClick={() => router.push('/training/trainers')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {trainer.name}
            </h1>
            <p className="text-gray-600 mt-1">{trainer.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push(`/training/trainers/${trainer.id}/edit`)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Edit Trainer"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            title="Delete Trainer"
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
                    <p className="text-gray-900">{trainer.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900">{trainer.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-gray-900">{trainer.location || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hourly Rate</p>
                    <p className="text-gray-900">{formatCurrency(trainer.hourly_rate)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Award className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Experience (Years)</p>
                    <p className="text-gray-900">{trainer.experience_years || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Star className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rating</p>
                    <p className="text-gray-900">{trainer.rating || 'Not rated'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Specializations */}
          {trainer.specializations && trainer.specializations.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Specializations</h2>
              {getSpecializationBadges(trainer.specializations)}
            </Card>
          )}

          {/* Bio */}
          {trainer.bio && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Biography</h2>
              <p className="text-gray-600 whitespace-pre-line">{trainer.bio}</p>
            </Card>
          )}

          {/* Assigned Courses */}
          {trainer.courses && trainer.courses.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Assigned Courses</h2>
              <div className="space-y-3">
                {trainer.courses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{course.title}</p>
                      {course.description && (
                        <p className="text-sm text-gray-600 line-clamp-1">{course.description}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {course.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/training/trainers/${trainer.id}/edit`)}
                className="w-full flex items-center space-x-2 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Trainer</span>
              </button>
              <button
                onClick={() => router.push(`/training/courses?trainerId=${trainer.id}`)}
                className="w-full flex items-center space-x-2 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <BookOpen className="h-4 w-4" />
                <span>View Assigned Courses</span>
              </button>
            </div>
          </Card>

          {/* Trainer Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trainer Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="text-gray-900">{formatDate(trainer.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-900">{formatDate(trainer.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`font-medium ${trainer.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {trainer.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Courses Assigned</span>
                <span className="text-gray-900">{trainer.courses?.length || 0}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

