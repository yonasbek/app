'use client';

import { useEffect, useState } from 'react';
import reportService, { AllReports } from '../../../services/reportService';
import Card from '@/components/ui/Card';
import {
  FileText,
  Calendar,
  Users,
  FolderOpen,
  CheckSquare,
  Download,
  FileSpreadsheet,
  Loader2
} from 'lucide-react';

// Metric Card Component
function MetricCard({
  title,
  value,
  icon: Icon
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="border border-app-secondary bg-gradient-to-br from-app-accent/80 to-white shadow-md hover:shadow-lg transition-shadow duration-200 rounded-xl p-0 max-w-[220px] w-full mx-auto">
      <div className="flex items-center gap-3 px-3 py-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-app-primary/10 shadow-inner">
          <Icon className="w-5 h-5 text-app-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-app-foreground mb-0.5 ">{title}</p>
          <p className="text-xl font-extrabold text-app-foreground tracking-tight ">{value}</p>
        </div>
      </div>
    </Card>
  );
}

// Report Section Component
function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border border-app-secondary" padding="sm">
      <div className="px-2 py-2 border-b border-app-secondary mb-4">
        <h3 className="text-lg font-medium text-app-foreground">{title}</h3>
      </div>
      <div>{children}</div>
    </Card>
  );
}

