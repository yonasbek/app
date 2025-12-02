'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trainingService } from '@/services/trainingService';
import { CreateTrainingDto, TrainingType, TrainingLocation } from '@/types/training';
import { EthiopianDatePicker } from '@/components/ui/ethiopian-date-picker';

export default function NewTrainingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  
  const [formData, setFormData] = useState<CreateTrainingDto>({
    title: '',
    type: 'workshop',
    location_type: 'local',
    location: '',
    country: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    organizer: '',
    description: '',
    participants_count: 0,
    remarks: '',
  });

  const [files, setFiles] = useState<{
    trip_report?: File[];
    photos?: File[];
    attendance?: File[];
    additional_letter?: File[];
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'participants_count' ? parseInt(value) || 0 : value,
    }));
  };

  const handleFileChange = (
    type: 'trip_report' | 'photos' | 'attendance' | 'additional_letter',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => ({
        ...prev,
        [type]: Array.from(e.target.files!),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await trainingService.create(formData, files);
      router.push('/training');
    } catch (err) {
      setError('Failed to create training. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Training</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Training Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Training Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="workshop">Workshop</option>
              <option value="event">Event</option>
              <option value="mentorship">Mentorship</option>
              <option value="field_trip">Field Trip</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="location_type" className="block text-sm font-medium text-gray-700 mb-2">
              Location Type *
            </label>
            <select
              id="location_type"
              name="location_type"
              value={formData.location_type}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="local">Local</option>
              <option value="abroad">Abroad</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Addis Ababa, Ethiopia"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {formData.location_type === 'abroad' && (
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g., United States"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <EthiopianDatePicker
            label="Start Date *"
            value={startDate}
            onChange={(selectedDate: Date) => {
              setStartDate(selectedDate);
              setFormData((prev) => ({
                ...prev,
                start_date: selectedDate.toISOString().split('T')[0],
              }));
            }}
            required
          />

          <EthiopianDatePicker
            label="End Date *"
            value={endDate}
            onChange={(selectedDate: Date) => {
              setEndDate(selectedDate);
              setFormData((prev) => ({
                ...prev,
                end_date: selectedDate.toISOString().split('T')[0],
              }));
            }}
            minDate={startDate}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-2">
              Organizer/Instructor
            </label>
            <input
              type="text"
              id="organizer"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              placeholder="e.g., Dr. John Doe"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="participants_count" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Participants
            </label>
            <input
              type="number"
              id="participants_count"
              name="participants_count"
              value={formData.participants_count}
              onChange={handleChange}
              min="0"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">
            Remarks
          </label>
          <textarea
            id="remarks"
            name="remarks"
            rows={3}
            value={formData.remarks}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Document Uploads */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trip Report
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange('trip_report', e)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange('photos', e)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attendance
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange('attendance', e)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Letter
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange('additional_letter', e)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-white rounded ${loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {loading ? 'Creating...' : 'Create Training'}
          </button>
        </div>
      </form>
    </div>
  );
}

