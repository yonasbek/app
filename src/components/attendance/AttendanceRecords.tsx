'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AttendanceRecord, User } from '@/types/attendance';
import { attendanceService } from '@/services/attendanceService';

interface AttendanceRecordsProps {
  onRecordUpdate: () => void;
  filters: Record<string, unknown>;
}

export default function AttendanceRecords({ onRecordUpdate, filters }: AttendanceRecordsProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const fetchedRecords = await attendanceService.getAttendanceRecords(filters);
        setRecords(fetchedRecords);
      } catch (error) {
        console.error('Failed to fetch attendance records:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [filters]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const getStatusBadge = (status: string, leaveType?: string) => {
    // For leave statuses, show the specific leave type if available
    if ((status === 'leave' || status === 'on_leave' || status === 'holiday') && leaveType) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
          {leaveType}
        </span>
      );
    }

    const statusConfig = {
      present: { color: 'bg-green-100 text-green-800', label: 'Present' },
      absent: { color: 'bg-red-100 text-red-800', label: 'Absent' },
      late: { color: 'bg-yellow-100 text-yellow-800', label: 'Late' },
      early_departure: { color: 'bg-orange-100 text-orange-800', label: 'Early Departure' },
      on_leave: { color: 'bg-purple-100 text-purple-800', label: 'On Leave' },
      leave: { color: 'bg-purple-100 text-purple-800', label: 'Leave' },
      holiday: { color: 'bg-purple-100 text-purple-800', label: 'Holiday' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { color: 'bg-gray-100 text-gray-800', label: status };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getUserInitials = (user: User | undefined) => {
    if (!user) return 'U';
    
    if (!user.name || user.name.trim() === '') {
      return user.email ? user.email.charAt(0).toUpperCase() : 'U';
    }
    
    return user.name
      .split(' ')
      .filter((n: string) => n.length > 0)
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2); // Limit to 2 characters max
  };

  const getUserDisplayName = (user: User | undefined) => {
    if (!user) return 'Unknown User';
    return user.name || user.email || 'Unknown User';
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return;

    try {
      await attendanceService.deleteAttendance(recordId);
      onRecordUpdate();
    } catch (error) {
      console.error('Failed to delete record:', error);
      alert('Failed to delete record. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to see more results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h3 className="text-lg font-semibold text-gray-900">
          Attendance Records ({records ? records.length : 0} records)
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records && records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">
                          {getUserInitials(record.user)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        <Link 
                          href={`/attendance/user/${record.userId}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {getUserDisplayName(record.user)}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.user?.department || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
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
                  {getStatusBadge(record.status, record.leaveType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs">
                  <div className="truncate">
                    {record.notes || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteRecord(record.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 