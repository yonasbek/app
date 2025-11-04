'use client';

interface ResultsSummaryProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasActiveFilters: boolean;
    theme?: 'blue' | 'red' | 'green' | 'purple';
    className?: string;
}

export default function ResultsSummary({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasActiveFilters,
    theme = 'blue',
    className = ''
}: ResultsSummaryProps) {
    const themeClasses = {
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-600'
        },
        red: {
            bg: 'bg-red-50',
            text: 'text-red-600'
        },
        green: {
            bg: 'bg-green-50',
            text: 'text-green-600'
        },
        purple: {
            bg: 'bg-purple-50',
            text: 'text-purple-600'
        }
    };

    const currentTheme = themeClasses[theme];
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-neutral-600 ${currentTheme.bg} px-4 py-3 rounded-lg ${className}`}>
            <div className="flex items-center gap-4">
                <span>
                    Showing {startItem} to {endItem} of {totalItems} items
                </span>
                {hasActiveFilters && (
                    <span className={`${currentTheme.text} font-medium`}>
                        (Filtered results)
                    </span>
                )}
            </div>
            <span>
                Page {currentPage} of {totalPages}
            </span>
        </div>
    );
}
