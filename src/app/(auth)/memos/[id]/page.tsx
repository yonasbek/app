'use client';

import MemoDetail from '@/components/memo/MemoDetail';
import { use } from 'react';

interface MemoPageProps {
  params: Promise<{ id: string }>
}

export default function MemoPage({ params }: MemoPageProps) {
  const resolvedParams = use(params);
  const memoId = resolvedParams.id;
  return (
    <div className="container mx-auto py-8">
      <MemoDetail memoId={memoId} />
    </div>
  );
} 