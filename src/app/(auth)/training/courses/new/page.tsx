'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CourseForm from '@/components/training/CourseForm';
import { ArrowLeft } from 'lucide-react';

export default function NewCoursePage() {
  const router = useRouter();

  const handleSave = (course: any) => {
    router.push(`/training/courses/${course.id}`);
  };

  const handleCancel = () => {
    router.push('/training/courses');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push('/training/courses')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600 mt-1">Add a new training course to the system</p>
        </div>
      </div>

      {/* Course Form */}
      <CourseForm onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
}




