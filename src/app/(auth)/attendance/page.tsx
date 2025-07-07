'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '@/services/attendanceService';
import { User, AttendanceFilters as AttendanceFiltersType } from '@/types/attendance';
import ManualAttendancePanel from '@/components/attendance/ManualAttendancePanel';
import AttendanceRecords from '@/components/attendance/AttendanceRecords';
import AttendanceFilters from '@/components/attendance/AttendanceFilters';
import LeaveManagement from '@/components/attendance/LeaveManagement';
import MonthlyReports from '@/components/attendance/MonthlyReports';
import BulkOperations from '@/components/attendance/BulkOperations';
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  FileText, 
  Settings, 
  Users, 
  TrendingUp,
  UserCheck,
  Database
} from 'lucide-react';

export default function AttendancePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'checkin' | 'records' | 'leaves' | 'reports' | 'bulk' | 'debug'>('records');
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
      label: 'Manual Check In/Out', 
      icon: UserCheck, 
      description: 'Manually record attendance',
      access: 'all'
    },
    { 
      id: 'leaves', 
      label: 'Leave Management', 
      icon: Calendar, 
      description: 'Leave Requests & Approvals',
      access: 'all'
    },
    { 
      id: 'reports', 
      label: 'Monthly Reports', 
      icon: TrendingUp, 
      description: 'Detailed Analytics',
      access: 'manager'
    },
    { 
      id: 'bulk', 
      label: 'Bulk Operations', 
      icon: Database, 
      description: 'Mass Updates & Imports',
      access: 'admin'
    },
    { 
      id: 'debug', 
      label: 'Debug Users', 
      icon: Settings, 
      description: 'API Testing',
      access: 'admin'
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
                    onClick={() => setActiveTab(tab.id as any)}
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
              <ManualAttendancePanel 
              onAttendanceUpdate={() => {}}
              // users={users} 
              // loading={loading} 
              // currentUser={currentUser}
              // isManager={isManager}
              />
            </div>
          )}

          {activeTab === 'records' && (
            <div className="space-y-6">
              <AttendanceFilters 
                onFiltersChange={handleFilterChange} 
                users={users}
                // loading={loading}
              />
              <AttendanceRecords filters={filters} onRecordUpdate={handleRecordUpdate} />
            </div>
          )}

          {activeTab === 'leaves' && (
            <LeaveManagement 
              currentUser={currentUser}
              isManager={isManager}
            />
          )}

          {activeTab === 'reports' && (isManager || isAdmin) && (
            <MonthlyReports 
              // currentUser={currentUser}
              // isManager={isManager}
            />
          )}

          {activeTab === 'bulk' && isAdmin && (
            <BulkOperations 
              // currentUser={currentUser}
              // isAdmin={isAdmin}
            />
          )}

          {activeTab === 'debug' && isAdmin && (
            <div className="space-y-6">
              {/* Debug Panel */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Debug: User API Testing</h2>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Admin Only</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Users Loaded:</span>
                    <span className="text-lg font-bold text-blue-600">{users.length}</span>
                  </div>
                  
                  <button
                    onClick={fetchUsers}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                    <Users className="h-4 w-4" />
                    <span>Refresh Users</span>
                  </button>
                </div>
              </div>

              {/* Users List */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Loaded Users</h3>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No users found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {users.map((user) => (
                        <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium text-sm">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {user.email}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                  {user.department}
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                  {user.position}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>Attendance Management System - Comprehensive Solution</p>
            <div className="flex justify-center items-center space-x-4 mt-2">
              <span className="flex items-center space-x-1">
                <UserCheck className="h-4 w-4" />
                <span>Check In/Out</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Leave Management</span>
              </span>
              <span className="flex items-center space-x-1">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </span>
              <span className="flex items-center space-x-1">
                <Database className="h-4 w-4" />
                <span>Bulk Operations</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 