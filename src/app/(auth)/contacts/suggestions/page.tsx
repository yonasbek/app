'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { contactService } from '@/services/contactService';
import { 
  ContactSuggestion, 
  SuggestionStatus, 
  SuggestionType, 
  SUGGESTION_STATUS_LABELS, 
  SUGGESTION_TYPE_LABELS 
} from '@/types/contact';

// SVG Icons
const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
  </svg>
);

export default function ContactSuggestionsPage() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<ContactSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<ContactSuggestion | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  const isAdmin = contactService.isAdmin();

  useEffect(() => {
    loadSuggestions();
  }, [statusFilter]);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      const data = await contactService.getSuggestions(statusFilter);
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (suggestionId: string, action: 'approve' | 'reject') => {
    setIsReviewing(true);
    try {
      await contactService.reviewSuggestion(suggestionId, action, reviewComment);
      setSelectedSuggestion(null);
      setReviewComment('');
      loadSuggestions();
    } catch (error) {
      console.error('Failed to review suggestion:', error);
    } finally {
      setIsReviewing(false);
    }
  };

  const getStatusColor = (status: SuggestionStatus) => {
    switch (status) {
      case SuggestionStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case SuggestionStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case SuggestionStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: SuggestionType) => {
    switch (type) {
      case SuggestionType.ADD:
        return 'bg-blue-100 text-blue-800';
      case SuggestionType.UPDATE:
        return 'bg-purple-100 text-purple-800';
      case SuggestionType.DELETE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Suggestions</h1>
          <p className="text-gray-600 mt-1">
            {isAdmin ? 'Review and manage contact suggestions' : 'View your contact suggestions'}
          </p>
        </div>
        <button
          onClick={() => router.push('/contacts')}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Back to Directory
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FilterIcon />
              <span className="text-sm font-medium">Filter by Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              {Object.entries(SUGGESTION_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {suggestions.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <div className="text-gray-500">No suggestions found</div>
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(suggestion.type)}`}>
                    {SUGGESTION_TYPE_LABELS[suggestion.type]}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(suggestion.status)}`}>
                    {SUGGESTION_STATUS_LABELS[suggestion.status]}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(suggestion.createdAt)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Suggested Changes</h3>
                  <div className="space-y-2 text-sm">
                    {suggestion.suggestedData.instituteName && (
                      <div>
                        <span className="font-medium">Institution:</span> {suggestion.suggestedData.instituteName}
                      </div>
                    )}
                    {suggestion.suggestedData.individualName && (
                      <div>
                        <span className="font-medium">Individual:</span> {suggestion.suggestedData.individualName}
                      </div>
                    )}
                    {suggestion.suggestedData.emailAddress && (
                      <div>
                        <span className="font-medium">Email:</span> {suggestion.suggestedData.emailAddress}
                      </div>
                    )}
                    {suggestion.suggestedData.phoneNumber && (
                      <div>
                        <span className="font-medium">Phone:</span> {suggestion.suggestedData.phoneNumber}
                      </div>
                    )}
                  </div>
                </div>

                {suggestion.existingData && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Current Data</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      {suggestion.existingData.instituteName && (
                        <div>
                          <span className="font-medium">Institution:</span> {suggestion.existingData.instituteName}
                        </div>
                      )}
                      {suggestion.existingData.individualName && (
                        <div>
                          <span className="font-medium">Individual:</span> {suggestion.existingData.individualName}
                        </div>
                      )}
                      {suggestion.existingData.emailAddress && (
                        <div>
                          <span className="font-medium">Email:</span> {suggestion.existingData.emailAddress}
                        </div>
                      )}
                      {suggestion.existingData.phoneNumber && (
                        <div>
                          <span className="font-medium">Phone:</span> {suggestion.existingData.phoneNumber}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {suggestion.reason && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Reason</h3>
                  <p className="text-sm text-gray-600">{suggestion.reason}</p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <UserIcon />
                <span>Submitted by {suggestion.createdByUser.name}</span>
              </div>

              {suggestion.adminComment && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-1">Admin Comment</h4>
                  <p className="text-sm text-gray-600">{suggestion.adminComment}</p>
                  {suggestion.reviewedByUser && (
                    <p className="text-xs text-gray-500 mt-1">
                      Reviewed by {suggestion.reviewedByUser.name}
                    </p>
                  )}
                </div>
              )}

              {/* Admin Actions */}
              {isAdmin && suggestion.status === SuggestionStatus.PENDING && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setSelectedSuggestion(suggestion)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    Review
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Review Suggestion</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (optional)
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a comment about this review..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleReview(selectedSuggestion.id, 'approve')}
                disabled={isReviewing}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CheckIcon />
                {isReviewing ? 'Approving...' : 'Approve'}
              </button>
              <button
                onClick={() => handleReview(selectedSuggestion.id, 'reject')}
                disabled={isReviewing}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <XIcon />
                {isReviewing ? 'Rejecting...' : 'Reject'}
              </button>
            </div>

            <button
              onClick={() => setSelectedSuggestion(null)}
              className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 