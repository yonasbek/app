'use client';

import { Eye, Edit, Trash2 } from 'lucide-react';

interface Column {
    key: string;
    label: string;
    render?: (value: any, item: any) => React.ReactNode;
    className?: string;
}

interface Action {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick: (item: any) => void;
    className?: string;
    color?: 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'yellow';
}

interface DataTableProps {
    data: any[];
    columns: Column[];
    actions?: Action[];
    theme?: 'blue' | 'red' | 'green' | 'purple';
    className?: string;
}

export default function DataTable({
    data,
    columns,
    actions = [],
    theme = 'blue',
    className = ''
}: DataTableProps) {
    const themeClasses = {
        blue: {
            header: 'from-blue-50 to-indigo-50',
            hover: 'hover:bg-blue-50',
            action: {
                blue: 'text-blue-600 hover:text-blue-700 hover:bg-blue-100',
                green: 'text-green-600 hover:text-green-700 hover:bg-green-100',
                red: 'text-red-600 hover:text-red-700 hover:bg-red-100'
            }
        },
        red: {
            header: 'from-red-50 to-orange-50',
            hover: 'hover:bg-red-50',
            action: {
                blue: 'text-blue-600 hover:text-blue-700 hover:bg-blue-100',
                green: 'text-green-600 hover:text-green-700 hover:bg-green-100',
                red: 'text-red-600 hover:text-red-700 hover:bg-red-100'
            }
        },
        green: {
            header: 'from-green-50 to-emerald-50',
            hover: 'hover:bg-green-50',
            action: {
                blue: 'text-blue-600 hover:text-blue-700 hover:bg-blue-100',
                green: 'text-green-600 hover:text-green-700 hover:bg-green-100',
                red: 'text-red-600 hover:text-red-700 hover:bg-red-100'
            }
        },
        purple: {
            header: 'from-purple-50 to-violet-50',
            hover: 'hover:bg-purple-50',
            action: {
                blue: 'text-blue-600 hover:text-blue-700 hover:bg-blue-100',
                green: 'text-green-600 hover:text-green-700 hover:bg-green-100',
                red: 'text-red-600 hover:text-red-700 hover:bg-red-100'
            }
        }
    };

    const currentTheme = themeClasses[theme];

    if (data.length === 0) {
        return (
            <div className={`bg-white rounded-xl shadow-sm border border-app-secondary overflow-hidden ${className}`}>
                <div className="text-center py-12">
                    <div className="text-neutral-400 text-lg mb-2">No data available</div>
                    <div className="text-neutral-500 text-sm">Try adjusting your filters or search criteria</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-app-secondary overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-app-secondary">
                    <thead className={`bg-gradient-to-r ${currentTheme.header}`}>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider ${column.className || ''}`}
                                >
                                    {column.label}
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-app-secondary">
                        {data.map((item, index) => (
                            <tr
                                key={item.id || index}
                                className={`${currentTheme.hover} transition-colors duration-150 ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                }`}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}
                                    >
                                        {column.render
                                            ? column.render(item[column.key], item)
                                            : item[column.key]
                                        }
                                    </td>
                                ))}
                                {actions.length > 0 && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-1">
                                            {actions.map((action, actionIndex) => {
                                                const ActionIcon = action.icon;
                                                const actionColor = action.color || 'blue';
                                                return (
                                                    <button
                                                        key={actionIndex}
                                                        onClick={() => action.onClick(item)}
                                                        className={`p-2 rounded-lg transition-all duration-150 ${currentTheme.action[actionColor]} ${action.className || ''}`}
                                                        title={action.label}
                                                    >
                                                        <ActionIcon className="w-4 h-4" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
