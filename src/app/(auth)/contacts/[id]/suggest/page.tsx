'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { contactService } from '@/services/contactService';
import { 
  Contact, 
  ContactFormData, 
  SuggestionType, 
  ContactType, 
  ContactPosition,
  CONTACT_TYPE_LABELS,
  CONTACT_POSITION_LABELS 
} from '@/types/contact';

// SVG Icons
const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

export default function SuggestChangesPage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params.id as string;
  
  const [contact, setContact] = useState<Contact | null>(null);
  const [suggestionType, setSuggestionType] = useState<SuggestionType>(SuggestionType.UPDATE);
  const [suggestedChanges, setSuggestedChanges] = useState<Partial<ContactFormData>>({});
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadContact();
  }, [contactId]);

  const loadContact = async () => {
    try {
      setLoading(true);
      const contactData = await contactService.getContactById(contactId);
      setContact(contactData);
      // Pre-fill suggested data with current contact data
      setSuggestedChanges({
        instituteName: contactData.instituteName,
        individualName: contactData.individualName,
        organizationType: contactData.organizationType,
        position: contactData.position,
        phoneNumber: contactData.phoneNumber,
        emailAddress: contactData.emailAddress,
        alternativePhone: contactData.alternativePhone || '',
        region: contactData.region,
        location: contactData.location,
        notes: contactData.notes || '',
      });
    } catch (error) {
      console.error('Failed to load contact:', error);
      router.push('/contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please provide a reason for this suggestion');
      return;
    }

    setSubmitting(true);
    try {
      await contactService.createSuggestion({
        suggestionType: suggestionType,
        contact_id: suggestionType === SuggestionType.DELETE ? contactId : suggestionType === SuggestionType.UPDATE ? contactId : undefined,
        suggestedChanges: suggestionType === SuggestionType.DELETE ? {} : suggestedChanges,
        reason,
      });
      
      router.push('/contacts/suggestions');
    } catch (error) {
      console.error('Failed to create suggestion:', error);
      alert('Failed to submit suggestion. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: any) => {
    setSuggestedChanges(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!contact) {
    return <div>Contact not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suggest Changes</h1>
          <p className="text-gray-600 mt-1">
            Suggest updates for: {contact.instituteName} - {contact.individualName}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Suggestion Type */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Type of Suggestion</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="suggestionType"
                value={SuggestionType.UPDATE}
                checked={suggestionType === SuggestionType.UPDATE}
                onChange={(e) => setSuggestionType(e.target.value as SuggestionType)}
                className="mr-2"
              />
              Update Contact Information
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="suggestionType"
                value={SuggestionType.DELETE}
                checked={suggestionType === SuggestionType.DELETE}
                onChange={(e) => setSuggestionType(e.target.value as SuggestionType)}
                className="mr-2"
              />
              Remove Contact (Mark as Inactive)
            </label>
          </div>
        </div>

        {/* Contact Information Form - Only show for UPDATE */}
        {suggestionType === SuggestionType.UPDATE && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Suggested Changes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Institution Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution Name *
                </label>
                <input
                  type="text"
                  value={suggestedChanges.instituteName || ''}
                  onChange={(e) => handleInputChange('instituteName', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              {/* Individual Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Individual Name *
                </label>
                <input
                  type="text"
                  value={suggestedChanges.individualName || ''}
                  onChange={(e) => handleInputChange('individualName', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              {/* Organization Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Type *
                </label>
                <select
                  value={suggestedChanges.organizationType || ''}
                  onChange={(e) => handleInputChange('organizationType', e.target.value as ContactType)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select Organization Type</option>
                  {Object.entries(CONTACT_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <select
                  value={suggestedChanges.position || ''}
                  onChange={(e) => handleInputChange('position', e.target.value as ContactPosition)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select Position</option>
                  {Object.entries(CONTACT_POSITION_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={suggestedChanges.phoneNumber || ''}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="+251XXXXXXXXX"
                  required
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={suggestedChanges.emailAddress || ''}
                  onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              {/* Alternative Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternative Phone
                </label>
                <input
                  type="tel"
                  value={suggestedChanges.alternativePhone || ''}
                  onChange={(e) => handleInputChange('alternativePhone', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="+251XXXXXXXXX"
                />
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region *
                </label>
                <input
                  type="text"
                  value={suggestedChanges.region || ''}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specific Location
                </label>
                <input
                  type="text"
                  value={suggestedChanges.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="City, Sub-city, Woreda, etc."
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={suggestedChanges.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Additional information about this contact..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Reason for Suggestion */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Reason for Suggestion *</h2>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Please explain why this change is needed..."
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <SaveIcon />
            {submitting ? 'Submitting...' : 'Submit Suggestion'}
          </button>
        </div>
      </form>
    </div>
  );
} 