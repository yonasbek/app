'use client';

import { Search, Filter, X, RotateCcw, Loader2 } from 'lucide-react';

interface FilterOption {
    value: string;
    label: string;
}

interface AdvancedFilterPanelProps {
    // Search
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder: string;

    // Filters
    filters: {
        label: string;
        value: string;
        options: FilterOption[];
        onChange: (value: string) => void;
        onClear: () => void;
    }[];

    // Status
    isFiltering: boolean;
    hasActiveFilters: boolean;
    filterCount: number;
    onClearAll: () => void;

    // Stats
    filteredCount: number;
    totalCount: number;

    // Theme
    theme: 'blue' | 'red' | 'green' | 'purple';
}

export default function AdvancedFilterPanel({
    searchTerm,
    onSearchChange,
    searchPlaceholder,
    filters,
    isFiltering,
    hasActiveFilters,
    filterCount,
    onClearAll,
    filteredCount,
    totalCount,
    theme
}: AdvancedFilterPanelProps) {
    const themeClasses = {
        blue: {
            icon: 'text-blue-600',
            iconBg: 'bg-blue-100',
            badge: 'bg-blue-100 text-blue-800',
            clearBtn: 'bg-red-50 text-red-600 hover:bg-red-100',
            focus: 'focus:ring-blue-100 focus:border-blue-500',
            loading: 'text-blue-600 bg-blue-50',
            success: 'text-green-600 bg-green-50'
        },
        red: {
            icon: 'text-red-600',
            iconBg: 'bg-red-100',
            badge: 'bg-red-100 text-red-800',
            clearBtn: 'bg-red-50 text-red-600 hover:bg-red-100',
            focus: 'focus:ring-red-100 focus:border-red-500',
            loading: 'text-red-600 bg-red-50',
            success: 'text-green-600 bg-green-50'
        },
        green: {
            icon: 'text-green-600',
            iconBg: 'bg-green-100',
            badge: 'bg-green-100 text-green-800',
            clearBtn: 'bg-red-50 text-red-600 hover:bg-red-100',
            focus: 'focus:ring-green-100 focus:border-green-500',
            loading: 'text-green-600 bg-green-50',
            success: 'text-green-600 bg-green-50'
        },
        purple: {
            icon: 'text-purple-600',
            iconBg: 'bg-purple-100',
            badge: 'bg-purple-100 text-purple-800',
            clearBtn: 'bg-red-50 text-red-600 hover:bg-red-100',
            focus: 'focus:ring-purple-100 focus:border-purple-500',
            loading: 'text-purple-600 bg-purple-50',
            success: 'text-green-600 bg-green-50'
        }
    };

    const currentTheme = themeClasses[theme];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-app-secondary p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 ${currentTheme.iconBg} rounded-md`}>
                        <Filter className={`w-4 h-4 ${currentTheme.icon}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-app-foreground">Filters & Search</h3>
                    {hasActiveFilters && (
                        <span className={`${currentTheme.badge} text-xs font-medium px-2 py-1 rounded-full`}>
                            {filterCount}
                        </span>
                    )}
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={onClearAll}
                        className={`flex items-center gap-1 px-3 py-1.5 ${currentTheme.clearBtn} rounded-md transition-all duration-200 text-sm font-medium`}
                    >
                        <RotateCcw className="w-3 h-3" />
                        Clear
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative group">
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4 group-focus-within:${currentTheme.icon} transition-colors`} />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className={`w-full pl-10 pr-10 py-2.5 border border-neutral-200 rounded-lg ${currentTheme.focus} transition-all duration-200 text-sm`}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => onSearchChange('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Dynamic Filters */}
                {filters.map((filter, index) => (
                    <div key={index} className="relative group">
                        <div className="relative">
                            <select
                                value={filter.value}
                                onChange={(e) => filter.onChange(e.target.value)}
                                className={`w-full px-3 py-2.5 border border-neutral-200 rounded-lg ${currentTheme.focus} transition-all duration-200 appearance-none bg-white text-sm`}
                            >
                                <option value="">All {filter.label}s</option>
                                {filter.options.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            {filter.value && (
                                <button
                                    onClick={filter.onClear}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Status */}
            <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                    {isFiltering && (
                        <div className={`flex items-center gap-2 ${currentTheme.loading} px-2 py-1 rounded-md`}>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Filtering...
                        </div>
                    )}
                    {!isFiltering && hasActiveFilters && (
                        <div className={`${currentTheme.success} px-2 py-1 rounded-md`}>
                            ✓ Applied
                        </div>
                    )}
                </div>
                <div className="text-neutral-500">
                    {filteredCount} of {totalCount} items
                </div>
            </div>
        </div>
    );
}
