'use client';

import { useState, useEffect } from 'react';
import { Memo, MemoStatus, WorkflowAction, WorkflowActionDto, WorkflowHistory } from '@/types/memo';
import { memoService } from '@/services/memoService';
import { formatToEthiopianDate, formatToEthiopianDateTime } from '@/utils/ethiopianDateUtils';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  FileCheck,
  Printer,
  MessageSquare,
  Clock,
  User2,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface MemoWorkflowProps {
  memo: Memo;
  onMemoUpdate: (updatedMemo: Memo) => void;
  userRole?: string; // 'DESK_HEAD' | 'LEO' | 'CREATOR'
}

export default function MemoWorkflow({ memo, onMemoUpdate, userRole }: MemoWorkflowProps) {
  const [workflowHistory, setWorkflowHistory] = useState<WorkflowHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<WorkflowAction | null>(null);

  useEffect(() => {
    loadWorkflowHistory();
  }, [memo.id]);

  const loadWorkflowHistory = async () => {
    try {
      const history = await memoService.getWorkflowHistory(memo.id);
      setWorkflowHistory(history);
    } catch (error) {
      console.error('Failed to load workflow history:', error);
    }
  };

  const handleWorkflowAction = async () => {
    if (!selectedAction || !comment.trim()) return;

    setLoading(true);
    try {
      const actionDto: WorkflowActionDto = {
        action: selectedAction,
        comment: comment.trim()
      };

      let updatedMemo: Memo;
      if (actionDto.action === WorkflowAction.APPROVE) {
        updatedMemo = await memoService.leoAction(memo.id, actionDto);
      } else if (actionDto.action === WorkflowAction.REJECT) {
        updatedMemo = await memoService.leoAction(memo.id, actionDto);
      } else if (actionDto.action === WorkflowAction.RETURN_TO_CREATOR) {
        updatedMemo = await memoService.leoAction(memo.id, actionDto);
      } else {
        if (actionDto.action === WorkflowAction.SUBMIT_TO_LEO) {
          updatedMemo = await memoService.deskHeadAction(memo.id, actionDto);
        } else if (actionDto.action === WorkflowAction.SUBMIT_TO_DESK_HEAD) {
          updatedMemo = await memoService.deskHeadAction(memo.id, actionDto);
        } else {
          throw new Error('Unauthorized action');
        }
      }
      // if (userRole === 'DESK_HEAD') {
      //   updatedMemo = await memoService.deskHeadAction(memo.id, actionDto);
      // } else if (userRole === 'LEO') {
      //   updatedMemo = await memoService.leoAction(memo.id, actionDto);
      // } else {
      //   throw new Error('Unauthorized action');
      // }

      onMemoUpdate(updatedMemo);
      setComment('');
      setShowActionModal(false);
      setSelectedAction(null);
      await loadWorkflowHistory();
    } catch (error) {
      console.error('Failed to perform workflow action:', error);
      alert('Failed to perform action. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitToDeskHead = async () => {
    setLoading(true);
    try {
      const updatedMemo = await memoService.submitToDeskHead(memo.id);
      onMemoUpdate(updatedMemo);
      await loadWorkflowHistory();
    } catch (error) {
      console.error('Failed to submit to desk head:', error);
      alert('Failed to submit to desk head. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDocument = async () => {
    try {
      await memoService.openDocumentForPrinting(memo.id);
    } catch (error) {
      console.error('Failed to generate document:', error);
      alert('Failed to generate document. Please try again.');
    }
  };

  const openActionModal = (action: WorkflowAction) => {
    setSelectedAction(action);
    setShowActionModal(true);
    setComment('');
  };

  const getStatusInfo = (status: MemoStatus) => {
    switch (status) {
      case MemoStatus.DRAFT:
        return {
          color: 'bg-slate-500',
          label: 'Draft',
          icon: FileCheck,
          description: 'Document in draft stage'
        };
      case MemoStatus.PENDING_DESK_HEAD:
        return {
          color: 'bg-amber-500',
          label: 'Pending Desk Head',
          icon: Clock,
          description: 'Awaiting desk head review'
        };
      case MemoStatus.PENDING_LEO:
        return {
          color: 'bg-blue-500',
          label: 'Pending LEO',
          icon: Clock,
          description: 'Awaiting LEO approval'
        };
      case MemoStatus.APPROVED:
        return {
          color: 'bg-emerald-500',
          label: 'Approved',
          icon: CheckCircle2,
          description: 'Document approved'
        };
      case MemoStatus.RETURNED_TO_CREATOR:
        return {
          color: 'bg-orange-500',
          label: 'Returned',
          icon: RotateCcw,
          description: 'Returned for revisions'
        };
      case MemoStatus.REJECTED:
        return {
          color: 'bg-rose-500',
          label: 'Rejected',
          icon: XCircle,
          description: 'Document rejected'
        };
      default:
        return {
          color: 'bg-slate-500',
          label: 'Unknown',
          icon: AlertCircle,
          description: 'Status unknown'
        };
    }
  };

  const canSubmitToDeskHead = memo.status === MemoStatus.DRAFT || memo.status === MemoStatus.RETURNED_TO_CREATOR;
  const canPerformDeskHeadAction = memo.status === MemoStatus.PENDING_DESK_HEAD && userRole === 'DESK_HEAD';
  const canPerformLeoAction = memo.status === MemoStatus.PENDING_LEO && userRole === 'LEO';
  const canGenerateDocument = memo.status === MemoStatus.APPROVED;

  const statusInfo = getStatusInfo(memo.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Current Status Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-app-accent to-app-accent px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Workflow Status</h2>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 ${statusInfo.color} rounded-xl flex items-center justify-center shadow-lg`}>
              <StatusIcon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{statusInfo.label}</h3>
              <p className="text-sm text-gray-600">{statusInfo.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-app-accent to-app-accent px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
        </div>

        <div className="p-6 space-y-3">
          {canSubmitToDeskHead && (
            <button
              onClick={handleSubmitToDeskHead}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-app-foreground text-white px-4 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <Send className="w-5 h-5" />
              <span>Submit to Desk Head</span>
            </button>
          )}

          {/* {canPerformDeskHeadAction && ( */}
          <>
            <button
              onClick={() => openActionModal(WorkflowAction.SUBMIT_TO_LEO)}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-3 rounded-lg hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <ArrowRight className="w-5 h-5" />
              <span>Forward to LEO</span>
            </button>
            <button
              onClick={() => openActionModal(WorkflowAction.RETURN_TO_CREATOR)}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-3 rounded-lg hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Return to Creator</span>
            </button>
            <button
              onClick={() => openActionModal(WorkflowAction.REJECT)}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white px-4 py-3 rounded-lg hover:from-rose-700 hover:to-rose-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <XCircle className="w-5 h-5" />
              <span>Reject</span>
            </button>
          </>
          {/* )} */}

          {/* {canPerformLeoAction && ( */}
          <>
            <button
              onClick={() => openActionModal(WorkflowAction.APPROVE)}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-3 rounded-lg hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Approve</span>
            </button>
          </>
          {/* )} */}

          {/* {canGenerateDocument && ( */}
          <button
            onClick={handleGenerateDocument}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            <Printer className="w-5 h-5" />
            <span>Generate & Print Document</span>
          </button>
          {/* )} */}
        </div>
      </div>

      {/* Workflow History */}
      {workflowHistory && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-app-accent to-app-accent px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Workflow Timeline</h3>
          </div>

          <div className="p-6">
            <div className="relative space-y-6">
              {/* Timeline line */}
              <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-gradient-to-b from-blue-200 to-gray-200"></div>

              {/* Created */}
              <div className="relative flex items-start space-x-4">
                <div className="relative z-10 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">Created</h4>
                    <span className="text-xs text-gray-500">
                      {formatToEthiopianDate(workflowHistory.createdAt, 'short')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatToEthiopianDateTime(workflowHistory.createdAt, true)}
                  </p>
                </div>
              </div>

              {/* Submitted to Desk Head */}
              {workflowHistory.submittedToDeskHeadAt && (
                <div className="relative flex items-start space-x-4">
                  <div className="relative z-10 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">Submitted to Desk Head</h4>
                      <span className="text-xs text-gray-500">
                        {formatToEthiopianDate(workflowHistory.submittedToDeskHeadAt, 'short')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatToEthiopianDateTime(workflowHistory.submittedToDeskHeadAt, true)}
                    </p>
                  </div>
                </div>
              )}

              {/* Desk Head Review */}
              {workflowHistory.deskHeadReview && (
                <div className="relative flex items-start space-x-4">
                  <div className="relative z-10 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <User2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Desk Head Review</h4>
                      <span className="text-xs text-gray-500">
                        {formatToEthiopianDate(workflowHistory.deskHeadReview.reviewedAt, 'short')}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-700">
                        <User2 className="w-4 h-4 mr-2" />
                        <span className="font-medium">
                          {workflowHistory.deskHeadReview.reviewerName || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-start space-x-2 bg-white rounded-lg p-3">
                        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{workflowHistory.deskHeadReview.comment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submitted to LEO */}
              {workflowHistory.submittedToLeoAt && (
                <div className="relative flex items-start space-x-4">
                  <div className="relative z-10 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">Submitted to LEO</h4>
                      <span className="text-xs text-gray-500">
                        {formatToEthiopianDate(workflowHistory.submittedToLeoAt, 'short')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatToEthiopianDateTime(workflowHistory.submittedToLeoAt, true)}
                    </p>
                  </div>
                </div>
              )}

              {/* LEO Review */}
              {workflowHistory.leoReview && (
                <div className="relative flex items-start space-x-4">
                  <div className="relative z-10 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                    <User2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">LEO Review</h4>
                      <span className="text-xs text-gray-500">
                        {formatToEthiopianDate(workflowHistory.leoReview.reviewedAt, 'short')}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-700">
                        <User2 className="w-4 h-4 mr-2" />
                        <span className="font-medium">
                          {workflowHistory.leoReview.reviewerName || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-start space-x-2 bg-white rounded-lg p-3">
                        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{workflowHistory.leoReview.comment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Approved */}
              {workflowHistory.approvedAt && (
                <div className="relative flex items-start space-x-4">
                  <div className="relative z-10 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">Approved</h4>
                      <span className="text-xs text-gray-500">
                        {formatToEthiopianDate(workflowHistory.approvedAt, 'short')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatToEthiopianDateTime(workflowHistory.approvedAt, true)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn">
            <div className="bg-gradient-to-r from-app-foreground to-app-primary px-6 py-5 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white">
                {selectedAction?.replace(/_/g, ' ')}
              </h3>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Comment *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-app-foreground focus:border-transparent transition-all resize-none"
                  placeholder="Enter your comment here..."
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  Please provide a detailed comment for this action.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowActionModal(false)}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWorkflowAction}
                  disabled={loading || !comment.trim()}
                  className="flex-1 px-6 py-3 bg-app-foreground text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 