'use client';

import { useState, useEffect } from 'react';
import { Memo, MemoStatus, PriorityLevel } from '@/types/memo';
import { memoService } from '@/services/memoService';
import Link from 'next/link';

export default function MemoList() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMemos();
  }, []);

  const loadMemos = async () => {
    try {
      const data = await memoService.getAll();
      setMemos(data);
    } catch (error) {
      console.error('Failed to load memos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMemos = memos.filter(memo => 
    memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memo.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Memos</h1>
        <Link 
          href="/memos/create" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Memo
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search memos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded"
        />
      </div>

      <div className="grid gap-4">
        {filteredMemos.map((memo) => (
          <div 
            key={memo.id} 
            className="border rounded p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{memo.title}</h2>
                <p className="text-gray-600">{memo.department}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  memo.priority_level === PriorityLevel.URGENT 
                    ? 'bg-red-100 text-red-800' 
                    : memo.priority_level === PriorityLevel.CONFIDENTIAL
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {memo.priority_level}
                </span>
                <span className={`px-2 py-1 rounded text-sm ${
                  memo.status === MemoStatus.APPROVED
                    ? 'bg-green-100 text-green-800'
                    : memo.status === MemoStatus.REJECTED
                    ? 'bg-red-100 text-red-800'
                    : memo.status === MemoStatus.PENDING
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {memo.status}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {new Date(memo.date_of_issue).toLocaleDateString()}
              </div>
              <Link
                href={`/memos/${memo.id}`}
                className="text-blue-500 hover:text-blue-600"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
        {filteredMemos.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No memos found
          </div>
        )}
      </div>
    </div>
  );
}