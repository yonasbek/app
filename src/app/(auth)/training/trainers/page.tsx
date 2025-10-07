'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trainingService } from '@/services/trainingService';
import {
  Trainer,
  TrainerFilters
} from '@/types/training';
import Card from '@/components/ui/Card';
import {
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Users,
  Phone,
  ChevronDown,
  MoreVertical
} from 'lucide-react';

export default function TrainersPage() {
  const router = useRouter();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TrainerFilters>({
    search: ''
  });

  useEffect(() => {
    loadTrainers();
  }, [filters]);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const data = await trainingService.getAllTrainers(filters);
      setTrainers(data);
    } catch (error) {
      console.error('Failed to load trainers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadTrainers();
  };

  const handleFilterChange = (key: keyof TrainerFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await trainingService.deleteTrainer(id);
        loadTrainers();
      } catch (error) {
        console.error('Failed to delete trainer:', error);
        alert('Failed to delete trainer. Please try again.');
      }
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    const colorClass = isActive 
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Trainers</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trainers</h1>
          <p className="text-gray-600 mt-1">Manage instructors and training staff</p>
        </div>
        <Link
          href="/training/trainers/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Trainer</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search trainers..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </form>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.is_active === undefined ? '' : filters.is_active ? 'active' : 'inactive'}
                  onChange={(e) => handleFilterChange('is_active', e.target.value === '' ? undefined : e.target.value === 'active')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Trainers Grid */}
      {trainers.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trainers found</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first trainer.</p>
          <Link
            href="/training/trainers/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Trainer</span>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <Card key={trainer.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {trainer.name}
                    </h3>
                    <p className="text-sm text-gray-600">{trainer.email}</p>
                    {getStatusBadge(trainer.is_active)}
                  </div>
                </div>
                <div className="relative">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {trainer.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{trainer.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/training/trainers/${trainer.id}`)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => router.push(`/training/trainers/${trainer.id}/edit`)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit Trainer"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(trainer.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete Trainer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="text-sm text-gray-500">
                  {trainer.courses?.length || 0} courses
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

