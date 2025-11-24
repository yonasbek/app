'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import { trainingService } from '@/services/trainingService';
import { Training } from '@/types/training';
import { formatToEthiopianDate } from '@/utils/ethiopianDateUtils';
import Card from '@/components/ui/Card';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Users,
  FileText,
  Image as ImageIcon,
  FileCheck,
  Mail,
  Globe,
  Building,
  Download,
  X
} from 'lucide-react';

export default function TrainingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadTraining();
  }, []);

  const loadTraining = async () => {
    try {
      setLoading(true);
      const data = await trainingService.getById(resolvedParams.id);
      setTraining(data);
    } catch (err) {
      setError('Failed to load training');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this training?')) return;
    
    try {
      setDeleting(true);
      await trainingService.delete(resolvedParams.id);
      router.push('/training');
    } catch (err) {
      setError('Failed to delete training');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteDocument = async (
    documentType: 'trip_report' | 'photos' | 'attendance' | 'additional_letter',
    fileName: string
  ) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await trainingService.deleteDocument(resolvedParams.id, documentType, fileName);
      loadTraining();
    } catch (err) {
      setError('Failed to delete document');
      console.error(err);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      workshop: 'Workshop',
      event: 'Event',
      mentorship: 'Mentorship',
      field_trip: 'Field Trip',
      other: 'Other'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      workshop: 'bg-blue-100 text-blue-800',
      event: 'bg-purple-100 text-purple-800',
      mentorship: 'bg-green-100 text-green-800',
      field_trip: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const downloadFile = (fileName: string) => {
    const normalizedUrl = fileName.replace(/\\/g, '/');
    window.open(`https://api-mo6f.onrender.com/upload/${normalizedUrl}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading training...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !training) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!training) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/training"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Trainings</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/training/${training.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Training Details */}
      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{training.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(training.type)}`}>
            {getTypeLabel(training.type)}
          </span>
        </div>

        {training.description && (
          <p className="text-gray-600 mb-6">{training.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Date Range</div>
              <div className="font-medium text-gray-900">
                {formatToEthiopianDate(training.start_date)} - {formatToEthiopianDate(training.end_date)}
              </div>
            </div>
          </div>

          {training.location && (
            <div className="flex items-center gap-3">
              {training.location_type === 'abroad' ? (
                <Globe className="w-5 h-5 text-gray-400" />
              ) : (
                <MapPin className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <div className="text-sm text-gray-500">Location</div>
                <div className="font-medium text-gray-900">
                  {training.location_type === 'abroad' && training.country
                    ? `${training.location}, ${training.country}`
                    : training.location}
                </div>
              </div>
            </div>
          )}

          {training.organizer && (
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Organizer/Instructor</div>
                <div className="font-medium text-gray-900">{training.organizer}</div>
              </div>
            </div>
          )}

          {training.participants_count !== undefined && training.participants_count > 0 && (
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Participants</div>
                <div className="font-medium text-gray-900">{training.participants_count}</div>
              </div>
            </div>
          )}
        </div>

        {training.remarks && (
          <div className="border-t pt-4">
            <div className="text-sm text-gray-500 mb-2">Remarks</div>
            <div className="text-gray-900">{training.remarks}</div>
          </div>
        )}
      </Card>

      {/* Documents */}
      <div className="space-y-6">
        {/* Trip Reports */}
        {training.trip_report && training.trip_report.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Trip Reports</h2>
            </div>
            <div className="space-y-2">
              {training.trip_report.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{file}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadFile(file)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument('trip_report', file)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Photos */}
        {training.photos && training.photos.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Photos</h2>
            </div>
            <div className="space-y-2">
              {training.photos.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{file}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadFile(file)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument('photos', file)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Attendance */}
        {training.attendance && training.attendance.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">Attendance</h2>
            </div>
            <div className="space-y-2">
              {training.attendance.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{file}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadFile(file)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument('attendance', file)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Additional Letters */}
        {training.additional_letter && training.additional_letter.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Additional Letters</h2>
            </div>
            <div className="space-y-2">
              {training.additional_letter.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{file}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadFile(file)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument('additional_letter', file)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

