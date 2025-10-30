'use client';

interface SkeletonLoaderProps {
    type?: 'table' | 'charts' | 'card';
    rows?: number;
    className?: string;
}

export default function SkeletonLoader({ 
    type = 'table', 
    rows = 5, 
    className = '' 
}: SkeletonLoaderProps) {
    if (type === 'table') {
        return (
            <div className={`bg-white rounded-xl shadow-sm border border-app-secondary overflow-hidden ${className}`}>
                {/* Table Header Skeleton */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4">
                    <div className="grid grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                </div>
                
                {/* Table Rows Skeleton */}
                <div className="divide-y divide-app-secondary">
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <div key={rowIndex} className="px-6 py-4">
                            <div className="grid grid-cols-6 gap-4">
                                {Array.from({ length: 6 }).map((_, colIndex) => (
                                    <div 
                                        key={colIndex} 
                                        className={`h-4 bg-gray-200 rounded animate-pulse ${
                                            colIndex === 0 ? 'w-3/4' : 
                                            colIndex === 5 ? 'w-1/2' : 'w-full'
                                        }`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'charts') {
        return (
            <div className={`space-y-6 ${className}`}>
                {/* Chart Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-app-secondary p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                                <div className="text-gray-400 text-sm">Loading chart...</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'card') {
        return (
            <div className={`bg-white rounded-xl shadow-sm border border-app-secondary p-6 ${className}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
}
