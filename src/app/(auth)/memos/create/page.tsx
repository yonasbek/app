'use client';

import MemoForm from '@/components/memo/MemoForm';

export default function CreateMemoPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl text-gray-900 font-bold mb-6">Create New Memo</h1>
      <MemoForm mode="create" />
    </div>
  );
} 