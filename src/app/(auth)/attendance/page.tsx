'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '@/services/attendanceService';
import { User, AttendanceFilters as AttendanceFiltersType } from '@/types/attendance';
import ManualAttendancePanel from '@/components/attendance/ManualAttendancePanel';
import AttendanceRecords from '@/components/attendance/AttendanceRecords';
import AttendanceFilters from '@/components/attendance/AttendanceFilters';
import LeaveManagement from '@/components/attendance/LeaveManagement';
import MonthlyReports from '@/components/attendance/MonthlyReports';
import { 
  Calendar, 
  FileText, 
  TrendingUp,
  UserCheck
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Attendance Management System</h1>
              <p className="text-gray-600 mt-1">Comprehensive attendance tracking and management</p>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.position}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {isAdmin && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Admin</span>
                    )}
                    {isManager && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Manager</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {getVisibleTabs().map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'checkin' | 'records' | 'leaves' | 'reports')}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`mr-2 h-5 w-5 ${
                      activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    <div className="text-left">
                      <div>{tab.label}</div>
                      <div className="text-xs text-gray-400">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

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
    </div>
  );
} 