'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { planService } from '@/services/planService';
import { Plan, UpdatePlanDto } from '@/types/plan';
import { use } from 'react';
import BackButton from '@/components/ui/BackButton';

export default function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdatePlanDto>({
    title: '',
    fiscal_year: '',
    status: 'draft',
    budget_allocated: 0,
    currency: 'ETB',
    budget_source: [],
  });

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const plan = await planService.getById(resolvedParams.id);
      setFormData({
        title: plan.title,
        fiscal_year: plan.fiscal_year,
        status: plan.status,
        budget_allocated: plan.budget_allocated,
        currency: plan.currency || 'ETB',
        budget_source: plan.budget_source || [],
      });
    } catch (err) {
      setError('Failed to fetch plan details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'budget_allocated' ? parseFloat(value) : value,
    }));
  };

  const handleBudgetSourceChange = (source: string, checked: boolean) => {
    setFormData((prev) => {
      const currentSources = prev.budget_source || [];
      if (checked) {
        return {
          ...prev,
          budget_source: [...currentSources, source]
        };
      } else {
        return {
          ...prev,
          budget_source: currentSources.filter((s: string) => s !== source)
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await planService.update(resolvedParams.id, formData);
      router.push('/plans');
    } catch (err) {
      setError('Failed to update plan. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <BackButton href="/plans/list" label="Back to Plans" className="mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">Edit Plan</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
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
          <label htmlFor="fiscal_year" className="block text-sm font-medium text-gray-700">
            Fiscal Year
          </label>
          <select
            id="fiscal_year"
            name="fiscal_year"
            value={formData.fiscal_year}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="2014">2014</option>
            <option value="2015">2015</option>
            <option value="2016">2016</option>
            <option value="2017">2017</option>
            <option defaultChecked value="2018">2018</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>

          </select>
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
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency || 'ETB'}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="ETB">ETB - Ethiopian Birr</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="CNY">CNY - Chinese Yuan</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Source
          </label>
          <div className="space-y-2">
            {['internal', 'donor', 'government', 'partner'].map((source) => (
              <label key={source} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.budget_source?.includes(source) || false}
                  onChange={(e) => handleBudgetSourceChange(source, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">{source}</span>
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">Select one or more budget sources</p>
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
            className={`px-4 py-2 text-white rounded ${
              saving
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