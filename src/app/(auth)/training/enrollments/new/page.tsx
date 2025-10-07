'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trainingService } from '@/services/trainingService';
import { Course, Trainee, EnrollmentFormData } from '@/types/training';
import Card from '@/components/ui/Card';
import { ArrowLeft, Save, X, User, BookOpen, Calendar, DollarSign } from 'lucide-react';

export default function NewEnrollmentPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<EnrollmentFormData>({
    course_id: '',
    trainee_id: '',
    attendance_required: false,
    total_sessions: 0,
    payment_required: false,
    amount_paid: undefined,
    payment_method: '',
    payment_reference: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, traineesData] = await Promise.all([
        trainingService.getAllCourses(),
        trainingService.getAllTrainees()
      ]);
      setCourses(coursesData);
      setTrainees(traineesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      setErrors({ general: 'Failed to load courses and trainees' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof EnrollmentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.course_id) {
      newErrors.course_id = 'Course is required';
    }

    if (!formData.trainee_id) {
      newErrors.trainee_id = 'Trainee is required';
    }

    if (formData.total_sessions < 0) {
      newErrors.total_sessions = 'Total sessions must be positive';
    }

    if (formData.amount_paid && formData.amount_paid < 0) {
      newErrors.amount_paid = 'Amount paid must be positive';
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
      const enrollment = await trainingService.enrollTrainee(formData);
      router.push(`/training/enrollments/${enrollment.id}`);
    } catch (error) {
      console.error('Failed to create enrollment:', error);
      setErrors({ general: 'Failed to create enrollment. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const selectedCourse = courses.find(c => c.id === formData.course_id);
  const selectedTrainee = trainees.find(t => t.id === formData.trainee_id);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push('/training/enrollments')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Enrollment</h1>
          <p className="text-gray-600 mt-1">Enroll a trainee in a course</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <span className="text-red-700">{errors.general}</span>
          </div>
        )}

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course *
              </label>
              <select
                value={formData.course_id}
                onChange={(e) => handleInputChange('course_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.course_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} ({course.code})
                  </option>
                ))}
              </select>
              {errors.course_id && <p className="text-red-500 text-sm mt-1">{errors.course_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trainee *
              </label>
              <select
                value={formData.trainee_id}
                onChange={(e) => handleInputChange('trainee_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.trainee_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a trainee</option>
                {trainees.map((trainee) => (
                  <option key={trainee.id} value={trainee.id}>
                    {trainee.first_name} {trainee.last_name} ({trainee.email})
                  </option>
                ))}
              </select>
              {errors.trainee_id && <p className="text-red-500 text-sm mt-1">{errors.trainee_id}</p>}
            </div>
          </div>

          {/* Course Details */}
          {selectedCourse && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Selected Course</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                  <span>{selectedCourse.title}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                  <span>{selectedCourse.duration_hours} hours</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
                  <span>{selectedCourse.price ? `$${selectedCourse.price}` : 'Free'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Trainee Details */}
          {selectedTrainee && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">Selected Trainee</h3>
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-green-600" />
                <span>{selectedTrainee.first_name} {selectedTrainee.last_name} - {selectedTrainee.email}</span>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Sessions
              </label>
              <input
                type="number"
                min="0"
                value={formData.total_sessions}
                onChange={(e) => handleInputChange('total_sessions', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.total_sessions ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.total_sessions && <p className="text-red-500 text-sm mt-1">{errors.total_sessions}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="attendance_required"
                checked={formData.attendance_required}
                onChange={(e) => handleInputChange('attendance_required', e.target.checked)}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="attendance_required" className="text-sm font-medium text-gray-700">
                Attendance required
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="payment_required"
                checked={formData.payment_required}
                onChange={(e) => handleInputChange('payment_required', e.target.checked)}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="payment_required" className="text-sm font-medium text-gray-700">
                Payment required
              </label>
            </div>
          </div>

          {formData.payment_required && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Paid
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount_paid || ''}
                  onChange={(e) => handleInputChange('amount_paid', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.amount_paid ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.amount_paid && <p className="text-red-500 text-sm mt-1">{errors.amount_paid}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <input
                  type="text"
                  value={formData.payment_method}
                  onChange={(e) => handleInputChange('payment_method', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Credit Card, Cash"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Reference
                </label>
                <input
                  type="text"
                  value={formData.payment_reference}
                  onChange={(e) => handleInputChange('payment_reference', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Transaction ID or reference"
                />
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Additional notes for this enrollment"
            />
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/training/enrollments')}
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
            <span>{saving ? 'Creating...' : 'Create Enrollment'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

