'use client';

import { RefreshCw } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    description: string;
    onRefresh?: () => void;
    isRefreshing?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export default function PageHeader({
    title,
    description,
    onRefresh,
    isRefreshing = false,
    children,
    className = ''
}: PageHeaderProps) {
    return (
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${className}`}>
            <div>
                <h2 className="text-2xl font-bold text-app-foreground">{title}</h2>
                <p className="text-neutral-600">{description}</p>
            </div>
            <div className="flex gap-2">
                {children}
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                )}
            </div>
        </div>
    );
}
