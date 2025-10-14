'use client';

import { useState, useEffect } from 'react';
import { CreatePlanDto, Plan } from '@/types/plan';
import { PlanType } from '@/types/activity';

interface PlanFormProps {
    planType?: PlanType;
    initialData?: Plan;
    mode?: 'create' | 'edit';
    onSuccess: () => void;
    onCancel: () => void;
    onSubmit: (data: any) => Promise<any>;
}

export default function PlanForm({
    planType,
    initialData,
    mode = 'create',
    onSuccess,
    onCancel,
    onSubmit
}: PlanFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({
        title: initialData?.title || '',
        fiscal_year: initialData?.fiscal_year || new Date().getFullYear().toString(),
        status: initialData?.status || 'draft',
        budget_allocated: initialData?.budget_allocated || 0,
        owner: initialData?.owner || '',
        plan_type: initialData?.plan_type || planType,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                fiscal_year: initialData.fiscal_year,
                status: initialData.status,
                budget_allocated: initialData.budget_allocated,
                owner: initialData.owner,
                plan_type: initialData.plan_type,
            });
        }
    }, [initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: name === 'budget_allocated' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await onSubmit(formData);
            onSuccess();
        } catch (err) {
            setError('Failed to create plan. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
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

            {mode === 'create' && (
                <div>
                    <label htmlFor="owner" className="block text-sm font-medium text-gray-700">
                        Owner
                    </label>
                    <input
                        type="text"
                        id="owner"
                        name="owner"
                        value={formData.owner}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                </div>
            )}

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

            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
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
                    {loading
                        ? (mode === 'edit' ? 'Saving...' : 'Creating...')
                        : (mode === 'edit' ? 'Save Changes' : 'Create Plan')
                    }
                </button>
            </div>
        </form>
    );
}

