'use client';

import Link from 'next/link';
import {
  Calendar,
  Users,
  BookOpen,
  FileText,
  Clock,
  MapPin,
  Phone,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Plus,
  ArrowRight,
  Activity,
  Building,
  Book
} from 'lucide-react';
import Card from '@/components/ui/Card';

const modules = [
  {
    title: 'Employee Management',
    description: 'Manage staff information, departments, and organizational structure',
    icon: Users,
    href: '/users',
    color: 'from-app-primary to-app-primary-light',
    stats: { value: '142', label: 'Active Employees' }
  },
  {
    title: 'Memos & Proposals',
    description: 'Create, review, and manage organizational communications',
    icon: FileText,
    href: '/memos',
    color: 'from-app-primary-light to-app-primary',
    stats: { value: '23', label: 'Pending Reviews' }
  },
  {
    title: 'Annual Planning',
    description: 'Strategic planning and goal tracking for various departments',
    icon: Calendar,
    href: '/plans',
    color: 'from-green-500 to-emerald-500',
    stats: { value: '8', label: 'Active Plans' }
  },
  {
    title: 'Room & Booking',
    description: 'Manage conference rooms and resource reservations',
    icon: Building,
    href: '/rooms',
    color: 'from-orange-500 to-red-500',
    stats: { value: '12', label: 'Available Rooms' }
  },
  {
    title: 'Attendance System',
    description: 'Track employee attendance and generate reports',
    icon: Clock,
    href: '/attendance',
    color: 'from-app-primary to-app-primary-light',
    stats: { value: '94%', label: 'Attendance Rate' }
  },
  {
    title: 'Knowledge Base',
    description: 'Document management and knowledge sharing platform',
    icon: Book,
    href: '/knowledge-base',
    color: 'from-app-accent to-app-secondary',
    stats: { value: '156', label: 'Documents' }
  }
];

const stats = [
  {
    label: 'Active Employees',
    value: '142',
    trend: 'up',
    change: '+5',
    color: 'text-green-600',
    icon: Users
  },
  {
    label: 'Pending Reviews',
    value: '23',
    trend: 'up',
    change: '+12',
    color: 'text-app-primary',
    icon: FileText
  },
  {
    label: 'Room Bookings',
    value: '38',
    trend: 'down',
    change: '-3',
    color: 'text-app-primary-light',
    icon: Building
  },
  {
    label: 'Reports Generated',
    value: '156',
    trend: 'up',
    change: '+8',
    color: 'text-orange-600',
    icon: BarChart3
  }
];

const recentActivity = [
  { id: 1, description: 'New task assigned in Annual Plans', time: '2 min ago' },
  { id: 2, description: 'Meeting room booked for tomorrow', time: '15 min ago' },
  { id: 3, description: 'Memo approved by management', time: '1 hour ago' },
  { id: 4, description: 'Weekly attendance report generated', time: '2 hours ago' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-app-foreground mb-2">Dashboard</h1>
        <p className="text-neutral-600">Welcome to MSLeo Management System</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <div className={`w-12 h-12 rounded-lg bg-app-accent flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-app-foreground" />
                  </div>
                  <span className={`text-sm font-medium flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-app-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-neutral-600">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Access Modules */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-app-foreground">Quick Access</h2>
            <button className="text-app-primary hover:text-app-primary-light text-sm font-medium flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Card key={index} className="group card-hover cursor-pointer relative overflow-hidden">
                  <Link href={module.href}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-app-foreground">{module.stats.value}</p>
                          <p className="text-xs text-neutral-500">{module.stats.label}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-app-foreground mb-2 group-hover:text-app-primary transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          {module.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center text-app-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Access Module</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-app-foreground">Recent Activity</h2>
              <button className="text-app-primary hover:text-app-primary-light text-sm font-medium">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-app-accent transition-colors">
                  <div className="w-8 h-8 bg-app-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-app-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-app-foreground leading-tight">
                      {activity.description}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-app-secondary">
              <Link
                href="/reports"
                className="flex items-center justify-between text-app-primary hover:text-app-primary-light text-sm font-medium"
              >
                <span>View Activity Report</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="font-semibold text-app-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: 'Create New Memo', href: '/memos/create' },
                { label: 'Book a Room', href: '/rooms/book' },
                { label: 'View Reports', href: '/reports' },
                { label: 'Manage Users', href: '/users' }
              ].map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-app-accent transition-colors group"
                >
                  <span className="text-sm font-medium text-neutral-700 group-hover:text-app-foreground">
                    {action.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 