'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { contactService } from '@/services/contactService';
import {
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
interface SuggestNewContactPageProps {
  params?: Promise<{ id?: string }>
}
export default function SuggestNewContactPage({ params }: SuggestNewContactPageProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ContactFormData>({
    instituteName: '',
    individualName: '',
    organizationType: '' as ContactType,
    position: '' as ContactPosition,
    phoneNumber: '',
    emailAddress: '',
    alternativePhone: '',
    region: '',
    location: '',
    notes: '',
  });
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  let resolvedParams: { id?: string } = {};
  if (params) {
    resolvedParams = use(params);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please provide a reason for suggesting this new contact');
      return;
    }

    setSubmitting(true);
    try {
      await contactService.createSuggestion({
        suggestionType: SuggestionType.ADD,
        suggestedChanges: formData,
        reason,
        contact_id: resolvedParams.id,
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
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Suggest New Contact</h1>
          <p className="text-gray-600 mt-1">
            Suggest a new contact to be added to the Office Management System directory
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Institution Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution Name *
              </label>
              <input
                type="text"
                value={formData.instituteName}
                onChange={(e) => handleInputChange('instituteName', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter institution name"
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
                value={formData.individualName}
                onChange={(e) => handleInputChange('individualName', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter individual name"
                required
              />
            </div>

            {/* Organization Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Type *
              </label>
              <select
                value={formData.organizationType}
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
                value={formData.position}
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
                value={formData.phoneNumber}
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
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="email@example.com"
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
                value={formData.alternativePhone}
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
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter region"
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
                value={formData.location}
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
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Additional information about this contact..."
              />
            </div>
          </div>
        </div>

        {/* Reason for Suggestion */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Reason for Suggestion *</h2>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Please explain why this contact should be added to the directory..."
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