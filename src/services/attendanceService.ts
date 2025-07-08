import api from '@/utils/api';
import { 
  AttendanceRecord, 
  AttendanceStats, 
  CheckInOutRequest, 
  AttendanceFilters, 
  User 
} from '@/types/attendance';

class AttendanceService {
  private baseUrl = '/attendance';

  // ==================== USER MANAGEMENT ====================
  
  // Get all users/employees from the backend
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get('/users');
      console.log('Raw API response:', response.data);
      
      // Transform the response to match our User interface
      return response.data.map((user: any) => {
        const transformedUser = {
          id: user.id || user._id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown User',
          email: user.email || '',
          department: user.department || user.role?.name || 'N/A',
          position: user.position || user.role?.description || user.role?.name || 'Employee',
          avatar: user.avatar || user.profile_picture
        };
        console.log('Transformed user:', transformedUser);
        return transformedUser;
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Get users by role (if needed for filtering)
  async getUsersByRole(role?: string): Promise<User[]> {
    try {
      const endpoint = role ? `/users/byRole?role=${role}` : '/users/byRole';
      const response = await api.get(endpoint);
      return response.data.map((user: any) => ({
        id: user.id || user._id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown User',
        email: user.email || '',
        department: user.department || user.role?.name || 'N/A',
        position: user.position || user.role?.description || user.role?.name || 'Employee',
        avatar: user.avatar || user.profile_picture
      }));
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  }

  // Get single user by ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await api.get(`/users/${id}`);
      const user = response.data;
      return {
        id: user.id || user._id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown User',
        email: user.email || '',
        department: user.department || user.role?.name || 'N/A',
        position: user.position || user.role?.description || user.role?.name || 'Employee',
        avatar: user.avatar || user.profile_picture
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  // ==================== ATTENDANCE RECORDS ====================

  // Get attendance records with filters
  async getAttendanceRecords(filters: AttendanceFilters = {}): Promise<AttendanceRecord[]> {
    try {
      // Step 1: Fetch all users to create a lookup map
      const users = await this.getAllUsers();
      const userMap = new Map(users.map(user => [user.id, user]));

      // Step 2: Fetch attendance records
      const params = new URLSearchParams();
      
      if (filters.userId) params.append('user_id', filters.userId);
      if (filters.startDate) params.append('start_date', filters.startDate);
      if (filters.endDate) params.append('end_date', filters.endDate);
      if (filters.status) params.append('status', filters.status);

      const queryString = params.toString();
      const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
      
      const response = await api.get(url);
      
      // Step 3: Transform API response and enrich with user data
      let records = response.data.map((record: any) => {
        const user = userMap.get(record.user_id) || record.user;
        return {
          id: record.id,
          userId: record.user_id,
          user: user,
          date: record.date,
          checkInTime: record.check_in?.timestamp || '',
          checkOutTime: record.check_out?.timestamp || null,
          status: record.status,
          workHours: record.work_hours || 0,
          notes: record.check_in?.notes || record.check_out?.notes || '',
          location: {
            checkIn: record.check_in?.location?.address,
            checkOut: record.check_out?.location?.address
          },
          breakTime: 0, // Not provided by API
          overtimeHours: record.work_hours > 8 ? record.work_hours - 8 : 0,
          leaveType: record.leave_type || record.leaveType || null,
          leaveReason: record.leave_reason || record.leaveReason || null
        };
      });
      // Client-side department filter
      if (filters.department) {
        records = records.filter(r => r.user?.department === filters.department);
      }
      return records;
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      throw error;
    }
  }

  // Get attendance record by ID
  async getAttendanceById(id: string): Promise<AttendanceRecord> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      const record = response.data;
      
      return {
        id: record.id,
        userId: record.user_id,
        user: record.user,
        date: record.date,
        checkInTime: record.check_in?.timestamp || '',
        checkOutTime: record.check_out?.timestamp || null,
        status: record.status,
        workHours: record.work_hours || 0,
        notes: record.check_in?.notes || record.check_out?.notes || '',
        location: {
          checkIn: record.check_in?.location?.address,
          checkOut: record.check_out?.location?.address
        },
        breakTime: 0,
        overtimeHours: record.work_hours > 8 ? record.work_hours - 8 : 0,
        leaveType: record.leave_type || record.leaveType || null,
        leaveReason: record.leave_reason || record.leaveReason || null
      };
    } catch (error) {
      console.error('Error fetching attendance record:', error);
      throw error;
    }
  }

  // ==================== CHECK IN/OUT OPERATIONS ====================

  // Check in - User ID is extracted from JWT token automatically
  async checkIn(notes?: string, location?: { latitude: number; longitude: number; address?: string }): Promise<AttendanceRecord> {
    try {
      const checkInData = {
        check_in: {
          timestamp: new Date().toISOString(),
          location: {
            latitude: location?.latitude || 0,
            longitude: location?.longitude || 0,
            address: location?.address || "Office Location"
          },
          notes: notes || ""
        }
      };

      const response = await api.post(`${this.baseUrl}/check-in`, checkInData);
      const record = response.data;
      
      return {
        id: record.id,
        userId: record.user_id,
        user: record.user,
        date: record.date,
        checkInTime: record.check_in?.timestamp || '',
        checkOutTime: record.check_out?.timestamp || null,
        status: record.status,
        workHours: record.work_hours || 0,
        notes: record.check_in?.notes || '',
        location: {
          checkIn: record.check_in?.location?.address,
          checkOut: record.check_out?.location?.address
        },
        breakTime: 0,
        overtimeHours: 0
      };
    } catch (error) {
      console.error('Error during check in:', error);
      throw error;
    }
  }

  // Check out - requires attendance record ID
  async checkOut(attendanceId: string, notes?: string, location?: { latitude: number; longitude: number; address?: string }): Promise<AttendanceRecord> {
    try {
      const checkOutData = {
        timestamp: new Date().toISOString(),
        location: {
          latitude: location?.latitude || 0,
          longitude: location?.longitude || 0,
          address: location?.address || "Office Location"
        },
        notes: notes || ""
      };

      const response = await api.post(`${this.baseUrl}/${attendanceId}/check-out`, checkOutData);
      const record = response.data;
      
      return {
        id: record.id,
        userId: record.user_id,
        user: record.user,
        date: record.date,
        checkInTime: record.check_in?.timestamp || '',
        checkOutTime: record.check_out?.timestamp || null,
        status: record.status,
        workHours: record.work_hours || 0,
        notes: record.check_out?.notes || record.check_in?.notes || '',
        location: {
          checkIn: record.check_in?.location?.address,
          checkOut: record.check_out?.location?.address
        },
        breakTime: 0,
        overtimeHours: record.work_hours > 8 ? record.work_hours - 8 : 0
      };
    } catch (error) {
      console.error('Error during check out:', error);
      throw error;
    }
  }

  // ==================== STATISTICS & REPORTS ====================

  // Get attendance statistics
  async getAttendanceStats(filters?: AttendanceFilters): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (filters?.userId) params.append('user_id', filters.userId);
      if (filters?.startDate) params.append('start_date', filters.startDate);
      if (filters?.endDate) params.append('end_date', filters.endDate);

      const queryString = params.toString();
      const url = queryString ? `${this.baseUrl}/stats?${queryString}` : `${this.baseUrl}/stats`;

      const response = await api.get(url);
      
      // Transform API response to match our interface
      return {
        totalDays: response.data.totalAttendances || 0,
        presentDays: response.data.presentCount || 0,
        absentDays: response.data.absentCount || 0,
        lateDays: response.data.lateCount || 0,
        earlyDepartures: 0, // Not provided by API
        averageWorkHours: response.data.averageWorkingHours || 0,
        totalWorkHours: response.data.totalWorkHours || 0,
        overtimeHours: 0, // Calculate if needed
        attendanceRate: response.data.totalAttendances > 0 
          ? (response.data.presentCount / response.data.totalAttendances) * 100 
          : 0
      };
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      // Fallback to calculated stats
      return this.calculateStatsFromRecords(filters);
    }
  }

