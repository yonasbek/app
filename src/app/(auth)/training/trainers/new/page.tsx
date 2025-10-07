'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trainingService } from '@/services/trainingService';
import { TrainerFormData, Course } from '@/types/training';
import Card from '@/components/ui/Card';
import { ArrowLeft, Save, X, BookOpen } from 'lucide-react';

export default function NewTrainerPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  const [formData, setFormData] = useState<TrainerFormData>({
    name: '',
    phone: '',
    email: '',
    is_active: true
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await trainingService.getAllCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error('Failed to load courses:', error);
      setErrors({ general: 'Failed to load courses' });
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

  const handleCourseSelection = (courseId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCourseIds(prev => [...prev, courseId]);
    } else {
      setSelectedCourseIds(prev => prev.filter(id => id !== courseId));
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
      const trainer = await trainingService.createTrainer(formData);
      
      // Assign courses to the trainer if any are selected
      if (selectedCourseIds.length > 0) {
        for (const courseId of selectedCourseIds) {
          await trainingService.assignTrainersToCourse(courseId, [trainer.id]);
        }
      }
      
      router.push(`/training/trainers/${trainer.id}`);
    } catch (error) {
      console.error('Failed to create trainer:', error);
      setErrors({ general: 'Failed to create trainer. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push('/training/trainers')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Trainer</h1>
          <p className="text-gray-600 mt-1">Add a new trainer to the system</p>
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
                placeholder="Enter trainer name"
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

        {/* Course Assignment */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Assign Courses</h2>
          <p className="text-sm text-gray-600 mb-4">
            Select the courses this trainer will be assigned to. You can also assign courses later from the trainer's detail page.
          </p>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="text-gray-500">Loading courses...</div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-4">
              <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No courses available</p>
              <p className="text-sm text-gray-400">Create courses first to assign them to trainers</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCourseIds.includes(course.id)
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCourseSelection(course.id, !selectedCourseIds.includes(course.id))}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedCourseIds.includes(course.id)}
                      onChange={() => {}} // Handled by parent div click
                      className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {course.description}
                        </p>
                      )}
                      <div className="flex items-center mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          course.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {course.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {selectedCourseIds.length > 0 && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>{selectedCourseIds.length}</strong> course{selectedCourseIds.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/training/trainers')}
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
            <span>{saving ? 'Creating...' : 'Create Trainer'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
