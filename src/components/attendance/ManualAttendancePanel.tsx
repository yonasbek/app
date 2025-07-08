'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '@/services/attendanceService';
import { AttendanceRecord, User } from '@/types/attendance';
import { Edit, Clock, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

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
  const [userDateAttendance, setUserDateAttendance] = useState<AttendanceRecord | null>(null);
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

  const fetchUserDateAttendance = useCallback(async () => {
    if (!selectedUser || !selectedDate) {
      setUserDateAttendance(null);
      setCheckInTime('');
      setCheckOutTime('');
      return;
    }

    try {
      setIsFetchingAttendance(true);
      
      // Get attendance records for the selected user and date
      const records = await attendanceService.getAttendanceRecords({
        userId: selectedUser,
        startDate: selectedDate,
        endDate: selectedDate
      });
      
      const attendance = records.length > 0 ? records[0] : null;
      setUserDateAttendance(attendance);
      
      // Pre-populate times if attendance exists
      if (attendance) {
        setCheckInTime(attendance.checkInTime ? new Date(attendance.checkInTime).toTimeString().substring(0, 5) : '');
        setCheckOutTime(attendance.checkOutTime ? new Date(attendance.checkOutTime).toTimeString().substring(0, 5) : '');
      } else {
        setCheckInTime('');
        setCheckOutTime('');
      }
    } catch (error) {
      console.error('Error fetching user\'s attendance for date:', error);
      setUserDateAttendance(null);
      setCheckInTime('');
      setCheckOutTime('');
    } finally {
      setIsFetchingAttendance(false);
    }
  }, [selectedUser, selectedDate]);

  useEffect(() => {
    fetchUserDateAttendance();
  }, [selectedUser, selectedDate, fetchUserDateAttendance]);

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
      await attendanceService.manualCheckIn(selectedUser, checkInDateTime);
      alert('User checked in successfully!');
      fetchUserDateAttendance();
    } catch (error) {
      console.error('Manual check-in failed:', error);
      alert('Failed to check in user.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualCheckOut = async () => {
    if (!selectedUser || !userDateAttendance || !checkOutTime) {
      alert('User must be checked in to check out.');
      return;
    }

    setIsProcessing(true);
    try {
      const checkOutDateTime = `${selectedDate}T${checkOutTime}:00`;
      await attendanceService.manualCheckOut(userDateAttendance.id, checkOutDateTime);
      alert('User checked out successfully!');
      fetchUserDateAttendance();
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
      fetchUserDateAttendance();
      setLeaveReason('');
      setLeaveType(leaveTypes[0]);
    } catch (error) {
      console.error('Leave request failed:', error);
      alert('Failed to submit leave request.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to get attendance status info
  const getAttendanceStatusInfo = () => {
    if (!userDateAttendance) return null;
    
    const isOnLeave = userDateAttendance.status === 'on_leave' || userDateAttendance.status === 'leave' || userDateAttendance.status === 'holiday';
    const isPresent = userDateAttendance.status === 'present';
    const hasCheckedIn = userDateAttendance.checkInTime;
    const hasCheckedOut = userDateAttendance.checkOutTime;
    
    return {
      isOnLeave,
      isPresent,
      hasCheckedIn,
      hasCheckedOut,
      status: userDateAttendance.status
    };
  };

  const statusInfo = getAttendanceStatusInfo();
  const canCheckIn = !statusInfo?.isOnLeave && !statusInfo?.hasCheckedIn;
  const canCheckOut = !statusInfo?.isOnLeave && statusInfo?.hasCheckedIn && !statusInfo?.hasCheckedOut;
  const canSubmitLeave = !userDateAttendance;

  // Get selected user name for display
  const selectedUserName = users.find(u => u.id === selectedUser)?.name || '';

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

      {/* Date Selector */}
      <div className="mb-4">
        <label htmlFor="attendance-date" className="block text-sm font-medium text-gray-700 mb-1">
          Select Date
        </label>
        <input
          type="date"
          id="attendance-date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {isFetchingAttendance ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading attendance data...</span>
        </div>
      ) : selectedUser && selectedDate && (
        <div className="space-y-4">
          {/* Status Display */}
          {statusInfo && (
            <div className="mb-6">
              {statusInfo.isOnLeave ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <h3 className="text-lg font-medium text-yellow-800">User is On Leave</h3>
                  </div>
                  <p className="text-yellow-700 mt-2">
                    <strong>{selectedUserName}</strong> is marked as{' '}
                    <span className="font-semibold">On Leave</span>{' '}
                    on {new Date(selectedDate).toLocaleDateString()}.
                  </p>
                  <p className="text-sm text-yellow-600 mt-1">
                    All attendance actions are disabled for this date.
                  </p>
                </div>
                             ) : statusInfo.isPresent ? (
                 <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                   <div className="flex items-center">
                     <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                     <h3 className="text-lg font-medium text-green-800">User is Present</h3>
                   </div>
                   <p className="text-green-700 mt-2">
                     <strong>{selectedUserName}</strong> is marked as <span className="font-semibold">Present</span> on {new Date(selectedDate).toLocaleDateString()}.
                   </p>
                   {statusInfo.hasCheckedIn && (
                     <p className="text-green-700 mt-1">
                       Checked in at{' '}
                       <span className="font-semibold">
                         {userDateAttendance?.checkInTime && new Date(userDateAttendance.checkInTime).toLocaleTimeString()}
                       </span>
                     </p>
                   )}
                   {statusInfo.hasCheckedOut ? (
                     <p className="text-green-700 mt-1">
                       Checked out at{' '}
                       <span className="font-semibold">
                         {userDateAttendance?.checkOutTime && new Date(userDateAttendance.checkOutTime).toLocaleTimeString()}
                       </span>
                     </p>
                   ) : statusInfo.hasCheckedIn ? (
                     <p className="text-sm text-green-600 mt-1">
                       You can still process check-out for this user.
                     </p>
                   ) : (
                     <p className="text-sm text-green-600 mt-1">
                       You can still process check-in/check-out for this user.
                     </p>
                   )}
                 </div>
               ) : statusInfo ? (
                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                   <div className="flex items-center">
                     <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                     <h3 className="text-lg font-medium text-blue-800">User Status: {statusInfo.status}</h3>
                   </div>
                   <p className="text-blue-700 mt-2">
                     <strong>{selectedUserName}</strong> is marked as <span className="font-semibold">{statusInfo.status}</span> on {new Date(selectedDate).toLocaleDateString()}.
                   </p>
                   {statusInfo.hasCheckedIn && (
                     <p className="text-blue-700 mt-1">
                       Checked in at{' '}
                       <span className="font-semibold">
                         {userDateAttendance?.checkInTime && new Date(userDateAttendance.checkInTime).toLocaleTimeString()}
                       </span>
                     </p>
                   )}
                   {statusInfo.hasCheckedOut && (
                     <p className="text-blue-700 mt-1">
                       Checked out at{' '}
                       <span className="font-semibold">
                         {userDateAttendance?.checkOutTime && new Date(userDateAttendance.checkOutTime).toLocaleTimeString()}
                       </span>
                     </p>
                   )}
                 </div>
               ) : null}
            </div>
          )}

          {/* Check-In/Out Time Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkin-time" className="block text-sm font-medium text-gray-700">
                Check-in Time
              </label>
              <input 
                type="time" 
                id="checkin-time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mt-1 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={!canCheckIn}
              />
              <button 
                onClick={handleManualCheckIn}
                disabled={isProcessing || !canCheckIn || !checkInTime}
                className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Clock className="h-4 w-4 mr-2" />
                )}
                Save Check-in
              </button>
            </div>
            <div>
              <label htmlFor="checkout-time" className="block text-sm font-medium text-gray-700">
                Check-out Time
              </label>
              <input 
                type="time" 
                id="checkout-time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mt-1 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={!canCheckOut}
              />
              <button 
                onClick={handleManualCheckOut}
                disabled={isProcessing || !canCheckOut || !checkOutTime}
                className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Clock className="h-4 w-4 mr-2" />
                )}
                Save Check-out
              </button>
            </div>
          </div>
          
          {/* On Leave Section */}
          <div className="space-y-2">
            <label htmlFor="leave-type" className="block text-sm font-medium text-gray-700">
              Mark as On Leave
            </label>
            <select
              id="leave-type"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={!canSubmitLeave}
            >
              {leaveTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input 
              type="text" 
              id="leave-reason"
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              placeholder="Reason for leave (optional)"
              className="w-full p-2 border border-gray-300 rounded-md mt-1 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={!canSubmitLeave}
            />
            <button 
              onClick={handleLeaveSubmit}
              disabled={isProcessing || !canSubmitLeave}
              className="mt-2 w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Calendar className="h-4 w-4 mr-2" />
              )}
              Submit Leave Request
            </button>
          </div>

          {/* Help Text */}
          {!statusInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-sm font-medium text-blue-800">No attendance record found</h3>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                You can check in the user, check out (if already checked in), or mark them as on leave for this date.
              </p>
            </div>
          )}
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