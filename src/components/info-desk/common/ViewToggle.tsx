'use client';

import { Table, BarChart3 } from 'lucide-react';

interface ViewToggleProps {
    viewType: 'table' | 'charts';
    onViewChange: (view: 'table' | 'charts') => void;
    theme?: 'blue' | 'red' | 'green' | 'purple';
    className?: string;
}

export default function ViewToggle({
    viewType,
    onViewChange,
    theme = 'blue',
    className = ''
}: ViewToggleProps) {
    const handleViewChange = (view: 'table' | 'charts') => {
        if (view !== viewType) {
            onViewChange(view);
        }
    };
    const themeClasses = {
        blue: {
            active: 'bg-white text-blue-600 shadow-sm',
            inactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        },
        red: {
            active: 'bg-white text-red-600 shadow-sm',
            inactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        },
        green: {
            active: 'bg-white text-green-600 shadow-sm',
            inactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        },
        purple: {
            active: 'bg-white text-purple-600 shadow-sm',
            inactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }
    };

    const currentTheme = themeClasses[theme];

    return (
        <div className={`flex bg-gray-100 rounded-lg p-1 ${className}`}>
            <button
                onClick={() => handleViewChange('table')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewType === 'table'
                        ? currentTheme.active
                        : currentTheme.inactive
                }`}
            >
                <Table className="w-4 h-4" />
                Table
            </button>
            <button
                onClick={() => handleViewChange('charts')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewType === 'charts'
                        ? currentTheme.active
                        : currentTheme.inactive
                }`}
            >
                <BarChart3 className="w-4 h-4" />
                Charts
            </button>
        </div>
    );
}
