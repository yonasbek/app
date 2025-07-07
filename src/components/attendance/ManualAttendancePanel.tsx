'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '@/services/attendanceService';
import { AttendanceRecord, User } from '@/types/attendance';
import { Edit } from 'lucide-react';

interface ManualAttendancePanelProps {
  users: User[];
  loading: boolean;
}

export default function ManualAttendancePanel({ users, loading }: ManualAttendancePanelProps) {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [userTodayAttendance, setUserTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [isFetchingAttendance, setIsFetchingAttendance] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const leaveTypes = ["Sick Leave", "Vacation", "Work from Home", "Holiday", "Maternity Leave", "Bereavement Leave"];
  const [leaveType, setLeaveType] = useState(leaveTypes[0]);
  const [isProcessing, setIsProcessing] = useState(false);

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
        <input
          type="date"
          id="attendance-date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {isFetchingAttendance ? (
         <div className="text-center p-4">Loading attendance...</div>
      ) : selectedUser && (
        <div className="space-y-4">
          {/* Check-In/Out Time Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkin-time" className="block text-sm font-medium text-gray-700">Check-in Time</label>
              <input 
                type="time" 
                id="checkin-time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mt-1 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                disabled={!!userTodayAttendance?.checkInTime}
              />
              <button 
                onClick={handleManualCheckIn}
                disabled={isProcessing || !!userTodayAttendance?.checkInTime}
                className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Save Check-in
              </button>
            </div>
            <div>
              <label htmlFor="checkout-time" className="block text-sm font-medium text-gray-700">Check-out Time</label>
              <input 
                type="time" 
                id="checkout-time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mt-1 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                disabled={!canCheckOut}
              />
               <button 
                onClick={handleManualCheckOut}
                disabled={isProcessing || !canCheckOut}
                className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Save Check-out
              </button>
            </div>
          </div>
          
          {/* On Leave Section */}
          <div className="space-y-2">
            <label htmlFor="leave-type" className="block text-sm font-medium text-gray-700">Mark as On Leave</label>
            <select
              id="leave-type"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              disabled={!!userTodayAttendance}
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
              className="w-full p-2 border border-gray-300 rounded-md mt-1 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              disabled={!!userTodayAttendance}
            />
            <button 
              onClick={handleLeaveSubmit}
              disabled={isProcessing || !!userTodayAttendance}
              className="mt-2 w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Submit Leave Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 