  // Get monthly attendance report
  async getMonthlyReport(year: number, month: number, userId?: string): Promise<any> {
    try {
      const params = new URLSearchParams();
      params.append('year', year.toString());
      params.append('month', month.toString());
      if (userId) params.append('userId', userId);

      const response = await api.get(`${this.baseUrl}/monthly-report?${params.toString()}`);
      
      // Transform API response
      return {
        year,
        month,
        userId,
        summary: {
          totalWorkingDays: response.data.workingDays || 0,
          presentDays: response.data.present || 0,
          absentDays: response.data.absent || 0,
          lateDays: response.data.late || 0,
          earlyDepartures: 0,
          leaveDays: response.data.leave || 0,
          weekends: response.data.totalDays - response.data.workingDays || 0,
          holidays: 0
        },
        attendanceRate: response.data.workingDays > 0 
          ? (response.data.present / response.data.workingDays) * 100 
          : 0,
        totalWorkHours: response.data.totalWorkHours || 0,
        averageWorkHours: response.data.present > 0 
          ? (response.data.totalWorkHours / response.data.present) 
          : 0,
        overtimeHours: 0,
        details: [] // Would need additional API call for daily details
      };
    } catch (error) {
      console.error('Error fetching monthly report:', error);
      throw error;
    }
  }

