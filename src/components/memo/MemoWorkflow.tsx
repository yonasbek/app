'use client';

import { useState, useEffect } from 'react';
import { Memo, MemoStatus, WorkflowAction, WorkflowActionDto, WorkflowHistory } from '@/types/memo';
import { memoService } from '@/services/memoService';

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
      if(actionDto.action === WorkflowAction.APPROVE) {
        updatedMemo = await memoService.leoAction(memo.id, actionDto);
      } else if(actionDto.action === WorkflowAction.REJECT) {
        updatedMemo = await memoService.leoAction(memo.id, actionDto);
      } else if(actionDto.action === WorkflowAction.RETURN_TO_CREATOR) {
        updatedMemo = await memoService.leoAction(memo.id, actionDto);
      } else {
        if(actionDto.action === WorkflowAction.SUBMIT_TO_LEO) {
          updatedMemo = await memoService.deskHeadAction(memo.id, actionDto);
        } else if(actionDto.action === WorkflowAction.SUBMIT_TO_DESK_HEAD) {
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

  const getStatusColor = (status: MemoStatus) => {
    switch (status) {
      case MemoStatus.DRAFT:
        return 'bg-gray-100 text-gray-800';
      case MemoStatus.PENDING_DESK_HEAD:
        return 'bg-yellow-100 text-yellow-800';
      case MemoStatus.PENDING_LEO:
        return 'bg-blue-100 text-blue-800';
      case MemoStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case MemoStatus.RETURNED_TO_CREATOR:
        return 'bg-orange-100 text-orange-800';
      case MemoStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canSubmitToDeskHead = memo.status === MemoStatus.DRAFT || memo.status === MemoStatus.RETURNED_TO_CREATOR;
  const canPerformDeskHeadAction = memo.status === MemoStatus.PENDING_DESK_HEAD && userRole === 'DESK_HEAD';
  const canPerformLeoAction = memo.status === MemoStatus.PENDING_LEO && userRole === 'LEO';
  const canGenerateDocument = memo.status === MemoStatus.APPROVED;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Memo Workflow</h2>
      
      {/* Current Status */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(memo.status)}`}>
          {memo.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 space-y-2">
        {canSubmitToDeskHead && (
          <button
            onClick={handleSubmitToDeskHead}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Submit to Desk Head
          </button>
        )}

        {/* {canPerformDeskHeadAction && ( */}
          <div className="space-y-2">
            <button
              onClick={() => openActionModal(WorkflowAction.SUBMIT_TO_LEO)}
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Forward to LEO
            </button>
            <button
              onClick={() => openActionModal(WorkflowAction.RETURN_TO_CREATOR)}
              disabled={loading}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
            >
              Return to Creator
            </button>
            <button
              onClick={() => openActionModal(WorkflowAction.REJECT)}
              disabled={loading}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        {/* )} */}

        {/* {canPerformLeoAction && ( */}
          <div className="space-y-2">
            <button
              onClick={() => openActionModal(WorkflowAction.APPROVE)}
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => openActionModal(WorkflowAction.RETURN_TO_CREATOR)}
              disabled={loading}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
            >
              Return to Creator
            </button>
            <button
              onClick={() => openActionModal(WorkflowAction.REJECT)}
              disabled={loading}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        {/* )} */}

        {/* {canGenerateDocument && ( */}
          <button
            onClick={handleGenerateDocument}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Generate & Print Document
          </button>
        {/* )} */}
      </div>

      {/* Workflow History */}
      {workflowHistory && (
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3">Workflow History</h3>
          <div className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">Created:</span> {new Date(workflowHistory.createdAt).toLocaleString()}
            </div>
            
            {workflowHistory.submittedToDeskHeadAt && (
              <div className="text-sm">
                <span className="font-medium">Submitted to Desk Head:</span> {new Date(workflowHistory.submittedToDeskHeadAt).toLocaleString()}
              </div>
            )}
            
            {workflowHistory.deskHeadReview && (
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm font-medium">Desk Head Review</div>
                <div className="text-sm text-gray-600">
                  Reviewed by: {workflowHistory.deskHeadReview.reviewerName || 'Unknown'}
                </div>
                <div className="text-sm text-gray-600">
                  Date: {new Date(workflowHistory.deskHeadReview.reviewedAt).toLocaleString()}
                </div>
                <div className="text-sm mt-1">
                  Comment: {workflowHistory.deskHeadReview.comment}
                </div>
              </div>
            )}
            
            {workflowHistory.submittedToLeoAt && (
              <div className="text-sm">
                <span className="font-medium">Submitted to LEO:</span> {new Date(workflowHistory.submittedToLeoAt).toLocaleString()}
              </div>
            )}
            
            {workflowHistory.leoReview && (
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm font-medium">LEO Review</div>
                <div className="text-sm text-gray-600">
                  Reviewed by: {workflowHistory.leoReview.reviewerName || 'Unknown'}
                </div>
                <div className="text-sm text-gray-600">
                  Date: {new Date(workflowHistory.leoReview.reviewedAt).toLocaleString()}
                </div>
                <div className="text-sm mt-1">
                  Comment: {workflowHistory.leoReview.comment}
                </div>
              </div>
            )}
            
            {workflowHistory.approvedAt && (
              <div className="text-sm">
                <span className="font-medium">Approved:</span> {new Date(workflowHistory.approvedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {selectedAction?.replace(/_/g, ' ')}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your comment..."
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleWorkflowAction}
                disabled={loading || !comment.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm'}
              </button>
              <button
                onClick={() => setShowActionModal(false)}
                disabled={loading}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 