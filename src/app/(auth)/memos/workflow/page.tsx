'use client';

import { useState, useEffect } from 'react';
import { Memo, MemoStatus } from '@/types/memo';
import { memoService } from '@/services/memoService';
import Link from 'next/link';

export default function MemoWorkflowPage() {
  const [pendingDeskHead, setPendingDeskHead] = useState<Memo[]>([]);
  const [pendingLEO, setPendingLEO] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingMemos();
  }, []);

  const loadPendingMemos = async () => {
    try {
      const [deskHeadMemos, leoMemos] = await Promise.all([
        memoService.getMemosPendingDeskHead(),
        memoService.getMemosPendingLEO()
      ]);
      setPendingDeskHead(deskHeadMemos);
      setPendingLEO(leoMemos);
    } catch (error) {
      console.error('Failed to load pending memos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: MemoStatus) => {
    switch (status) {
      case MemoStatus.PENDING_DESK_HEAD:
        return 'bg-yellow-100 text-yellow-800';
      case MemoStatus.PENDING_LEO:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Memo Workflow Dashboard</h1>
        <Link
          href="/memos"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          All Memos
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Desk Head Review */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Pending Desk Head Review ({pendingDeskHead.length})
            </h2>
          </div>
          <div className="p-6">
            {pendingDeskHead.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No memos pending desk head review</p>
            ) : (
              <div className="space-y-4">
                {pendingDeskHead.map((memo) => (
                  <div key={memo.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{memo.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(memo.status)}`}>
                        {memo.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{memo.department}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Submitted: {memo.submitted_to_desk_head_at 
                          ? new Date(memo.submitted_to_desk_head_at).toLocaleDateString()
                          : 'N/A'}
                      </span>
                      <Link
                        href={`/memos/${memo.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Review →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending LEO Review */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Pending LEO Review ({pendingLEO.length})
            </h2>
          </div>
          <div className="p-6">
            {pendingLEO.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No memos pending LEO review</p>
            ) : (
              <div className="space-y-4">
                {pendingLEO.map((memo) => (
                  <div key={memo.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{memo.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(memo.status)}`}>
                        {memo.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{memo.department}</p>
                    {memo.desk_head_comment && (
                      <p className="text-sm text-gray-700 mb-2 bg-gray-100 p-2 rounded">
                        <strong>Desk Head:</strong> {memo.desk_head_comment}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Submitted to LEO: {memo.submitted_to_leo_at 
                          ? new Date(memo.submitted_to_leo_at).toLocaleDateString()
                          : 'N/A'}
                      </span>
                      <Link
                        href={`/memos/${memo.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Review →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Workflow Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingDeskHead.length}</div>
            <div className="text-sm text-gray-600">Pending Desk Head</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{pendingLEO.length}</div>
            <div className="text-sm text-gray-600">Pending LEO</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{pendingDeskHead.length + pendingLEO.length}</div>
            <div className="text-sm text-gray-600">Total Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
} 