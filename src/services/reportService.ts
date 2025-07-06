import api from '../utils/api';

export interface DashboardMetrics {
  activeMemos: number;
  upcomingMeetings: number;
  attendanceToday: number;
  documentsUploadedThisMonth: number;
  tasksDueThisWeek: number;
  totalUsers: number;
  totalRooms: number;
  totalBookings: number;
}

export interface MemoSummary {
  title: string;
  type: string;
  issuedBy: string;
  dateIssued: string;
  recipients: string[];
  status: string;
}

export interface MeetingRoomBooking {
  room: string;
  date: string;
  time: string;
  bookedBy: string;
  meetingTitle: string;
  status: string;
}

export interface DocumentLibraryInsight {
  title: string;
  uploadedBy: string;
  date: string;
  category: string;
  downloads: number;
}

export interface TaskTrackingSnapshot {
  title: string;
  assignedTo: string;
  dueDate: string;
  progress: number;
  status: string;
}

export interface AttendanceAnalytics {
  dates: string[];
  present: number[];
  absent: number[];
  late: number[];
  wfh: number[];
}

export interface AllReports {
  dashboardMetrics: DashboardMetrics;
  memoSummary: MemoSummary[];
  meetingRoomBookings: MeetingRoomBooking[];
  documentLibraryInsights: DocumentLibraryInsight[];
  taskTrackingSnapshot: TaskTrackingSnapshot[];
  attendanceAnalytics: AttendanceAnalytics;
}

class ReportService {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await api.get('/reports/dashboard-metrics');
    return response.data;
  }

  async getMemoSummary(): Promise<MemoSummary[]> {
    const response = await api.get('/reports/memo-summary');
    return response.data;
  }

  async getMeetingRoomBookings(): Promise<MeetingRoomBooking[]> {
    const response = await api.get('/reports/meeting-room-bookings');
    return response.data;
  }

  async getDocumentLibraryInsights(): Promise<DocumentLibraryInsight[]> {
    const response = await api.get('/reports/document-library-insights');
    return response.data;
  }

  async getTaskTrackingSnapshot(): Promise<TaskTrackingSnapshot[]> {
    const response = await api.get('/reports/task-tracking-snapshot');
    return response.data;
  }

  async getAttendanceAnalytics(): Promise<AttendanceAnalytics> {
    const response = await api.get('/reports/attendance-analytics');
    return response.data;
  }

  async getAllReports(): Promise<AllReports> {
    const response = await api.get('/reports/all');
    return response.data;
  }
}

export default new ReportService(); 