// Table wrapper for consistent table structure
function AppTable({
  columns,
  children
}: {
  columns: { label: string; className?: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="rounded-xl border border-app-secondary overflow-hidden shadow-sm">
        <table className="min-w-full bg-app-foreground">
          <thead className="bg-app-secondary">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.label}
                  className={
                    col.className ??
                    'px-6 py-3 text-left text-xs font-semibold text-app-foreground uppercase tracking-wider'
                  }
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-app-secondary">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [reports, setReports] = useState<AllReports | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await reportService.getAllReports();
        setReports(data);
      } catch (err) {
        setError('Failed to fetch reports');
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportExcel = () => {
    // Placeholder for Excel export functionality
    alert('Excel export functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-app-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-app-primary animate-spin mx-auto" />
          <p className="mt-4 text-neutral-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-app-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-app-primary text-app-foreground rounded-lg hover:bg-app-secondary transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!reports) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-app-foreground mb-2">Dashboard Reports</h1>
          <p className="text-neutral-600">Comprehensive overview of system metrics and analytics</p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-app-primary text-app-accent rounded-md shadow-sm hover:bg-app-secondary hover:text-app-foreground transition-colors font-semibold focus-ring"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-app-secondary text-app-foreground rounded-md shadow-sm hover:bg-app-primary hover:text-app-accent transition-colors font-semibold focus-ring"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Top Section - Key Metrics */}
      <div>
        <h2 className="text-xl font-medium text-app-foreground mb-6">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard
            title="Active Memos"
            value={reports.dashboardMetrics.activeMemos}
            icon={FileText}
          />
          <MetricCard
            title="Upcoming Meetings"
            value={reports.dashboardMetrics.upcomingMeetings}
            icon={Calendar}
          />
          <MetricCard
            title="Attendance Today"
            value={`${reports.dashboardMetrics.attendanceToday}%`}
            icon={Users}
          />
          <MetricCard
            title="Documents (Month)"
            value={reports.dashboardMetrics.documentsUploadedThisMonth}
            icon={FolderOpen}
          />
          <MetricCard
            title="Tasks Due (Week)"
            value={reports.dashboardMetrics.tasksDueThisWeek}
            icon={CheckSquare}
          />
        </div>
      </div>

      {/* Mid Section - Lists and Tables */}
      <div className="space-y-8">
        {/* Memo Summary */}
        <ReportSection title="Memo Summary">
          <AppTable
            columns={[
              { label: 'Title' },
              { label: 'Type' },
              { label: 'Issued By' },
              { label: 'Date' },
              { label: 'Status' }
            ]}
          >
            {reports.memoSummary.map((memo, index) => (
              <tr
                key={index}
                className={`transition-colors group ${index % 2 === 0 ? 'bg-white' : 'bg-app-secondary'} hover:bg-app-accent`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-app-foreground group-hover:text-app-primary transition-colors">
                  {memo.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                  {memo.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                  {memo.issuedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                  {memo.dateIssued}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full
                      ${memo.status === 'Active'
                        ? 'bg-app-primary text-white'
                        : memo.status === 'Closed'
                          ? 'bg-app-secondary text-app-foreground'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    `}
                  >
                    {memo.status}
                  </span>
                </td>
              </tr>
            ))}
          </AppTable>
        </ReportSection>

        {/* Meeting Room Bookings */}
        <ReportSection title="Meeting Room Booking Overview">
          <AppTable
            columns={[
              { label: 'Room' },
              { label: 'Date' },
              { label: 'Time' },
              { label: 'Booked By' },
              { label: 'Meeting Title' },
              { label: 'Status' }
            ]}
          >
            {reports.meetingRoomBookings.map((booking, index) => {
              const isEvenRow = index % 2 === 0;
              const rowBgClass = isEvenRow ? 'bg-white' : 'bg-app-secondary';
              const statusStyles =
                booking.status === 'Scheduled'
                  ? 'bg-app-primary text-white'
                  : booking.status === 'Completed'
                    ? 'bg-app-secondary text-app-foreground'
                    : 'bg-yellow-100 text-yellow-800';

              return (
                <tr
                  key={index}
                  className={`transition-colors group ${rowBgClass} hover:bg-app-accent`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-app-foreground group-hover:text-app-primary transition-colors">
                    {booking.room}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {booking.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {booking.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {booking.bookedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {booking.meetingTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </AppTable>
        </ReportSection>

        {/* Document Library Insights */}
        <ReportSection title="Document Library Insights">
          <AppTable
            columns={[
              { label: 'Title' },
              { label: 'Uploaded By' },
              { label: 'Date' },
              { label: 'Category' },
              { label: 'Downloads' }
            ]}
          >
            {reports.documentLibraryInsights.map((doc, index) => {
              const isEvenRow = index % 2 === 0;
              const rowBgClass = isEvenRow ? 'bg-white' : 'bg-app-secondary';

              return (
                <tr
                  key={index}
                  className={`transition-colors group ${rowBgClass} hover:bg-app-accent`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-app-foreground group-hover:text-app-primary transition-colors">
                    {doc.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {doc.uploadedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {doc.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {doc.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {doc.downloads}
                  </td>
                </tr>
              );
            })}
          </AppTable>
        </ReportSection>

        {/* Task Tracking Snapshot */}
        <ReportSection title="Task Tracking Snapshot">
          <AppTable
            columns={[
              { label: 'Task Title' },
              { label: 'Assigned To' },
              { label: 'Due Date' },
              { label: 'Progress' },
              { label: 'Status' }
            ]}
          >
            {reports.taskTrackingSnapshot.map((task, index) => {
              const isEvenRow = index % 2 === 0;
              const rowBgClass = isEvenRow ? 'bg-white' : 'bg-app-secondary';

              let statusBgClass = '';
              switch (task.status) {
                case 'In Progress':
                  statusBgClass = 'bg-app-warning text-app-foreground';
                  break;
                case 'Completed':
                  statusBgClass = 'bg-app-success text-app-foreground';
                  break;
                default:
                  statusBgClass = 'bg-app-secondary text-app-foreground';
              }

              return (
                <tr
                  key={index}
                  className={`transition-colors group ${rowBgClass} hover:bg-app-accent`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-app-foreground group-hover:text-app-primary transition-colors">
                    {task.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {task.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {task.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    <div className="w-full bg-app-secondary rounded-full h-2">
                      <div
                        className="bg-app-primary h-2 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-neutral-600">{task.progress}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBgClass}`}
                    >
                      {task.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </AppTable>
        </ReportSection>

        {/* Attendance Analytics */}
        <ReportSection title="Attendance Analytics">
          <AppTable
            columns={[
              { label: 'Date' },
              { label: 'Present (%)' },
              { label: 'Absent (%)' },
              { label: 'Late (%)' },
              { label: 'WFH (%)' }
            ]}
          >
            {reports.attendanceAnalytics.dates.map((date, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-app-secondary'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-app-foreground">{date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{reports.attendanceAnalytics.present[index]}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{reports.attendanceAnalytics.absent[index]}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{reports.attendanceAnalytics.late[index]}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{reports.attendanceAnalytics.wfh[index]}%</td>
              </tr>
            ))}
          </AppTable>
        </ReportSection>
      </div>
    </div>
  );
}