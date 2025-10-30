'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    theme?: 'blue' | 'red' | 'green' | 'purple';
    className?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    theme = 'blue',
    className = ''
}: PaginationProps) {
    const themeClasses = {
        blue: {
            active: 'bg-blue-600 border-blue-600 text-white',
            hover: 'hover:bg-blue-50 hover:text-blue-600',
            gradient: 'from-gray-50 to-blue-50',
            text: 'text-blue-600'
        },
        red: {
            active: 'bg-red-600 border-red-600 text-white',
            hover: 'hover:bg-red-50 hover:text-red-600',
            gradient: 'from-gray-50 to-red-50',
            text: 'text-red-600'
        },
        green: {
            active: 'bg-green-600 border-green-600 text-white',
            hover: 'hover:bg-green-50 hover:text-green-600',
            gradient: 'from-gray-50 to-green-50',
            text: 'text-green-600'
        },
        purple: {
            active: 'bg-purple-600 border-purple-600 text-white',
            hover: 'hover:bg-purple-50 hover:text-purple-600',
            gradient: 'from-gray-50 to-purple-50',
            text: 'text-purple-600'
        }
    };

    const currentTheme = themeClasses[theme];

    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    return (
        <div className={`bg-gradient-to-r ${currentTheme.gradient} px-6 py-4 flex items-center justify-between border-t border-app-secondary ${className}`}>
            {/* Mobile Pagination */}
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-lg text-neutral-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-lg text-neutral-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                    Next
                </button>
            </div>

            {/* Desktop Pagination */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-neutral-700">
                        Showing page <span className={`font-semibold ${currentTheme.text}`}>{currentPage}</span> of{' '}
                        <span className={`font-semibold ${currentTheme.text}`}>{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {/* Page numbers */}
                        {getVisiblePages().map((page, index) => (
                            <button
                                key={index}
                                onClick={() => typeof page === 'number' && onPageChange(page)}
                                disabled={page === '...'}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200 ${
                                    page === currentPage
                                        ? `z-10 ${currentTheme.active} shadow-md`
                                        : `bg-white border-neutral-300 text-neutral-500 ${currentTheme.hover}`
                                } ${page === '...' ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
