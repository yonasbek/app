'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '@/services/attendanceService';
import { LeaveRequest, LeaveType, LeaveStatus, LeaveBalance, User } from '@/types/attendance';
import { 
  Calendar, 
  Plus, 
  Check, 
  X, 
  Clock, 
  User as UserIcon,
  Filter,
  Download,
  FileText,
  AlertCircle,
  CalendarDays
} from 'lucide-react';

interface LeaveManagementProps {
  currentUser?: User;
  isManager?: boolean;
}

export default function LeaveManagement({ currentUser, isManager = false }: LeaveManagementProps) {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-leaves' | 'request-leave' | 'approvals' | 'balance'>('my-leaves');
  const [filters, setFilters] = useState({
    status: '' as LeaveStatus | '',
    leaveType: '' as LeaveType | '',
    startDate: '',
    endDate: ''
  });

  // Form states
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'annual_leave' as string,
    startDate: '',
    endDate: '',
    reason: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const fetchLeaveRequests = useCallback(async () => {
    try {
      setLoading(true);
      const requestFilters = {
        userId: isManager ? undefined : currentUser?.id,
        status: 'leave', // Get all leave records
        ...filters
      };
      const requests = await attendanceService.getLeaveRequests(requestFilters);
      setLeaveRequests(requests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, isManager, filters]);

  const fetchLeaveBalance = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      // Note: This would typically be a separate endpoint, but we'll simulate it
      const mockBalance: LeaveBalance = {
        userId: currentUser.id,
        year: new Date().getFullYear(),
        annual: { total: 25, used: 12, remaining: 13 },
        sick: { total: 10, used: 3, remaining: 7 },
        emergency: { total: 5, used: 1, remaining: 4 },
        compensatory: { total: 15, used: 8, remaining: 7 }
      };
      setLeaveBalance(mockBalance);
    } catch (error) {
      console.error('Error fetching leave balance:', error);
    }
  }, [currentUser?.id]);

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
    fetchLeaveRequests();
    fetchLeaveBalance();
    fetchUsers();
  }, [fetchLeaveRequests, fetchLeaveBalance, fetchUsers]);

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      
      // Use the correct API format - user ID is extracted from JWT token
      await attendanceService.requestLeave(
        leaveForm.leaveType,
        leaveForm.reason,
        new Date(leaveForm.startDate).toISOString()
      );
      
      // Reset form
      setLeaveForm({
        leaveType: 'annual_leave',
        startDate: '',
        endDate: '',
        reason: '',
        emergencyContact: { name: '', phone: '', relationship: '' }
      });
      
      // Refresh requests
      fetchLeaveRequests();
      setActiveTab('my-leaves');
      
      alert('Leave request submitted successfully!');
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Failed to submit leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLeave = async (attendanceId: string) => {
    try {
      await attendanceService.approveLeave(attendanceId);
      fetchLeaveRequests();
      alert('Leave request approved successfully!');
    } catch (error) {
      console.error('Error approving leave:', error);
      alert('Failed to approve leave request.');
    }
  };

  const handleRejectLeave = async (attendanceId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await attendanceService.rejectLeave(attendanceId, reason);
      fetchLeaveRequests();
      alert('Leave request rejected successfully!');
    } catch (error) {
      console.error('Error rejecting leave:', error);
      alert('Failed to reject leave request.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'leave': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'annual_leave': return 'bg-blue-100 text-blue-800';
      case 'sick_leave': return 'bg-red-100 text-red-800';
      case 'emergency_leave': return 'bg-orange-100 text-orange-800';
      case 'maternity_leave': return 'bg-pink-100 text-pink-800';
      case 'paternity_leave': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLeaveType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('request-leave')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Request Leave</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('my-leaves')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'my-leaves'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Leaves
          </button>
          <button
            onClick={() => setActiveTab('request-leave')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'request-leave'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Request Leave
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'balance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Leave Balance
          </button>
          {isManager && (
            <button
              onClick={() => setActiveTab('approvals')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'approvals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Approvals
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'my-leaves' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as LeaveStatus | '' })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={filters.leaveType}
                onChange={(e) => setFilters({ ...filters, leaveType: e.target.value as LeaveType | '' })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Types</option>
                <option value="annual_leave">Annual Leave</option>
                <option value="sick_leave">Sick Leave</option>
                <option value="emergency_leave">Emergency Leave</option>
                <option value="maternity_leave">Maternity Leave</option>
                <option value="paternity_leave">Paternity Leave</option>
              </select>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="End Date"
              />
            </div>
          </div>

          {/* Leave Requests List */}
          <div className="bg-white rounded-lg shadow-sm border">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : leaveRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No leave requests found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {leaveRequests.map((request) => (
                  <div key={request.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(request.leave_type || 'annual_leave')}`}>
                            {formatLeaveType(request.leave_type || 'Annual Leave')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-900">
                          {request.date} ({request.workHours || 8} hours)
                        </h3>
                        <p className="text-gray-600">{request.leave_reason || request.notes}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Applied: {new Date(request.date).toLocaleDateString()}</span>
                          {request.updated_at && (
                            <span>Updated: {new Date(request.updated_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      {isManager && request.status === 'leave' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveLeave(request.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                          >
                            <Check className="h-3 w-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleRejectLeave(request.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center space-x-1"
                          >
                            <X className="h-3 w-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'request-leave' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Submit Leave Request</h2>
          <form onSubmit={handleSubmitLeave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="annual_leave">Annual Leave</option>
                  <option value="sick_leave">Sick Leave</option>
                  <option value="emergency_leave">Emergency Leave</option>
                  <option value="maternity_leave">Maternity Leave</option>
                  <option value="paternity_leave">Paternity Leave</option>
                  <option value="personal_leave">Personal Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Date</label>
                <input
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows={3}
                required
                placeholder="Please provide a reason for your leave request..."
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-3">Emergency Contact (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={leaveForm.emergencyContact.name}
                  onChange={(e) => setLeaveForm({
                    ...leaveForm,
                    emergencyContact: { ...leaveForm.emergencyContact, name: e.target.value }
                  })}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Contact Name"
                />
                <input
                  type="tel"
                  value={leaveForm.emergencyContact.phone}
                  onChange={(e) => setLeaveForm({
                    ...leaveForm,
                    emergencyContact: { ...leaveForm.emergencyContact, phone: e.target.value }
                  })}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Phone Number"
                />
                <input
                  type="text"
                  value={leaveForm.emergencyContact.relationship}
                  onChange={(e) => setLeaveForm({
                    ...leaveForm,
                    emergencyContact: { ...leaveForm.emergencyContact, relationship: e.target.value }
                  })}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Relationship"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">API Note:</p>
                  <p>The current API creates a single-day leave record. Multi-day leave requests would require multiple API calls or backend enhancement.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('my-leaves')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                <span>Submit Request</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'balance' && leaveBalance && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(leaveBalance).map(([key, value]) => {
            if (key === 'userId' || key === 'year') return null;
            
            const leaveType = value as { total: number; used: number; remaining: number };
            const percentage = (leaveType.used / leaveType.total) * 100;
            
            return (
              <div key={key} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900 capitalize">{key} Leave</h3>
                  <CalendarDays className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Used</span>
                    <span className="font-medium">{leaveType.used}/{leaveType.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-medium text-green-600">{leaveType.remaining} days</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'approvals' && isManager && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Pending Approvals</h2>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {leaveRequests.filter(req => req.status === 'leave').map((request) => (
                <div key={request.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{request.user?.name || 'Unknown User'}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(request.leave_type || 'annual_leave')}`}>
                          {formatLeaveType(request.leave_type || 'Annual Leave')}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900">
                        {request.date} ({request.workHours || 8} hours)
                      </h3>
                      <p className="text-gray-600">{request.leave_reason || request.notes}</p>
                      <p className="text-sm text-gray-500">
                        Applied: {new Date(request.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveLeave(request.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                      >
                        <Check className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectLeave(request.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {leaveRequests.filter(req => req.status === 'leave').length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No pending approvals</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 