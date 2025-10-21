'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '@/services/attendanceService';
import { AttendanceRecord, User } from '@/types/attendance';
import { formatToEthiopianDate } from '@/utils/ethiopianDateUtils';
import {
  Calendar,
  Download,
  FileText,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface MonthlyReportData {
  year: number;
  month: number;
  monthName: string;
  totalWorkingDays: number;
  totalEmployees: number;
  attendanceRecords: AttendanceRecord[];
  users: User[];
  summary: {
    totalPresent: number;
    totalAbsent: number;
    totalLeave: number;
    totalLate: number;
    attendanceRate: number;
    totalWorkHours: number;
    averageWorkHours: number;
  };
}

export default function MonthlyReports() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<MonthlyReportData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const userList = await attendanceService.getAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch user data');
    }
  }, []);

  const fetchMonthlyData = useCallback(async (monthYear: string) => {
    try {
      setLoading(true);
      setError(null);

      const [year, month] = monthYear.split('-').map(Number);
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      // Get start and end dates for the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // Fetch all attendance records for the month
      const attendanceRecords = await attendanceService.getAttendanceRecords({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      });

      // Calculate working days (excluding weekends)
      const workingDays = getWorkingDaysInMonth(year, month - 1);

      // Calculate summary statistics
      const summary = {
        totalPresent: attendanceRecords.filter(r => r.status === 'present').length,
        totalAbsent: attendanceRecords.filter(r => r.status === 'absent').length,
        totalLeave: attendanceRecords.filter(r => r.status === 'leave').length,
        totalLate: attendanceRecords.filter(r => r.status === 'late').length,
        attendanceRate: 0,
        totalWorkHours: attendanceRecords.reduce((sum, r) => sum + (r.workHours || 0), 0),
        averageWorkHours: 0
      };

      summary.attendanceRate = attendanceRecords.length > 0
        ? (summary.totalPresent / attendanceRecords.length) * 100
        : 0;

      summary.averageWorkHours = summary.totalPresent > 0
        ? summary.totalWorkHours / summary.totalPresent
        : 0;

      const data: MonthlyReportData = {
        year,
        month,
        monthName: monthNames[month - 1],
        totalWorkingDays: workingDays,
        totalEmployees: users.length,
        attendanceRecords,
        users,
        summary
      };

      setReportData(data);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
      setError('Failed to fetch monthly attendance data');
    } finally {
      setLoading(false);
    }
  }, [users]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (users.length > 0) {
      fetchMonthlyData(selectedMonth);
    }
  }, [selectedMonth, users, fetchMonthlyData]);

  const getWorkingDaysInMonth = (year: number, month: number) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    let workingDays = 0;

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude weekends
        workingDays++;
      }
    }

    return workingDays;
  };

  const formatDate = (dateString: string) => {
    return formatToEthiopianDate(dateString, 'medium');
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToExcel = async () => {
    if (!reportData) return;

    try {
      setLoading(true);

      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // =============== SUMMARY SHEET ===============
      const summaryData = [
        ['Monthly Attendance Report'],
        ['Month', reportData.monthName],
        ['Year', reportData.year],
        ['Total Working Days', reportData.totalWorkingDays],
        ['Total Employees', reportData.totalEmployees],
        [''],
        ['ATTENDANCE SUMMARY'],
        ['Total Present', reportData.summary.totalPresent],
        ['Total Absent', reportData.summary.totalAbsent],
        ['Total Leave', reportData.summary.totalLeave],
        ['Total Late', reportData.summary.totalLate],
        ['Attendance Rate', `${reportData.summary.attendanceRate.toFixed(2)}%`],
        [''],
        ['WORK HOURS SUMMARY'],
        ['Total Work Hours', reportData.summary.totalWorkHours.toFixed(2)],
        ['Average Work Hours', reportData.summary.averageWorkHours.toFixed(2)],
        [''],
        ['Generated on', formatToEthiopianDate(new Date(), 'medium')]
      ];

      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

      // =============== DETAILED ATTENDANCE SHEET ===============
      const attendanceHeaders = [
        'Date',
        'Employee ID',
        'Employee Name',
        'Department',
        'Position',
        'Status',
        'Check In Time',
        'Check Out Time',
        'Work Hours',
        'Overtime Hours',
        'Leave Type',
        'Leave Reason',
        'Notes',
        'Check In Location',
        'Check Out Location'
      ];

      const attendanceData = [attendanceHeaders];

      // Add attendance records
      for (const record of reportData.attendanceRecords) {
        const user = reportData.users.find(u => u.id === record.userId) || record.user;
        attendanceData.push([
          formatDate(record.date),
          record.userId,
          user?.name || 'Unknown User',
          user?.department || 'N/A',
          user?.position || 'N/A',
          record.status.charAt(0).toUpperCase() + record.status.slice(1),
          formatTime(record.checkInTime),
          formatTime(record.checkOutTime || ''),
          record.workHours?.toFixed(2) || '0.00',
          record.overtimeHours?.toFixed(2) || '0.00',
          record.leaveType || 'N/A',
          record.leaveReason || 'N/A',
          record.notes || 'N/A',
          record.location?.checkIn || 'N/A',
          record.location?.checkOut || 'N/A'
        ]);
      }

      const attendanceWs = XLSX.utils.aoa_to_sheet(attendanceData);

      // Auto-size columns
      const attendanceColWidths = [
        { wch: 12 }, // Date
        { wch: 12 }, // Employee ID
        { wch: 20 }, // Employee Name
        { wch: 15 }, // Department
        { wch: 15 }, // Position
        { wch: 10 }, // Status
        { wch: 12 }, // Check In Time
        { wch: 12 }, // Check Out Time
        { wch: 10 }, // Work Hours
        { wch: 10 }, // Overtime Hours
        { wch: 15 }, // Leave Type
        { wch: 30 }, // Leave Reason
        { wch: 20 }, // Notes
        { wch: 20 }, // Check In Location
        { wch: 20 }  // Check Out Location
      ];
      attendanceWs['!cols'] = attendanceColWidths;

      XLSX.utils.book_append_sheet(wb, attendanceWs, 'Detailed Attendance');

      // =============== EMPLOYEE SUMMARY SHEET ===============
      const employeeSummaryHeaders = [
        'Employee ID',
        'Employee Name',
        'Department',
        'Position',
        'Total Present',
        'Total Absent',
        'Total Leave',
        'Total Late',
        'Total Work Hours',
        'Average Work Hours',
        'Attendance Rate',
        'Leave Days by Type'
      ];

      const employeeSummaryData = [employeeSummaryHeaders];

      // Calculate per-employee statistics
      for (const user of reportData.users) {
        const userRecords = reportData.attendanceRecords.filter(r => r.userId === user.id);
        const present = userRecords.filter(r => r.status === 'present').length;
        const absent = userRecords.filter(r => r.status === 'absent').length;
        const leave = userRecords.filter(r => r.status === 'leave').length;
        const late = userRecords.filter(r => r.status === 'late').length;
        const totalWorkHours = userRecords.reduce((sum, r) => sum + (r.workHours || 0), 0);
        const avgWorkHours = present > 0 ? totalWorkHours / present : 0;
        const attendanceRate = userRecords.length > 0 ? (present / userRecords.length) * 100 : 0;

        // Group leave types
        const leaveTypes = userRecords
          .filter(r => r.status === 'leave' && r.leaveType)
          .reduce((acc, r) => {
            acc[r.leaveType!] = (acc[r.leaveType!] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

        const leaveTypeString = Object.entries(leaveTypes)
          .map(([type, count]) => `${type}: ${count}`)
          .join(', ') || 'N/A';

        employeeSummaryData.push([
          user.id,
          user.name,
          user.department,
          user.position,
          present.toString(),
          absent.toString(),
          leave.toString(),
          late.toString(),
          totalWorkHours.toFixed(2),
          avgWorkHours.toFixed(2),
          `${attendanceRate.toFixed(2)}%`,
          leaveTypeString
        ]);
      }

      const employeeSummaryWs = XLSX.utils.aoa_to_sheet(employeeSummaryData);
      const employeeColWidths = [
        { wch: 12 }, // Employee ID
        { wch: 20 }, // Employee Name
        { wch: 15 }, // Department
        { wch: 15 }, // Position
        { wch: 10 }, // Total Present
        { wch: 10 }, // Total Absent
        { wch: 10 }, // Total Leave
        { wch: 10 }, // Total Late
        { wch: 12 }, // Total Work Hours
        { wch: 12 }, // Average Work Hours
        { wch: 12 }, // Attendance Rate
        { wch: 30 }  // Leave Days by Type
      ];
      employeeSummaryWs['!cols'] = employeeColWidths;

      XLSX.utils.book_append_sheet(wb, employeeSummaryWs, 'Employee Summary');

      // =============== DAILY SUMMARY SHEET ===============
      const dailySummaryHeaders = [
        'Date',
        'Day of Week',
        'Total Present',
        'Total Absent',
        'Total Leave',
        'Total Late',
        'Total Work Hours',
        'Attendance Rate'
      ];

      const dailySummaryData = [dailySummaryHeaders];

      // Get all dates in the month
      const startDate = new Date(reportData.year, reportData.month - 1, 1);
      const endDate = new Date(reportData.year, reportData.month, 0);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().split('T')[0];
        const dayRecords = reportData.attendanceRecords.filter(r => r.date === dateString);

        const present = dayRecords.filter(r => r.status === 'present').length;
        const absent = dayRecords.filter(r => r.status === 'absent').length;
        const leave = dayRecords.filter(r => r.status === 'leave').length;
        const late = dayRecords.filter(r => r.status === 'late').length;
        const totalWorkHours = dayRecords.reduce((sum, r) => sum + (r.workHours || 0), 0);
        const attendanceRate = dayRecords.length > 0 ? (present / dayRecords.length) * 100 : 0;

        dailySummaryData.push([
          formatDate(dateString),
          dayNames[date.getDay()],
          present.toString(),
          absent.toString(),
          leave.toString(),
          late.toString(),
          totalWorkHours.toFixed(2),
          `${attendanceRate.toFixed(2)}%`
        ]);
      }

      const dailySummaryWs = XLSX.utils.aoa_to_sheet(dailySummaryData);
      XLSX.utils.book_append_sheet(wb, dailySummaryWs, 'Daily Summary');

      // Generate filename
      const filename = `Attendance_Report_${reportData.monthName}_${reportData.year}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

      // Show success message
      alert('Excel report generated successfully!');
    } catch (error) {
      console.error('Error generating Excel report:', error);
      alert('Failed to generate Excel report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FileText className="h-6 w-6 mr-2" />
          Monthly Reports
        </h1>
      </div>

      {/* Month Selection and Export */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => fetchMonthlyData(selectedMonth)}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TrendingUp className="h-4 w-4" />
              )}
              <span>Generate Report</span>
            </button>
            <button
              onClick={exportToExcel}
              disabled={loading || !reportData}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>Export Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Report Preview */}
      {reportData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Total Employees</h3>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{reportData.totalEmployees}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Attendance Rate</h3>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {reportData.summary.attendanceRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Total Work Hours</h3>
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {reportData.summary.totalWorkHours.toFixed(0)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Working Days</h3>
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{reportData.totalWorkingDays}</p>
            </div>
          </div>

          {/* Detailed Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">
              {reportData.monthName} {reportData.year} Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{reportData.summary.totalPresent}</p>
                <p className="text-sm text-gray-600">Present</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{reportData.summary.totalAbsent}</p>
                <p className="text-sm text-gray-600">Absent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{reportData.summary.totalLeave}</p>
                <p className="text-sm text-gray-600">On Leave</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{reportData.summary.totalLate}</p>
                <p className="text-sm text-gray-600">Late</p>
              </div>
            </div>
          </div>

          {/* Export Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Export Information</p>
                <p className="text-blue-600">
                  Excel report includes: Summary, Detailed Attendance, Employee Summary, and Daily Summary sheets with complete backup data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 