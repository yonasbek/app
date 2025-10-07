'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { trainingService } from '@/services/trainingService';
import Card from '@/components/ui/Card';
import {
  BookOpen,
  Users,
  UserCheck,
  GraduationCap,
  Plus,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Calendar,
  DollarSign,
  Award
} from 'lucide-react';

interface TrainingStats {
  courses: {
    total: number;
    active: number;
    completed: number;
  };
  trainers: {
    total: number;
    active: number;
  };
  trainees: {
    total: number;
    active: number;
  };
  enrollments: {
    total: number;
    completed: number;
    in_progress: number;
  };
}

export default function TrainingPage() {
  const [stats, setStats] = useState<TrainingStats>({
    courses: { total: 0, active: 0, completed: 0 },
    trainers: { total: 0, active: 0 },
    trainees: { total: 0, active: 0 },
    enrollments: { total: 0, completed: 0, in_progress: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [courses, trainers, trainees, enrollments] = await Promise.all([
        trainingService.getAllCourses(),
        trainingService.getAllTrainers(),
        trainingService.getAllTrainees(),
        trainingService.getAllEnrollments()
      ]);

      setStats({
        courses: {
          total: courses.length,
          active: courses.filter(c => c.status === 'in_progress').length,
          completed: courses.filter(c => c.status === 'completed').length
        },
        trainers: {
          total: trainers.length,
          active: trainers.filter(t => t.status === 'active').length
        },
        trainees: {
          total: trainees.length,
          active: trainees.filter(t => t.status === 'active').length
        },
        enrollments: {
          total: enrollments.length,
          completed: enrollments.filter(e => e.status === 'completed').length,
          in_progress: enrollments.filter(e => e.status === 'in_progress').length
        }
      });
    } catch (error) {
      console.error('Failed to load training stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const trainingModules = [
    {
      title: 'Courses',
      description: 'Manage training courses, curriculum, and schedules',
      icon: BookOpen,
      href: '/training/courses',
      color: 'from-blue-500 to-blue-600',
      stats: { value: stats.courses.total.toString(), label: 'Total Courses' }
    },
    {
      title: 'Trainers',
      description: 'Manage instructors and training staff',
      icon: Users,
      href: '/training/trainers',
      color: 'from-green-500 to-green-600',
      stats: { value: stats.trainers.total.toString(), label: 'Active Trainers' }
    },
    {
      title: 'Trainees',
      description: 'Manage students and course participants',
      icon: UserCheck,
      href: '/training/trainees',
      color: 'from-purple-500 to-purple-600',
      stats: { value: stats.trainees.total.toString(), label: 'Registered Trainees' }
    },
    {
      title: 'Enrollments',
      description: 'Track course enrollments and progress',
      icon: GraduationCap,
      href: '/training/enrollments',
      color: 'from-orange-500 to-orange-600',
      stats: { value: stats.enrollments.total.toString(), label: 'Total Enrollments' }
    }
  ];

  const quickActions = [
    {
      title: 'Create Course',
      description: 'Add a new training course',
      icon: Plus,
      href: '/training/courses/new',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Add Trainer',
      description: 'Register a new instructor',
      icon: Users,
      href: '/training/trainers/new',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Register Trainee',
      description: 'Add a new student',
      icon: UserCheck,
      href: '/training/trainees/new',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Enroll Student',
      description: 'Enroll trainee in course',
      icon: GraduationCap,
      href: '/training/enrollments/new',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Training Management</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Training Management</h1>
          <p className="text-gray-600 mt-1">Manage courses, trainers, trainees, and enrollments</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.courses.total}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            {stats.courses.completed} completed
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Trainers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.trainers.active}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 text-gray-400 mr-1" />
            {stats.trainers.total} total
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Trainees</p>
              <p className="text-2xl font-bold text-gray-900">{stats.trainees.active}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <UserCheck className="h-4 w-4 text-gray-400 mr-1" />
            {stats.trainees.total} total
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <GraduationCap className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.enrollments.total}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            {stats.enrollments.in_progress} in progress
          </div>
        </Card>
      </div>

      {/* Training Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trainingModules.map((module, index) => (
          <Link key={index} href={module.href}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${module.color}`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                    <p className="text-gray-600 mt-1">{module.description}</p>
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <span className="font-medium">{module.stats.value}</span>
                      <span className="ml-1">{module.stats.label}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New course "Advanced JavaScript" created</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">5 new trainees registered</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <GraduationCap className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">12 students completed "React Fundamentals"</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


