'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trainingService } from '@/services/trainingService';
import { Course, CourseFormData } from '@/types/training';
import CourseForm from '@/components/training/CourseForm';
import { ArrowLeft } from 'lucide-react';

interface EditCoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
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
      const courseData = await trainingService.getCourseById(id);
      setCourse(courseData);
    } catch (error) {
      console.error('Failed to load course:', error);
      setError('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (updatedCourse: Course) => {
    router.push(`/training/courses/${updatedCourse.id}`);
  };

  const handleCancel = () => {
    if (courseId) {
      router.push(`/training/courses/${courseId}`);
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

  const initialData: Partial<CourseFormData> = {
    title: course.title,
    description: course.description,
    is_active: course.is_active
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => courseId && router.push(`/training/courses/${courseId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
          <p className="text-gray-600 mt-1">Update course information</p>
        </div>
      </div>

      {/* Course Form */}
      {courseId && (
        <CourseForm
          courseId={courseId}
          initialData={initialData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

