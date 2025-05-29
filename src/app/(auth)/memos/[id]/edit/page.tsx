'use client';

import { useEffect, useState } from 'react';
import MemoForm from '@/components/memo/MemoForm';
import { memoService } from '@/services/memoService';
import { Memo } from '@/types/memo';

interface EditMemoPageProps {
  params: {
    id: string;
  };
}

export default function EditMemoPage({ params }: EditMemoPageProps) {
  const [memo, setMemo] = useState<Memo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMemo = async () => {
      try {
        const data = await memoService.getById(params.id);
        setMemo(data);
      } catch (error) {
        console.error('Failed to load memo:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMemo();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!memo) return <div>Memo not found</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Memo</h1>
      <MemoForm mode="edit" initialData={memo} />
    </div>
  );
} 