  // ==================== LEAVE MANAGEMENT ====================

  // Request leave - User ID extracted from JWT token
  async requestLeave(leaveType: string, leaveReason: string, timestamp?: string): Promise<any> {
    try {
      const leaveData = {
        check_in: {
          timestamp: timestamp || new Date().toISOString(),
          location: {
            latitude: 0,
            longitude: 0
          }
        },
        leave_type: leaveType,
        leave_reason: leaveReason
      };

      const response = await api.post(`${this.baseUrl}/leave`, leaveData);
      return response.data;
    } catch (error) {
      console.error('Error requesting leave:', error);
      throw error;
    }
  }

  // Approve leave request (Manager/Admin only)
  async approveLeave(attendanceId: string): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/${attendanceId}/approve-leave`, {});
      return response.data;
    } catch (error) {
      console.error('Error approving leave:', error);
      throw error;
    }
  }

  // Reject leave request (Manager/Admin only)
  async rejectLeave(attendanceId: string, reason: string): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/${attendanceId}/reject-leave`, {
        reason: reason
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting leave:', error);
      throw error;
    }
  }

  // Get leave requests (using regular attendance endpoint with leave status)
  async getLeaveRequests(filters?: any): Promise<any[]> {
    try {
      const attendanceFilters: AttendanceFilters = {
        ...filters,
        status: 'leave'
      };
      return await this.getAttendanceRecords(attendanceFilters);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      throw error;
    }
  }

  // ==================== BULK OPERATIONS ====================

  // Bulk update attendance records
  async bulkUpdateAttendance(ids: string[], updates: any): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/bulk-update`, {
        ids: ids,
        update: updates
      });
      return {
        success: response.data.length || 0,
        failed: 0,
        errors: []
      };
    } catch (error) {
      console.error('Error bulk updating attendance:', error);
      throw error;
    }
  }

  // ==================== CRUD OPERATIONS ====================

  // Update attendance record
  async updateAttendance(id: string, data: any): Promise<AttendanceRecord> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}`, data);
      const record = response.data;
      
      return {
        id: record.id,
        userId: record.user_id,
        user: record.user,
        date: record.date,
        checkInTime: record.check_in?.timestamp || '',
        checkOutTime: record.check_out?.timestamp || null,
        status: record.status,
        workHours: record.work_hours || 0,
        notes: record.check_in?.notes || record.check_out?.notes || '',
        location: {
          checkIn: record.check_in?.location?.address,
          checkOut: record.check_out?.location?.address
        },
        breakTime: 0,
        overtimeHours: record.work_hours > 8 ? record.work_hours - 8 : 0
      };
    } catch (error) {
      console.error('Error updating attendance record:', error);
      throw error;
    }
  }

  // Delete attendance record
  async deleteAttendance(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================

  // Get today's attendance status for current user (JWT extracted)
  async getTodayAttendance(): Promise<AttendanceRecord | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const records = await this.getAttendanceRecords({
        startDate: today,
        endDate: today
      });
      
      return records.length > 0 ? records[0] : null;
    } catch (error) {
      console.error('Error fetching today\'s attendance:', error);
      return null;
    }
  }

  // Get today's attendance for specific user
  async getTodayAttendanceForUser(userId: string): Promise<AttendanceRecord | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const records = await this.getAttendanceRecords({
        userId,
        startDate: today,
        endDate: today
      });
      
      return records.length > 0 ? records[0] : null;
    } catch (error) {
      console.error('Error fetching today\'s attendance for user:', error);
      return null;
    }
  }

  // Calculate stats from records (fallback method)
  private async calculateStatsFromRecords(filters?: AttendanceFilters): Promise<AttendanceStats> {
    try {
      const records = await this.getAttendanceRecords(filters);

      const totalDays = records.length;
      const presentDays = records.filter(r => r.status === 'present').length;
      const absentDays = records.filter(r => r.status === 'absent').length;
      const lateDays = records.filter(r => r.status === 'late').length;
      const earlyDepartures = records.filter(r => r.status === 'early_departure').length;

      // Calculate average work hours
      const recordsWithBothTimes = records.filter(r => r.checkInTime && r.checkOutTime);
      const totalHours = recordsWithBothTimes.reduce((sum, record) => {
        return sum + (record.workHours || 0);
      }, 0);

      const averageWorkHours = recordsWithBothTimes.length > 0 ? totalHours / recordsWithBothTimes.length : 0;

      return {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        earlyDepartures,
        averageWorkHours,
        totalWorkHours: totalHours,
        overtimeHours: recordsWithBothTimes.reduce((sum, record) => sum + (record.overtimeHours || 0), 0),
        attendanceRate: totalDays > 0 ? (presentDays / totalDays) * 100 : 0
      };
    } catch (error) {
      console.error('Error calculating attendance stats:', error);
      throw error;
    }
  }

  // Get department list for filtering (extract from users' roles)
  async getDepartments(): Promise<string[]> {
    try {
      const users = await this.getAllUsers();
      const departments = [...new Set(users.map(u => u.department).filter(Boolean))];
      return departments as string[];
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  }

  // ==================== BACKWARD COMPATIBILITY ====================

  // Legacy method for backward compatibility
  async checkInOut(data: CheckInOutRequest): Promise<AttendanceRecord> {
    if (data.type === 'checkin') {
      return this.checkIn(data.notes, data.location);
    } else {
      throw new Error('Checkout requires attendance record ID. Use checkOut method directly.');
    }
  }

  // ==================== MANUAL ATTENDANCE OPERATIONS (FOR ADMIN/MANAGER) ====================

  async manualCheckIn(userId: string, checkInTime: string, notes?: string): Promise<AttendanceRecord> {
    try {
      // In a real app, this would be a dedicated, secure endpoint.
      // e.g., POST /attendance/manual-check-in
      console.log(`[Frontend Only] Simulating manual check-in for user ${userId} at ${checkInTime}`);
      
      const payload = {
        user_id: userId,
        status: "present",
        check_in: {
          timestamp: new Date(checkInTime).toISOString(),
          location: {
            latitude: 0,
            longitude: 0,
          },
          notes: notes || "Checking in for the day."
        }
      };
      
      // Pass user_id in the body, assuming a new or updated backend endpoint
      const response = await api.post(`${this.baseUrl}/check-in`, payload);
      return response.data;
    } catch (error) {
      console.error('Error during manual check in:', error);
      throw error;
    }
  }

  async manualCheckOut(attendanceId: string, checkOutTime: string, notes?: string): Promise<AttendanceRecord> {
    try {
      // In a real app, this would be a dedicated, secure endpoint.
      // e.g., POST /attendance/${attendanceId}/manual-check-out
      console.log(`[Frontend Only] Simulating manual check-out for attendance ${attendanceId} at ${checkOutTime}`);

      const payload = {
        timestamp: new Date(checkOutTime).toISOString(),
        location: {
          latitude: 0,
          longitude: 0,
        },
        notes: notes || "Ending the workday."
      };

      const response = await api.post(`${this.baseUrl}/${attendanceId}/check-out`, payload);
      return response.data;
    } catch (error) {
      console.error('Error during manual check out:', error);
      throw error;
    }
  }

  async markOnLeave(userId: string, reason: string, date: string): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/mark-on-leave`, {
        user_id: userId,
        date: date,
        status: 'On Leave',
        notes: reason,
      });
      return response.data;
    } catch (error) {
      console.error('Error marking user on leave:', error);
      throw error;
    }
  }

  async submitLeaveRequest(leaveData: any): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/leave`, leaveData);
      return response.data;
    } catch (error) {
      console.error('Error submitting leave request:', error);
      throw error;
    }
  }
}

export const attendanceService = new AttendanceService(); 