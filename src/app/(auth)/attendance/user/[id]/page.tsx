'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { attendanceService } from '@/services/attendanceService';
import { User, AttendanceRecord, AttendanceStats } from '@/types/attendance';
import EthiopianDatePicker from '@/components/ui/ethiopian-date-picker';
import { formatToEthiopianDate, formatToEthiopianDateTime } from '@/utils/ethiopianDateUtils';

export default function UserAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId, dateRange]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Get all users to find the current user
      const users = await attendanceService.getAllUsers();
      const currentUser = users.find(u => u.id === userId);
      setUser(currentUser || null);

      // Get attendance records for this user
      const records = await attendanceService.getAttendanceRecords({
        userId,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      setAttendanceRecords(records);

      // Get attendance statistics
      const userStats = await attendanceService.getAttendanceStats(
        {
          userId,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }
      );
      setStats(userStats);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return formatToEthiopianDate(dateString, 'medium');
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateWorkHours = (checkIn: string, checkOut?: string) => {
    if (!checkOut) return 'N/A';

    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    const hours = diffMs / (1000 * 60 * 60);

    return `${hours.toFixed(1)}h`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-900">User not found</h2>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.department} • {user.email}</p>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <EthiopianDatePicker
              label=""
              value={dateRange.startDate ? new Date(dateRange.startDate) : null}
              onChange={(selectedDate: Date) => {
                // Adjust for timezone offset to ensure correct local date
                const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
                setDateRange(prev => ({
                  ...prev,
                  startDate: localDate.toISOString().split('T')[0],
                }));
              }}
              disableFuture
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <EthiopianDatePicker
              label=""
              value={dateRange.endDate ? new Date(dateRange.endDate) : null}
              onChange={(selectedDate: Date) => {
                // Adjust for timezone offset to ensure correct local date
                const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
                setDateRange(prev => ({
                  ...prev,
                  endDate: localDate.toISOString().split('T')[0],
                }));
              }}
              required
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Days</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalDays}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Present Days</div>
            <div className="text-2xl font-bold text-green-600">{stats.presentDays}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Absent Days</div>
            <div className="text-2xl font-bold text-red-600">{stats.absentDays}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Average Work Hours</div>
            <div className="text-2xl font-bold text-blue-600">{stats.averageWorkHours.toFixed(1)}h</div>
          </div>
        </div>
      )}

      {/* Attendance Records */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Attendance History ({attendanceRecords.length} records)
          </h3>
        </div>

        {attendanceRecords.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No attendance records found for the selected date range.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(record.checkInTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.checkOutTime ? formatTime(record.checkOutTime) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {calculateWorkHours(record.checkInTime, record.checkOutTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${record.status === 'present' ? 'bg-green-100 text-green-800' :
                        record.status === 'absent' ? 'bg-red-100 text-red-800' :
                          record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            (record.status === 'on_leave' || record.status === 'leave' || record.status === 'holiday') ? 'bg-purple-100 text-purple-800' :
                              'bg-orange-100 text-orange-800'
                        }`}>
                        {(record.status === 'on_leave' || record.status === 'leave' || record.status === 'holiday') && record.leaveType ? record.leaveType : record.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 