'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '@/services/attendanceService';
import { AttendanceRecord, User } from '@/types/attendance';
import { Edit, Clock, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { EthiopianDatePicker } from '../ui/ethiopian-date-picker';

interface ManualAttendancePanelProps {
  users: User[];
  loading: boolean;
}

export default function ManualAttendancePanel({ users, loading }: ManualAttendancePanelProps) {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [userDateAttendance, setUserDateAttendance] = useState<AttendanceRecord | null>(null);
  const [isFetchingAttendance, setIsFetchingAttendance] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const leaveTypes = ["Sick Leave", "Vacation", "Work from Home", "Holiday", "Maternity Leave", "Bereavement Leave"];
  const [leaveType, setLeaveType] = useState(leaveTypes[0]);
  const [isProcessing, setIsProcessing] = useState(false);

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

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
        <Edit className="h-5 w-5 mr-2" />
        Manual Attendance Entry
      </h2>

      {/* User Selection */}
      <div className="mb-4">
        <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select User
        </label>
        <select
          id="user-select"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        >
          <option value="">{loading ? 'Loading users...' : 'Select a user'}</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      {/* Date Selector */}
      <div className="mb-4">
        <label htmlFor="attendance-date" className="block text-sm font-medium text-gray-700 mb-1">
          Select Date
        </label>
        <EthiopianDatePicker
          label=""
          value={selectedDate ? new Date(selectedDate) : null}
          onChange={(selectedDate: Date) => {
            // Adjust for timezone offset to ensure correct local date
            const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
            setSelectedDate(localDate.toISOString().split('T')[0]);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
        </div>
      )}
    </div>
  );
} 