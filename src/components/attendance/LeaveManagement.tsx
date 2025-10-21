'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '@/services/attendanceService';
import { User, AttendanceRecord } from '@/types/attendance';
import { formatToEthiopianDate } from '@/utils/ethiopianDateUtils';
import {
  Calendar,
  User as UserIcon,
  FileText,
  CalendarDays,
  Clock
} from 'lucide-react';
import { EthiopianDatePicker } from '../ui/ethiopian-date-picker';

interface LeaveManagementProps {
  currentUser?: User;
  isManager?: boolean;
}

export default function LeaveManagement({ currentUser, isManager = false }: LeaveManagementProps) {
  const [allLeaveRecords, setAllLeaveRecords] = useState<AttendanceRecord[]>([]);
  const [filteredLeaveRecords, setFilteredLeaveRecords] = useState<AttendanceRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    leaveType: '' as string,
    startDate: '',
    endDate: '',
    userId: '' as string
  });

  const fetchLeaveRecords = useCallback(async () => {
    try {
      setLoading(true);
      const requestFilters = {
        userId: filters.userId || (isManager ? undefined : currentUser?.id),
        status: 'leave', // Only get records with leave status
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      };
      const records = await attendanceService.getAttendanceRecords(requestFilters);
      // Filter for only leave status records
      const leaveRecords = records.filter(record => record.status === 'leave');
      setAllLeaveRecords(leaveRecords);
    } catch (error) {
      console.error('Error fetching leave records:', error);
      setAllLeaveRecords([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, isManager, filters.userId, filters.startDate, filters.endDate]);

  // Apply client-side filtering
  useEffect(() => {
    let filtered = [...allLeaveRecords];

    // Filter by leave type if selected
    if (filters.leaveType) {
      filtered = filtered.filter(record =>
        record.leaveType === filters.leaveType
      );
    }

    // Additional date filtering if needed (in case API doesn't handle it perfectly)
    if (filters.startDate) {
      filtered = filtered.filter(record =>
        new Date(record.date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(record =>
        new Date(record.date) <= new Date(filters.endDate)
      );
    }

    setFilteredLeaveRecords(filtered);
  }, [allLeaveRecords, filters.leaveType, filters.startDate, filters.endDate]);

  const fetchUsers = useCallback(async () => {
    if (!isManager) return;

    try {
      const userList = await attendanceService.getAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [isManager]);

  useEffect(() => {
    fetchLeaveRecords();
    fetchUsers();
  }, [fetchLeaveRecords, fetchUsers]);

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'Sick Leave': return 'bg-red-100 text-red-800';
      case 'Vacation': return 'bg-blue-100 text-blue-800';
      case 'Work from Home': return 'bg-green-100 text-green-800';
      case 'Holiday': return 'bg-purple-100 text-purple-800';
      case 'Maternity Leave': return 'bg-pink-100 text-pink-800';
      case 'Bereavement Leave': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return formatToEthiopianDate(dateString, 'long');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Calendar className="h-6 w-6 mr-2" />
          Leave Records
        </h1>
        <div className="text-sm text-gray-500">
          Showing all attendance records with leave status
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {isManager && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
              <select
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
            <select
              value={filters.leaveType}
              onChange={(e) => handleFilterChange('leaveType', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Vacation">Vacation</option>
              <option value="Work from Home">Work from Home</option>
              <option value="Holiday">Holiday</option>
              <option value="Maternity Leave">Maternity Leave</option>
              <option value="Bereavement Leave">Bereavement Leave</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <EthiopianDatePicker
              label=""
              value={filters.startDate ? new Date(filters.startDate) : null}
              onChange={(selectedDate: Date) => {
                // Adjust for timezone offset to ensure correct local date
                const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
                handleFilterChange('startDate', localDate.toISOString().split('T')[0]);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <EthiopianDatePicker
              label=""
              value={filters.endDate ? new Date(filters.endDate) : null}
              onChange={(selectedDate: Date) => {
                // Adjust for timezone offset to ensure correct local date
                const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
                handleFilterChange('endDate', localDate.toISOString().split('T')[0]);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Leave Records List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading leave records...</span>
          </div>
        ) : filteredLeaveRecords.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CalendarDays className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leave records found</h3>
            <p className="text-gray-500">
              {allLeaveRecords.length === 0
                ? 'No attendance records with leave status match your criteria.'
                : 'No leave records match your current filters. Try adjusting your search criteria.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLeaveRecords.map((record) => (
              <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    {/* User Info and Leave Type */}
                    <div className="flex items-center space-x-3">
                      {isManager && (
                        <>
                          <UserIcon className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {record.user?.name || users.find(u => u.id === record.userId)?.name || 'Unknown User'}
                          </span>
                        </>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(record.leaveType || 'Sick Leave')}`}>
                        {record.leaveType || 'Leave'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        On Leave
                      </span>
                    </div>

                    {/* Date and Time Information */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {formatDate(record.date)}
                        </span>
                      </div>

                      {(record.checkInTime || record.checkOutTime) && (
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div className="flex space-x-4">
                            {record.checkInTime && (
                              <span>Check-in: {formatTime(record.checkInTime)}</span>
                            )}
                            {record.checkOutTime && (
                              <span>Check-out: {formatTime(record.checkOutTime)}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Leave Reason */}
                    {record.leaveReason && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Reason:</p>
                            <p className="text-sm text-gray-600 mt-1">{record.leaveReason}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Notes */}
                    {record.notes && record.notes !== record.leaveReason && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <FileText className="h-4 w-4 text-blue-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-700">Notes:</p>
                            <p className="text-sm text-blue-600 mt-1">{record.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Work Hours and Status Info */}
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Work Hours: {record.workHours || 0}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>Status: {record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {!loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">
                {filteredLeaveRecords.length === allLeaveRecords.length ? (
                  <>Showing {filteredLeaveRecords.length} leave record{filteredLeaveRecords.length !== 1 ? 's' : ''}</>
                ) : (
                  <>Showing {filteredLeaveRecords.length} of {allLeaveRecords.length} leave record{allLeaveRecords.length !== 1 ? 's' : ''}</>
                )}
              </p>
              <p className="text-blue-600">
                All records displayed have a status of &quot;leave&quot; in the attendance system.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 