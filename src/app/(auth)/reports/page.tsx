'use client';

import { useEffect, useState } from 'react';
import reportService, { AllReports } from '../../../services/reportService';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!reports) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Reports</h1>
            <p className="text-gray-600">Comprehensive overview of system metrics and analytics</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Export as PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Export as Excel
            </button>
          </div>
        </div>

        {/* Top Section - Key Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Performance Indicators</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <MetricCard 
              title="Active Memos" 
              value={reports.dashboardMetrics.activeMemos}
              icon="📝"
              color="bg-blue-500"
            />
            <MetricCard 
              title="Upcoming Meetings" 
              value={reports.dashboardMetrics.upcomingMeetings}
              icon="📅"
              color="bg-green-500"
            />
            <MetricCard 
              title="Attendance Today" 
              value={`${reports.dashboardMetrics.attendanceToday}%`}
              icon="👥"
              color="bg-yellow-500"
            />
            <MetricCard 
              title="Documents (Month)" 
              value={reports.dashboardMetrics.documentsUploadedThisMonth}
              icon="📄"
              color="bg-purple-500"
            />
            <MetricCard 
              title="Tasks Due (Week)" 
              value={reports.dashboardMetrics.tasksDueThisWeek}
              icon="✅"
              color="bg-red-500"
            />
          </div>
        </div>

        {/* Mid Section - Lists and Tables */}
        <div className="space-y-8">
          {/* Memo Summary */}
          <ReportSection title="Memo Summary">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.memoSummary.map((memo, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{memo.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{memo.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{memo.issuedBy}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{memo.dateIssued}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {memo.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportSection>

          {/* Meeting Room Bookings */}
          <ReportSection title="Meeting Room Booking Overview">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.meetingRoomBookings.map((booking, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.room}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.bookedBy}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.meetingTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportSection>

          {/* Document Library Insights */}
          <ReportSection title="Document Library Insights">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.documentLibraryInsights.map((doc, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.uploadedBy}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.downloads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportSection>

          {/* Task Tracking Snapshot */}
          <ReportSection title="Task Tracking Snapshot">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.taskTrackingSnapshot.map((task, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.assignedTo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{task.progress}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                          task.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportSection>

          {/* Attendance Analytics */}
          <ReportSection title="Attendance Analytics">
            <div className="bg-white p-6">
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Weekly Attendance Overview</h4>
                <div className="grid grid-cols-5 gap-4">
                  {reports.attendanceAnalytics.dates.map((date, index) => (
                    <div key={index} className="text-center">
                      <div className="text-sm font-medium text-gray-700">{date}</div>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Present:</span>
                          <span className="font-medium text-green-600">{reports.attendanceAnalytics.present[index]}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Absent:</span>
                          <span className="font-medium text-red-600">{reports.attendanceAnalytics.absent[index]}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Late:</span>
                          <span className="font-medium text-yellow-600">{reports.attendanceAnalytics.late[index]}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>WFH:</span>
                          <span className="font-medium text-blue-600">{reports.attendanceAnalytics.wfh[index]}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ReportSection>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, icon, color }: { 
  title: string; 
  value: string | number; 
  icon: string; 
  color: string; 
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${color} rounded-md p-3`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-500">{title}</div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
}

// Report Section Component
function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
} 