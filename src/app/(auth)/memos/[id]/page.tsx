'use client';

import MemoDetail from '@/components/memo/MemoDetail';

interface MemoPageProps {
  params: {
    id: string;
  };
}

export default function MemoPage({ params }: MemoPageProps) {
  const memoId = params.id;
  return (
    <div className="container mx-auto py-8">
      <MemoDetail memoId={memoId} />
    </div>
  );
} 