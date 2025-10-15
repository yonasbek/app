'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '@/services/attendanceService';
import { User, AttendanceFilters as AttendanceFiltersType } from '@/types/attendance';
import ManualAttendancePanel from '@/components/attendance/ManualAttendancePanel';
import AttendanceRecords from '@/components/attendance/AttendanceRecords';
import AttendanceFilters from '@/components/attendance/AttendanceFilters';
import LeaveManagement from '@/components/attendance/LeaveManagement';
import MonthlyReports from '@/components/attendance/MonthlyReports';
import Card from '@/components/ui/Card';
import {
  Calendar,
  FileText,
  TrendingUp,
  UserCheck,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function AttendancePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'checkin' | 'records' | 'leaves' | 'reports'>('records');
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [isManager, setIsManager] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filters, setFilters] = useState<AttendanceFiltersType>({});

  // Mock current user - in real app, this would come from auth context
  useEffect(() => {
    const mockCurrentUser: User = {
      id: 'current-user-1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Engineering',
      position: 'Senior Developer'
    };
    setCurrentUser(mockCurrentUser);
    setIsManager(true); // Mock manager role
    setIsAdmin(true); // Mock admin role
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const userList = await attendanceService.getAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = useCallback((newFilters: AttendanceFiltersType) => {
    setFilters(newFilters);
  }, []);

  const handleRecordUpdate = useCallback(() => {
    // This function will re-apply the filters, causing AttendanceRecords to re-fetch
    setFilters(prevFilters => ({ ...prevFilters }));
  }, []);

  const tabs = [
    {
      id: 'records',
      label: 'Attendance Records',
      icon: FileText,
      description: 'View and manage attendance',
      access: 'all'
    },
    {
      id: 'checkin',
      label: 'Check In/Out',
      icon: UserCheck,
      description: 'Record attendance and leave information',
      access: 'all'
    },
    {
      id: 'leaves',
      label: 'Leave Management',
      icon: Calendar,
      description: 'View all Leave Information',
      access: 'all'
    },
    {
      id: 'reports',
      label: 'Monthly Reports',
      icon: TrendingUp,
      description: 'Detailed Analytics',
      access: 'manager'
    }
  ];

  const getVisibleTabs = () => {
    return tabs.filter(tab => {
      if (tab.access === 'all') return true;
      if (tab.access === 'manager' && (isManager || isAdmin)) return true;
      if (tab.access === 'admin' && isAdmin) return true;
      return false;
    });
  };

  // Mock statistics - in real app, these would come from API
  const statistics = {
    totalEmployees: users.length,
    presentToday: Math.floor(users.length * 0.85),
    onLeave: Math.floor(users.length * 0.1),
    lateArrivals: Math.floor(users.length * 0.05)
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-app-foreground mb-2">Attendance Management</h1>
          <p className="text-app-foreground">Comprehensive attendance tracking and management system</p>
        </div>
        {/* {currentUser && (
          <Card padding="sm" className="mt-4 lg:mt-0">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-medium text-app-foreground">{currentUser.name}</p>
                <p className="text-sm text-app-foreground">{currentUser.position}</p>
              </div>
              <div className="flex flex-col space-y-1">
                {isAdmin && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">Admin</span>
                )}
                {isManager && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">Manager</span>
                )}
              </div>
            </div>
          </Card>
        )} */}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-app-foreground rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-app-foreground">{statistics.totalEmployees}</p>
              <p className="text-sm text-app-foreground">Total Employees</p>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-app-foreground rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-app-foreground">{statistics.presentToday}</p>
              <p className="text-sm text-app-foreground">Present Today</p>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-app-foreground rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-app-foreground">{statistics.onLeave}</p>
              <p className="text-sm text-app-foreground">On Leave</p>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-app-foreground rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-app-foreground">{statistics.lateArrivals}</p>
              <p className="text-sm text-app-foreground">Late Arrivals</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Card>
        <div className="border-b border-app-foreground -mb-px">
          <nav className="flex space-x-8 overflow-x-auto">
            {getVisibleTabs().map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'checkin' | 'records' | 'leaves' | 'reports')}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${activeTab === tab.id
                    ? 'border-app-foreground text-app-foreground'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Icon className={`mr-3 h-5 w-5 transition-colors duration-200 ${activeTab === tab.id ? 'text-app-foreground' : 'text-app-foreground group-hover:text-app-foreground'
                    }`} />
                  <div className="text-left">
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs text-app-foreground">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </Card>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'checkin' && (
          <div className="space-y-6">
            <ManualAttendancePanel users={users} loading={loading} />
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-6">
            <AttendanceFilters
              onFiltersChange={handleFilterChange}
              users={users}
            />
            <AttendanceRecords filters={filters} onRecordUpdate={handleRecordUpdate} />
          </div>
        )}

        {activeTab === 'leaves' && (
          <LeaveManagement />
        )}

        {activeTab === 'reports' && (isManager || isAdmin) && (
          <MonthlyReports />
        )}
      </div>
    </div>
  );
} 