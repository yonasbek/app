'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Memo, MemoStatus, PriorityLevel } from '@/types/memo';
import { memoService } from '@/services/memoService';

interface MemoDetailProps {
  memoId: string;
}

const statusColors = {
  [MemoStatus.DRAFT]: 'bg-gray-500',
  [MemoStatus.PENDING]: 'bg-yellow-500',
  [MemoStatus.APPROVED]: 'bg-green-500',
  [MemoStatus.REJECTED]: 'bg-red-500',
};

const priorityColors = {
  [PriorityLevel.NORMAL]: 'bg-blue-500',
  [PriorityLevel.URGENT]: 'bg-orange-500',
  [PriorityLevel.CONFIDENTIAL]: 'bg-purple-500',
};

export default function MemoDetail({ memoId }: MemoDetailProps) {
  const router = useRouter();

  const [memo, setMemo] = useState<Memo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemo();
  }, [memoId]);

  const loadMemo = async () => {
    try {
      const data = await memoService.getById(memoId);
      setMemo(data);
    } catch (error) {
      console.error('Failed to load memo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/memos/${memoId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this memo?')) return;
    
    try {
      await memoService.delete(memoId);
      router.push('/memos');
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
  };

  const handleDownloadAttachment = (fileName: string) => {
    window.open(`/api/memos/${memoId}/attachments/${fileName}`, '_blank');
  };

  if (loading) return <div>Loading...</div>;
  if (!memo) return <div>Memo not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{memo.title}</h1>
        <div className="flex gap-2">
          {memo.status === MemoStatus.DRAFT && (
            <>
              <button 
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </>
          )}
          <button 
            onClick={() => router.push('/memos')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Back to List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Memo Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold">Type:</span>
              <span>{memo.memo_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Department:</span>
              <span>{memo.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Date of Issue:</span>
              <span>{memo.date_of_issue.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Priority:</span>
              <span className={`px-2 py-1 rounded text-white ${priorityColors[memo.priority_level]}`}>
                {memo.priority_level}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Status:</span>
              <span className={`px-2 py-1 rounded text-white ${statusColors[memo.status]}`}>
                {memo.status}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Author & Recipients</h2>
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Author:</span>
              <div className="flex items-center gap-2 mt-1">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{memo.author_name}</span>
              </div>
            </div>
            <hr className="my-4" />
            <div>
              <span className="font-semibold">Recipients:</span>
              <div className="mt-2 space-y-2">
                {memo.recipients.map((recipient) => (
                  <div key={recipient.id} className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{recipient.name}</span>
                    <span className="text-gray-500">({recipient.department})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Content</h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: memo.body }}
        />
      </div>

      {memo.attachments && memo.attachments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Attachments</h2>
          <div className="space-y-2">
            {memo.attachments.map((fileName) => (
              <div
                key={fileName}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>{fileName}</span>
                </div>
                <button
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  onClick={() => handleDownloadAttachment(fileName)}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {memo.signatures && memo.signatures.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Signatures</h2>
          <div className="space-y-4">
            {memo.signatures.map((signature) => (
              <div
                key={signature.id}
                className="flex items-center justify-between p-4 border rounded"
              >
                <div>
                  <div className="font-semibold">{signature.signer_name}</div>
                  <div className="text-sm text-gray-500">
                    {signature.signed_at.toLocaleDateString()}
                  </div>
                  {signature.comments && (
                    <div className="mt-2 text-sm">{signature.comments}</div>
                  )}
                </div>
                <span
                  className={`px-2 py-1 rounded text-white ${
                    signature.action === 'APPROVE' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {signature.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 