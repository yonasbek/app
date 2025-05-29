'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Memo, MemoType, PriorityLevel, MemoStatus, CreateMemoDto } from '@/types/memo';
import { memoService } from '@/services/memoService';

interface MemoFormProps {
  initialData?: Memo;
  mode: 'create' | 'edit';
}

export default function MemoForm({ initialData, mode }: MemoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    memo_type: initialData?.memo_type || MemoType.GENERAL,
    department: initialData?.department || '',
    body: initialData?.body || '',
    recipient_ids: initialData?.recipients.map(r => r.id) || [],
    date_of_issue: initialData?.date_of_issue 
      ? new Date(initialData.date_of_issue).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    priority_level: initialData?.priority_level || PriorityLevel.NORMAL,
    signature: initialData?.signature || '',
    authorId: initialData?.author_id || '',
    approverIds: initialData?.approver_ids || [],
    status: initialData?.status || MemoStatus.DRAFT,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'create') {
        await memoService.create(formData as CreateMemoDto, files);
      } else {
        await memoService.update(initialData!.id, formData, files);
      }
      router.push('/memos');
    } catch (error) {
      console.error('Failed to save memo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          name="memo_type"
          value={formData.memo_type}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        >
          {Object.values(MemoType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Department</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date of Issue</label>
        <input
          type="date"
          name="date_of_issue"
          value={formData.date_of_issue}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Priority Level</label>
        <select
          name="priority_level"
          value={formData.priority_level}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        >
          {Object.values(PriorityLevel).map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Signature</label>
        <input
          type="text"
          name="signature"
          value={formData.signature}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <div>
          <label htmlFor="supporting_documents" className="block text-sm font-medium text-gray-700">
            Supporting Documents
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
        </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push('/memos')}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Memo' : 'Update Memo'}
        </button>
      </div>
    </form>
  );
} 