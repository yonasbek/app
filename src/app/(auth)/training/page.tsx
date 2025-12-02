'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { trainingService } from '@/services/trainingService';
import { Training, TrainingType, TrainingLocation } from '@/types/training';
import { formatToEthiopianDate } from '@/utils/ethiopianDateUtils';
import Card from '@/components/ui/Card';
import {
  BookOpen,
  Plus,
  Search,
  Calendar,
  MapPin,
  Users,
  FileText,
  Image as ImageIcon,
  FileCheck,
  Mail,
  Globe,
  Building,
  Filter,
  X
} from 'lucide-react';

export default function TrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<TrainingType | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState<TrainingLocation | 'all'>('all');

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      setLoading(true);
      const data = await trainingService.getAll();
      setTrainings(data);
    } catch (err) {
      setError('Failed to load trainings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainings = trainings.filter((training) => {
    const matchesSearch =
      training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.organizer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || training.type === typeFilter;
    const matchesLocation = locationFilter === 'all' || training.location_type === locationFilter;

    return matchesSearch && matchesType && matchesLocation;
  });

  const getTypeLabel = (type: TrainingType) => {
    const labels: Record<TrainingType, string> = {
      workshop: 'Workshop',
      event: 'Event',
      mentorship: 'Mentorship',
      field_trip: 'Field Trip',
      other: 'Other'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: TrainingType) => {
    const colors: Record<TrainingType, string> = {
      workshop: 'bg-blue-100 text-blue-800',
      event: 'bg-purple-100 text-purple-800',
      mentorship: 'bg-green-100 text-green-800',
      field_trip: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const stats = {
    total: trainings.length,
    local: trainings.filter(t => t.location_type === 'local').length,
    abroad: trainings.filter(t => t.location_type === 'abroad').length,
    workshops: trainings.filter(t => t.type === 'workshop').length,
    events: trainings.filter(t => t.type === 'event').length,
    mentorships: trainings.filter(t => t.type === 'mentorship').length,
    fieldTrips: trainings.filter(t => t.type === 'field_trip').length,
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trainings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100">
            <BookOpen className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Training Management</h1>
            <p className="text-gray-600 text-sm mt-1">
              Track and manage all training activities, workshops, events, and field trips
            </p>
          </div>
        </div>
        <Link
          href="/training/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Training</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Local</div>
          <div className="text-2xl font-bold text-blue-600">{stats.local}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Abroad</div>
          <div className="text-2xl font-bold text-purple-600">{stats.abroad}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Workshops</div>
          <div className="text-2xl font-bold text-green-600">{stats.workshops}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Events</div>
          <div className="text-2xl font-bold text-orange-600">{stats.events}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Mentorships</div>
          <div className="text-2xl font-bold text-indigo-600">{stats.mentorships}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Field Trips</div>
          <div className="text-2xl font-bold text-red-600">{stats.fieldTrips}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Other</div>
          <div className="text-2xl font-bold text-gray-600">
            {stats.total - stats.workshops - stats.events - stats.mentorships - stats.fieldTrips}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search trainings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TrainingType | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="workshop">Workshop</option>
            <option value="event">Event</option>
            <option value="mentorship">Mentorship</option>
            <option value="field_trip">Field Trip</option>
            <option value="other">Other</option>
          </select>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value as TrainingLocation | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Locations</option>
            <option value="local">Local</option>
            <option value="abroad">Abroad</option>
          </select>
          {(typeFilter !== 'all' || locationFilter !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setTypeFilter('all');
                setLocationFilter('all');
                setSearchTerm('');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </Card>

      {/* Trainings List */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {filteredTrainings.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Trainings Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || typeFilter !== 'all' || locationFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by creating your first training'}
          </p>
          {!searchTerm && typeFilter === 'all' && locationFilter === 'all' && (
            <Link
              href="/training/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Training</span>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainings.map((training) => (
            <Link
              key={training.id}
              href={`/training/${training.id}`}
              className="block"
            >
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">{training.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(training.type)}`}>
                    {getTypeLabel(training.type)}
                  </span>
                </div>

                {training.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{training.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatToEthiopianDate(training.start_date)} - {formatToEthiopianDate(training.end_date)}
                    </span>
                  </div>
                  {training.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {training.location_type === 'abroad' ? (
                        <Globe className="w-4 h-4" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                      <span>
                        {training.location_type === 'abroad' && training.country
                          ? `${training.location}, ${training.country}`
                          : training.location}
                      </span>
                    </div>
                  )}
                  {training.organizer && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{training.organizer}</span>
                    </div>
                  )}
                  {training.participants_count !== undefined && training.participants_count > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{training.participants_count} participants</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  {training.trip_report && training.trip_report.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FileText className="w-3 h-3" />
                      <span>{training.trip_report.length}</span>
                    </div>
                  )}
                  {training.photos && training.photos.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <ImageIcon className="w-3 h-3" />
                      <span>{training.photos.length}</span>
                    </div>
                  )}
                  {training.attendance && training.attendance.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FileCheck className="w-3 h-3" />
                      <span>{training.attendance.length}</span>
                    </div>
                  )}
                  {training.additional_letter && training.additional_letter.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Mail className="w-3 h-3" />
                      <span>{training.additional_letter.length}</span>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
