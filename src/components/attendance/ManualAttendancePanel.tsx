'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '@/services/attendanceService';
import { AttendanceRecord, User } from '@/types/attendance';

import { userService } from '@/services/userService';

// SVG Icon Components
const EditIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

interface ManualAttendancePanelProps {
  onAttendanceUpdate: () => void;
}

export default function ManualAttendancePanel({ onAttendanceUpdate }: ManualAttendancePanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [userTodayAttendance, setUserTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [isFetchingAttendance, setIsFetchingAttendance] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const leaveTypes = ["Sick Leave", "Vacation", "Work from Home", "Holiday", "Maternity Leave", "Bereavement Leave"];
  const [leaveType, setLeaveType] = useState(leaveTypes[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserTodayAttendance = useCallback(async () => {
    if (!selectedUser) {
      setUserTodayAttendance(null);
      return;
    }

    try {
      setIsFetchingAttendance(true);
      const attendance = await attendanceService.getTodayAttendanceForUser(selectedUser);
      setUserTodayAttendance(attendance);
      setCheckInTime(attendance?.checkInTime ? new Date(attendance.checkInTime).toTimeString().substring(0, 5) : '');
      setCheckOutTime(attendance?.checkOutTime ? new Date(attendance.checkOutTime).toTimeString().substring(0, 5) : '');
    } catch (error) {
      console.error('Error fetching user\'s today attendance:', error);
      setUserTodayAttendance(null);
    } finally {
      setIsFetchingAttendance(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchUserTodayAttendance();
  }, [selectedUser, fetchUserTodayAttendance]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const userList = await userService.getAll();
      setUsers(userList);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to fetch users');
    }
  };

  const handleManualCheckIn = async () => {
    if (!selectedUser || !checkInTime) {
      alert('Please select a user and enter a check-in time.');
      return;
    }
    
    setIsProcessing(true);
    try {
      const checkInDateTime = `${selectedDate}T${checkInTime}:00`;
      
      // This is a simulated call. The service method needs a proper backend endpoint.
      await attendanceService.manualCheckIn(selectedUser, checkInDateTime);

      alert('User checked in successfully!');
      fetchUserTodayAttendance();
    } catch (error) {
      console.error('Manual check-in failed:', error);
      alert('Failed to check in user.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualCheckOut = async () => {
    if (!selectedUser || !userTodayAttendance || !checkOutTime) {
      alert('User must be checked in to check out.');
      return;
    }

    setIsProcessing(true);
    try {
      const checkOutDateTime = `${selectedDate}T${checkOutTime}:00`;

      // This is a simulated call. The service method needs a proper backend endpoint.
      await attendanceService.manualCheckOut(userTodayAttendance.id, checkOutDateTime);

      alert('User checked out successfully!');
      fetchUserTodayAttendance();
    } catch (error) {
      console.error('Manual check-out failed:', error);
      alert('Failed to check out user.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleLeaveSubmit = async () => {
    if (!selectedUser) {
      alert('Please select a user.');
      return;
    }

    setIsProcessing(true);
    try {
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);

      const status = leaveType === 'Holiday' ? 'holiday' : 'leave';

      const leaveData = {
        user_id: selectedUser,
        status: status,
        check_in: {
          timestamp: startDate.toISOString(),
          location: { latitude: 0, longitude: 0, address: "N/A" },
          notes: ""
        },
        check_out: {
          timestamp: endDate.toISOString(),
          location: { latitude: 0, longitude: 0, address: "N/A" },
          notes: ""
        },
        leave_type: leaveType,
        leave_reason: leaveReason
      };

      await attendanceService.submitLeaveRequest(leaveData);

      alert('Leave request submitted successfully!');
      fetchUserTodayAttendance();
      setLeaveReason('');
      setLeaveType(leaveTypes[0]);
    } catch (error) {
      console.error('Leave request failed:', error);
      alert('Failed to submit leave request.');
    } finally {
      setIsProcessing(false);
    }
  };

  const canCheckOut = userTodayAttendance && userTodayAttendance.checkInTime && !userTodayAttendance.checkOutTime;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await attendanceService.createManualEntry({
        user_id: selectedUser,
        date: selectedDate,
        time_in: checkInTime,
        time_out: checkOutTime,
        remarks: leaveReason
      });

      // Reset form
      setSelectedUser('');
      setCheckInTime('');
      setCheckOutTime('');
      setLeaveReason('');
      setLeaveType(leaveTypes[0]);
      
      onAttendanceUpdate();
    } catch (err) {
      console.error('Failed to create manual attendance:', err);
      setError('Failed to create manual attendance entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-2 mb-6">
        <EditIcon className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Manual Attendance Entry</h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select User *
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Choose a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName || user.firstName || user.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time In
            </label>
            <input
              type="time"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Out
            </label>
            <input
              type="time"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Remarks
          </label>
          <textarea
            value={leaveReason}
            onChange={(e) => setLeaveReason(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add any remarks or notes..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Mark as On Leave</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            disabled={!!userTodayAttendance}
          >
            {leaveTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setSelectedUser('');
              setCheckInTime('');
              setCheckOutTime('');
              setLeaveReason('');
              setLeaveType(leaveTypes[0]);
              setError(null);
            }}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={loading}
          >
            Clear
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Entry'}
          </button>
        </div>
      </form>
    </div>
  );
} 