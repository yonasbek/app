'use client';

import { ArrowUpDown } from 'lucide-react';

interface SortControlsProps {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSortChange: (field: string) => void;
    onSortOrderToggle: () => void;
    sortOptions: { value: string; label: string }[];
    theme?: 'blue' | 'red' | 'green' | 'purple';
    className?: string;
}

export default function SortControls({
    sortBy,
    sortOrder,
    onSortChange,
    onSortOrderToggle,
    sortOptions,
    theme = 'blue',
    className = ''
}: SortControlsProps) {
    const themeClasses = {
        blue: {
            focus: 'focus:ring-blue-100 focus:border-blue-500',
            hover: 'hover:bg-blue-50 hover:border-blue-300'
        },
        red: {
            focus: 'focus:ring-red-100 focus:border-red-500',
            hover: 'hover:bg-red-50 hover:border-red-300'
        },
        green: {
            focus: 'focus:ring-green-100 focus:border-green-500',
            hover: 'hover:bg-green-50 hover:border-green-300'
        },
        purple: {
            focus: 'focus:ring-purple-100 focus:border-purple-500',
            hover: 'hover:bg-purple-50 hover:border-purple-300'
        }
    };

    const currentTheme = themeClasses[theme];

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-neutral-500" />
                <span className="text-sm font-medium text-neutral-700">Sort by:</span>
            </div>
            <div className="flex gap-1">
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className={`px-3 py-1.5 border border-neutral-200 rounded-md ${currentTheme.focus} transition-all duration-200 appearance-none bg-white text-sm`}
                >
                    {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <button
                    onClick={onSortOrderToggle}
                    className={`px-2 py-1.5 border border-neutral-200 rounded-md ${currentTheme.hover} transition-all duration-200 flex items-center justify-center`}
                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                    <span className="text-sm font-bold text-neutral-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                </button>
            </div>
        </div>
    );
}
