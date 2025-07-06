export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  avatar?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface CheckInData {
  timestamp: string;
  location: Location;
  notes: string;
}

export interface CheckOutData {
  timestamp: string;
  location: Location;
  notes: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  user?: User;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'present' | 'absent' | 'late' | 'early_departure' | 'on_leave';
  workHours?: number;
  notes?: string;
  location?: {
    checkIn?: string;
    checkOut?: string;
  };
  breakTime?: number;
  overtimeHours?: number;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  earlyDepartures: number;
  averageWorkHours: number;
  totalWorkHours?: number;
  overtimeHours?: number;
  attendanceRate?: number;
}

export interface CheckInOutRequest {
  userId: string;
  type: 'checkin' | 'checkout';
  timestamp?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  notes?: string;
}

export interface CheckInRequest {
  user_id: string;
  status: string;
  check_in: CheckInData;
  notes?: string;
  leave_type?: string;
  leave_reason?: string;
}

export interface CheckOutRequest {
  timestamp: string;
  location: Location;
  notes?: string;
}

export interface AttendanceFilters {
  userId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  department?: string;
  page?: number;
  limit?: number;
}

// ==================== LEAVE MANAGEMENT ====================

export interface LeaveRequest {
  id: string;
  userId: string;
  user?: User;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectedReason?: string;
  documents?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export type LeaveType = 
  | 'annual' 
  | 'sick' 
  | 'maternity' 
  | 'paternity' 
  | 'emergency' 
  | 'compensatory' 
  | 'unpaid';

export type LeaveStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'cancelled';

export interface LeaveBalance {
  userId: string;
  year: number;
  annual: {
    total: number;
    used: number;
    remaining: number;
  };
  sick: {
    total: number;
    used: number;
    remaining: number;
  };
  emergency: {
    total: number;
    used: number;
    remaining: number;
  };
  compensatory: {
    total: number;
    used: number;
    remaining: number;
  };
}

export interface LeaveFilters {
  userId?: string;
  status?: LeaveStatus;
  leaveType?: LeaveType;
  startDate?: string;
  endDate?: string;
  department?: string;
}

// ==================== REPORTS & ANALYTICS ====================

export interface MonthlyReport {
  year: number;
  month: number;
  userId?: string;
  user?: User;
  summary: {
    totalWorkingDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    earlyDepartures: number;
    leaveDays: number;
    weekends: number;
    holidays: number;
  };
  attendanceRate: number;
  totalWorkHours: number;
  averageWorkHours: number;
  overtimeHours: number;
  details: DailyAttendance[];
}

export interface DailyAttendance {
  date: string;
  dayOfWeek: string;
  status: 'present' | 'absent' | 'late' | 'early_departure' | 'on_leave' | 'weekend' | 'holiday';
  checkInTime?: string;
  checkOutTime?: string;
  workHours?: number;
  breakTime?: number;
  overtimeHours?: number;
  notes?: string;
}

export interface DepartmentStats {
  department: string;
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  attendanceRate: number;
  averageWorkHours: number;
  lateArrivals: number;
  earlyDepartures: number;
}

export interface AttendanceTrend {
  date: string;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  leaveCount: number;
  attendanceRate: number;
}

// ==================== BULK OPERATIONS ====================

export interface BulkAttendanceUpdate {
  id: string;
  updates: {
    checkInTime?: string;
    checkOutTime?: string;
    status?: AttendanceRecord['status'];
    workHours?: number;
    notes?: string;
  };
}

export interface BulkUpdateResult {
  success: number;
  failed: number;
  errors: {
    id: string;
    error: string;
  }[];
}

// ==================== DASHBOARD ====================

export interface AttendanceDashboard {
  todayStats: {
    totalEmployees: number;
    present: number;
    absent: number;
    late: number;
    onLeave: number;
  };
  weeklyTrend: AttendanceTrend[];
  departmentBreakdown: DepartmentStats[];
  recentActivities: RecentActivity[];
  upcomingLeaves: LeaveRequest[];
  pendingApprovals: LeaveRequest[];
}

export interface RecentActivity {
  id: string;
  type: 'check_in' | 'check_out' | 'leave_request' | 'leave_approved' | 'leave_rejected';
  userId: string;
  userName: string;
  timestamp: string;
  details: string;
}

// ==================== CALENDAR ====================

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'leave' | 'holiday' | 'meeting' | 'event';
  userId?: string;
  userName?: string;
  status?: string;
  description?: string;
}

// ==================== NOTIFICATIONS ====================

export interface AttendanceNotification {
  id: string;
  type: 'late_arrival' | 'missing_checkout' | 'leave_request' | 'leave_approved' | 'leave_rejected';
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
} 