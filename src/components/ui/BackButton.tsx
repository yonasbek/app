'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackButton({ href, label = 'Back', className = '' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}
    >
      <ArrowLeft className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}


