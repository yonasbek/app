'use client';

import { useState, useEffect } from 'react';
import { Memo, MemoStatus, PriorityLevel } from '@/types/memo';
import { memoService } from '@/services/memoService';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import {
  Search,
  Plus,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Filter,
  ArrowRight,
  Eye,
  Edit3
} from 'lucide-react';

export default function MemoList() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMemos();
  }, []);

  const loadMemos = async () => {
    try {
      const data = await memoService.getAll();
      setMemos(data);
    } catch (error) {
      console.error('Failed to load memos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMemos = memos.filter(memo =>
    memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memo.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: MemoStatus) => {
    switch (status) {
      case MemoStatus.APPROVED:
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case MemoStatus.REJECTED:
        return { color: 'bg-red-100 text-red-800', icon: AlertTriangle };
      case MemoStatus.PENDING:
        return { color: 'bg-amber-100 text-amber-800', icon: Clock };
      default:
        return { color: 'bg-neutral-100 text-neutral-800', icon: FileText };
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case PriorityLevel.URGENT:
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle };
      case PriorityLevel.CONFIDENTIAL:
        return { color: 'bg-app-primary-light bg-opacity-20 text-app-primary border-app-primary', icon: Eye };
      default:
        return { color: 'bg-app-accent text-app-foreground border-app-secondary', icon: FileText };
    }
  };

  const statusCounts = {
    approved: memos.filter(m => m.status === MemoStatus.APPROVED).length,
    pending: memos.filter(m => m.status === MemoStatus.PENDING).length,
    rejected: memos.filter(m => m.status === MemoStatus.REJECTED).length,
    urgent: memos.filter(m => m.priority_level === PriorityLevel.URGENT).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 gradient-primary rounded-full animate-pulse"></div>
          <p className="text-gray-600">Loading memos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Memos & Proposals</h1>
          <p className="text-gray-600">Manage organizational memos and proposals</p>
        </div>
        <Link
          href="/memos/create"
          className="px-6 py-3 gradient-primary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Memo</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-green-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.approved}</p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </div>
        </Card>

        <Card className="border border-amber-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </Card>

        <Card className="border border-red-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.urgent}</p>
              <p className="text-sm text-gray-600">Urgent</p>
            </div>
          </div>
        </Card>

        <Card className="border border-blue-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{memos.length}</p>
              <p className="text-sm text-gray-600">Total Memos</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search memos by title or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>
      </Card>

      {/* Memos Grid */}
      <div className="space-y-6">
        {filteredMemos.length === 0 ? (
          <Card className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No memos found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first memo</p>
            <Link
              href="/memos/create"
              className="inline-flex items-center space-x-2 px-6 py-3 gradient-primary text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Memo</span>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredMemos.map((memo) => {
              const statusBadge = getStatusBadge(memo.status);
              const priorityBadge = getPriorityBadge(memo.priority_level);
              const StatusIcon = statusBadge.icon;
              const PriorityIcon = priorityBadge.icon;

              return (
                <Card key={memo.id} hover={true} className="group">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {memo.title}
                          </h2>
                          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityBadge.color}`}>
                            <PriorityIcon className="w-3 h-3 mr-1" />
                            {memo.priority_level}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{memo.department}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(memo.date_of_issue).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
                        <StatusIcon className="w-4 h-4 mr-1" />
                        {memo.status}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        Last updated {new Date(memo.date_of_issue).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/memos/${memo.id}/edit`}
                          className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </Link>
                        <Link
                          href={`/memos/${memo.id}`}
                          className="flex items-center space-x-1 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}