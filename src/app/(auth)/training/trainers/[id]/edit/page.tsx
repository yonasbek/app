'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trainingService } from '@/services/trainingService';
import { Trainer, TrainerFormData } from '@/types/training';
import Card from '@/components/ui/Card';
import { ArrowLeft, Save, X } from 'lucide-react';

interface EditTrainerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditTrainerPage({ params }: EditTrainerPageProps) {
  const router = useRouter();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [trainerId, setTrainerId] = useState<string | null>(null);

  const [formData, setFormData] = useState<TrainerFormData>({
    name: '',
    email: '',
    phone: '',
    is_active: true
  });

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setTrainerId(resolvedParams.id);
      if (resolvedParams.id) {
        loadTrainer(resolvedParams.id);
      }
    };
    loadParams();
  }, [params]);

  const loadTrainer = async (id: string) => {
    try {
      setLoading(true);
      const trainerData = await trainingService.getTrainerById(id);
      setTrainer(trainerData);
      setFormData({
        name: trainerData.name,
        email: trainerData.email,
        phone: trainerData.phone || '',
        is_active: trainerData.is_active
      });
    } catch (error) {
      console.error('Failed to load trainer:', error);
      setError('Failed to load trainer data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof TrainerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      if (trainerId) {
        const updatedTrainer = await trainingService.updateTrainer(trainerId, formData);
        router.push(`/training/trainers/${updatedTrainer.id}`);
      }
    } catch (error) {
      console.error('Failed to update trainer:', error);
      setErrors({ general: 'Failed to update trainer. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="animate-pulse h-8 w-8 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-8 w-64 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
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
      <div className="flex items-center space-x-4">
        <button
          onClick={() => trainerId && router.push(`/training/trainers/${trainerId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Trainer</h1>
          <p className="text-gray-600 mt-1">Update trainer information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <span className="text-red-700">{errors.general}</span>
          </div>
        )}

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>




          </div>


          <div className="mt-6 flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Active trainer
            </label>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => trainerId && router.push(`/training/trainers/${trainerId}`)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}


