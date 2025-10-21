'use client';

import React, { useState, useEffect } from 'react';
import { User, AttendanceFilters as IAttendanceFilters } from '@/types/attendance';
import { attendanceService } from '@/services/attendanceService';
import { EthiopianDatePicker } from '../ui/ethiopian-date-picker';

interface AttendanceFiltersProps {
  users: User[];
  onFiltersChange: (filters: IAttendanceFilters) => void;
}

export default function AttendanceFilters({ users, onFiltersChange }: AttendanceFiltersProps) {
  const [selectedUser, setSelectedUser] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const depts = await attendanceService.getDepartments();
        setDepartments(depts);
      } catch (error) {
        console.error('Failed to load departments:', error);
        // Fallback: extract departments from users
        const uniqueDepts = [...new Set(users.map(u => u.department).filter(Boolean))];
        setDepartments(uniqueDepts as string[]);
      }
    };

    loadDepartments();

    // Set default date range to current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const startDateStr = firstDay.toISOString().split('T')[0];
    const endDateStr = lastDay.toISOString().split('T')[0];

    setStartDate(startDateStr);
    setEndDate(endDateStr);
  }, [users]);

  const handleApplyFilters = () => {
    const filters: IAttendanceFilters = {};

    if (selectedUser) filters.userId = selectedUser;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (selectedStatus) filters.status = selectedStatus;
    if (selectedDepartment) filters.department = selectedDepartment;

    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setSelectedUser('');
    setSelectedStatus('');
    setSelectedDepartment('');
    setStartDate('');
    setEndDate('');
    onFiltersChange({});
  };

  const setQuickDateRange = (range: 'today' | 'week' | 'month') => {
    const now = new Date();
    let start: Date;
    let end: Date = new Date();

    switch (range) {
      case 'today':
        start = new Date();
        end = new Date();
        break;
      case 'week':
        start = new Date();
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      default:
        return;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-app-foreground mb-4">Filter Attendance Records</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
        {/* Employee Filter */}
        <div>
          <label className="block text-sm font-medium text-app-foreground mb-1">
            Employee
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-app-foreground"
          >
            <option value="">All Employees</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-app-foreground mb-1">
            Start Date <span className="text-red-500">*</span>
          </label>
          <EthiopianDatePicker
            label=""
            value={startDate ? new Date(startDate) : null}
            onChange={(selectedDate: Date) => {
              // Adjust for timezone offset to ensure correct local date
              const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
              setStartDate(localDate.toISOString().split('T')[0]);
            }}
            required
            className="w-full"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-app-foreground mb-1">
            End Date <span className="text-red-500">*</span>
          </label>
          <EthiopianDatePicker
            label=""
            value={endDate ? new Date(endDate) : null}
            onChange={(selectedDate: Date) => {
              // Adjust for timezone offset to ensure correct local date
              const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
              setEndDate(localDate.toISOString().split('T')[0]);
            }}
            required
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-app-foreground mb-1">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-app-foreground"
          >
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="early_departure">Early Departure</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-sm font-medium text-app-foreground mb-1">
            Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-app-foreground"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
        {/* Quick Date Range Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-app-foreground mr-2">Quick ranges:</span>
          <button
            onClick={() => setQuickDateRange('today')}
            className="px-3 py-1 text-xs bg-gray-100 text-app-foreground rounded hover:bg-gray-200"
          >
            Today
          </button>
          <button
            onClick={() => setQuickDateRange('week')}
            className="px-3 py-1 text-xs bg-gray-100 text-app-foreground rounded hover:bg-gray-200"
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setQuickDateRange('month')}
            className="px-3 py-1 text-xs bg-gray-100 text-app-foreground rounded hover:bg-gray-200"
          >
            This Month
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-app-foreground hover:text-app-foreground border border-gray-300 rounded hover:bg-gray-50"
          >
            Clear Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-6 py-2 text-sm font-semibold text-white bg-app-foreground rounded-md hover:bg-app-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-foreground flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Apply Filters
          </button>
        </div>
      </div>

      {/* Note about required fields */}

    </div>
  );
} 