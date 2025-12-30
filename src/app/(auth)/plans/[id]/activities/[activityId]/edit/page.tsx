'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { activityService } from '@/services/activityService';
import { CreateActivityDto, PlanType, UpdateActivityDto } from '@/types/activity';
import { use } from 'react';
import { EthiopianDatePicker } from '@/components/ui/ethiopian-date-picker';
import BackButton from '@/components/ui/BackButton';
import { planService } from '@/services/planService';

export default function EditActivityPage({ params }: { params: Promise<{ id: string; activityId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState<UpdateActivityDto>({
    plan_type: 'PFRD',
    plan_year: '',
    main_activity: '',
    title: '',
    strategic_objective: '',
    responsible_department: '',
    assigned_person: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    budget_allocated: 0,
    status: 'NOT_STARTED',
    remarks: '',
    supporting_documents: [],
    plan_id: resolvedParams.id,
    flagship_activity: false,
  });

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [plan, activity] = await Promise.all([
        planService.getById(resolvedParams.id),
        activityService.getById(resolvedParams.activityId)
      ]);

      const startDateObj = activity.start_date ? new Date(activity.start_date) : new Date();
      const endDateObj = activity.end_date ? new Date(activity.end_date) : new Date();

      setStartDate(startDateObj);
      setEndDate(endDateObj);

      setFormData({
        plan_type: activity.plan_type,
        plan_year: activity.plan_year,
        main_activity: plan.title,
        title: activity.title,
        strategic_objective: activity.strategic_objective,
        responsible_department: activity.responsible_department || '',
        assigned_person: activity.assigned_person,
        start_date: activity.start_date ? new Date(activity.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        end_date: activity.end_date ? new Date(activity.end_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        budget_allocated: activity.budget_allocated || 0,
        status: activity.status,
        remarks: activity.remarks || '',
        supporting_documents: activity.supporting_documents || [],
        plan_id: resolvedParams.id,
        flagship_activity: activity.flagship_activity || false,
      });
      
      setPlanLoading(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch activity details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'budget_allocated' ? parseFloat(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (planLoading) {
      setError('Please wait for activity details to load');
      return;
    }
    
    setSaving(true);
    setError(null);

    try {
      await activityService.update(resolvedParams.activityId, formData, files.length > 0 ? files : undefined);
      router.push(`/plans/${resolvedParams.id}/activities/${resolvedParams.activityId}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update activity. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || planLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <BackButton href={`/plans/${resolvedParams.id}/activities/${resolvedParams.activityId}`} label="Back to Activity" className="mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Edit Activity</h1>
        </div>
        <div className="flex justify-center items-center h-64 bg-white p-6 rounded-lg shadow">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading activity details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <BackButton href={`/plans/${resolvedParams.id}/activities`} label="Back to Activities" className="mb-4" />
        </div>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <BackButton href={`/plans/${resolvedParams.id}/activities/${resolvedParams.activityId}`} label="Back to Activity" className="mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">Edit Activity</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="plan_type" className="block text-sm font-medium text-gray-700">
              Plan Type
            </label>
            <select
              id="plan_type"
              name="plan_type"
              value={formData.plan_type}
              onChange={handleChange}
              required
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="PFRD">PFRD - Pre-Facility & Referral Development</option>
              <option value="ECCD">ECCD - Emergency & Critical Care Development</option>
              <option value="HDD">HDD - Hospital Development Directorate</option>
              <option value="SRD">SRD - Specialty & Rehabilitative Services</option>
              <option value="LEO">LEO - Lead Executive Officer Plan</option>
            </select>
          </div>

          <div>
            <label htmlFor="plan_year" className="block text-sm font-medium text-gray-700">
              Plan Year
            </label>
            <input
              type="text"
              id="plan_year"
              name="plan_year"
              value={formData.plan_year}
              onChange={handleChange}
              required
              disabled
              pattern="\d{4}"
              placeholder="YYYY"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label htmlFor="main_activity" className="block text-sm font-medium text-gray-700">
            Main Activity
          </label>
          <input
            type="text"
            id="main_activity"
            name="main_activity"
            disabled
            value={formData.main_activity}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Activity Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="strategic_objective" className="block text-sm font-medium text-gray-700">
            Strategic Objective (Description)
          </label>
          <textarea
            id="strategic_objective"
            name="strategic_objective"
            rows={2}
            value={formData.strategic_objective}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="assigned_person" className="block text-sm font-medium text-gray-700">
              Assigned Person
            </label>
            <input
              type="text"
              id="assigned_person"
              name="assigned_person"
              value={formData.assigned_person}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <EthiopianDatePicker
            label="Start Date"
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
            label="End Date"
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

        <div>
          <label htmlFor="budget_allocated" className="block text-sm font-medium text-gray-700">
            Budget Allocated
          </label>
          <input
            type="number"
            id="budget_allocated"
            name="budget_allocated"
            value={formData.budget_allocated}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.flagship_activity || false}
              onChange={(e) => setFormData((prev) => ({ ...prev, flagship_activity: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Flagship Activity</span>
          </label>
          <p className="mt-1 text-xs text-gray-500">Mark this activity as a flagship activity for special tracking</p>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="DELAYED">Delayed</option>
          </select>
        </div>

        <div>
          <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
            Remarks
          </label>
          <textarea
            id="remarks"
            name="remarks"
            rows={3}
            value={formData.remarks}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="supporting_documents" className="block text-sm font-medium text-gray-700">
            Supporting Documents {formData.supporting_documents && formData.supporting_documents.length > 0 && `(${formData.supporting_documents.length} existing)`}
          </label>
          <input
            type="file"
            id="supporting_documents"
            name="supporting_documents"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <p className="mt-1 text-xs text-gray-500">Select new files to add. Existing files will be preserved.</p>
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
            disabled={saving}
            className={`px-4 py-2 text-white rounded ${saving
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

