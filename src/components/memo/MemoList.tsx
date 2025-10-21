'use client';

import { useState, useEffect } from 'react';
import { Memo, MemoStatus, PriorityLevel } from '@/types/memo';
import { memoService } from '@/services/memoService';
import Card from '@/components/ui/Card';
import { formatToEthiopianDate } from '@/utils/ethiopianDateUtils';
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
  Edit3,
  X,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

type FilterTab = 'all' | 'approved' | 'pending' | 'rejected' | 'urgent';

export default function MemoList() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [showFilters, setShowFilters] = useState(false);

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

  const getFilteredMemos = () => {
    let filtered = memos.filter(memo =>
      memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memo.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (activeTab) {
      case 'approved':
        return filtered.filter(m => m.status === MemoStatus.APPROVED);
      case 'pending':
        return filtered.filter(m =>
          m.status === MemoStatus.PENDING_DESK_HEAD ||
          m.status === MemoStatus.PENDING_LEO
        );
      case 'rejected':
        return filtered.filter(m => m.status === MemoStatus.REJECTED);
      case 'urgent':
        return filtered.filter(m => m.priority_level === PriorityLevel.URGENT);
      default:
        return filtered;
    }
  };

  const filteredMemos = getFilteredMemos();

  const getStatusBadge = (status: MemoStatus) => {
    switch (status) {
      case MemoStatus.APPROVED:
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle,
          dotColor: 'bg-emerald-500'
        };
      case MemoStatus.REJECTED:
        return {
          color: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: AlertTriangle,
          dotColor: 'bg-rose-500'
        };
      case MemoStatus.PENDING_DESK_HEAD:
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
          dotColor: 'bg-amber-500'
        };
      case MemoStatus.PENDING_LEO:
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Clock,
          dotColor: 'bg-blue-500'
        };
      default:
        return {
          color: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: FileText,
          dotColor: 'bg-slate-500'
        };
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case PriorityLevel.URGENT:
        return {
          color: 'bg-rose-500 text-white shadow-sm shadow-rose-200',
          icon: AlertTriangle,
          pulse: true
        };
      case PriorityLevel.CONFIDENTIAL:
        return {
          color: 'bg-purple-500 text-white shadow-sm shadow-purple-200',
          icon: Eye,
          pulse: false
        };
      default:
        return {
          color: 'bg-slate-500 text-white',
          icon: FileText,
          pulse: false
        };
    }
  };

  const statusCounts = {
    all: memos.length,
    approved: memos.filter(m => m.status === MemoStatus.APPROVED).length,
    pending: memos.filter(m =>
      m.status === MemoStatus.PENDING_DESK_HEAD ||
      m.status === MemoStatus.PENDING_LEO
    ).length,
    rejected: memos.filter(m => m.status === MemoStatus.REJECTED).length,
    urgent: memos.filter(m => m.priority_level === PriorityLevel.URGENT).length,
  };

  const tabs: { id: FilterTab; label: string; count: number; icon: typeof FileText }[] = [
    { id: 'all', label: 'All Memos', count: statusCounts.all, icon: FileText },
    { id: 'approved', label: 'Approved', count: statusCounts.approved, icon: CheckCircle },
    { id: 'pending', label: 'Pending', count: statusCounts.pending, icon: Clock },
    { id: 'urgent', label: 'Urgent', count: statusCounts.urgent, icon: AlertTriangle },
    { id: 'rejected', label: 'Rejected', count: statusCounts.rejected, icon: X },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading memos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with Gradient Background */}
      <div className="relative overflow-hidden  bg-gradient-to-br ">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-6 h-6 text-app-foreground" />
              <span className="text-app-foreground text-sm font-medium">Document Management</span>
            </div>
            <h1 className="text-4xl font-bold text-app-foreground mb-2">Memos & Proposals</h1>
            <p className="text-app-foreground">Manage and track organizational communications</p>
          </div>
          <Link
            href="/memos/create"
            className="mt-6 sm:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-app-foreground text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Create Memo</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Approved Card */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 mb-0.5">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.approved}</p>
            </div>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 mb-0.5">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.pending}</p>
            </div>
          </div>
        </div>

        {/* Urgent Card */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 mb-0.5">Urgent</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.urgent}</p>
            </div>
          </div>
        </div>

        {/* Total Card */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-app-accent rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-app-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 mb-0.5">Total</p>
              <p className="text-2xl font-bold text-gray-900">{memos.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search memos by title, department, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-app-foreground focus:border-transparent transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${isActive
                  ? 'border-app-foreground text-app-foreground bg-app-accent'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isActive ? 'bg-app-foreground text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Memos List */}
      <div className="space-y-4">
        {filteredMemos.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No memos found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search or filters"
                : "Get started by creating your first memo"
              }
            </p>
            {!searchTerm && (
              <Link
                href="/memos/create"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-app-foreground text-white rounded-lg hover:opacity-90 transition-all font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Memo</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMemos.map((memo) => {
              const statusBadge = getStatusBadge(memo.status);
              const priorityBadge = getPriorityBadge(memo.priority_level);
              const StatusIcon = statusBadge.icon;
              const PriorityIcon = priorityBadge.icon;

              return (
                <div
                  key={memo.id}
                  className="bg-white rounded-xl border border-gray-200 hover:border-app-foreground/30 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <Link href={`/memos/${memo.id}`} className="block flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-app-foreground transition-colors truncate">
                              {memo.title}
                            </h3>
                          </Link>
                          {priorityBadge.pulse && (
                            <div className={`flex items-center px-3 py-1 rounded-full text-xs font-bold ${priorityBadge.color} animate-pulse`}>
                              <PriorityIcon className="w-3 h-3 mr-1" />
                              {memo.priority_level}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1.5">
                            <div className="w-8 h-8 bg-gradient-to-br from-app-foreground to-app-primary rounded-lg flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium">{memo.department}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatToEthiopianDate(memo.date_of_issue, 'medium')}</span>
                          </div>
                          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor} animate-pulse`}></div>
                            <StatusIcon className="w-3 h-3" />
                            <span>{memo.status.replace(/_/g, ' ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        Updated {formatToEthiopianDate(memo.date_of_issue, 'short')}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/memos/${memo.id}/edit`}
                          className="flex items-center space-x-1.5 px-4 py-2 text-app-foreground bg-app-accent rounded-lg hover:opacity-80 transition-all text-sm font-medium"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                        <Link
                          href={`/memos/${memo.id}`}
                          className="flex items-center space-x-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium group"
                        >
                          <span>View</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}