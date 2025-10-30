'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'yellow';
    trend?: {
        value: string;
        direction: 'up' | 'down' | 'neutral';
    };
    className?: string;
}

export default function StatsCard({
    title,
    value,
    icon: Icon,
    color,
    trend,
    className = ''
}: StatsCardProps) {
    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            value: 'text-blue-800',
            icon: 'text-blue-600',
            iconBg: 'bg-blue-100',
            trend: {
                up: 'text-green-600',
                down: 'text-red-600',
                neutral: 'text-gray-600'
            }
        },
        red: {
            bg: 'bg-red-50',
            text: 'text-red-700',
            value: 'text-red-800',
            icon: 'text-red-600',
            iconBg: 'bg-red-100',
            trend: {
                up: 'text-green-600',
                down: 'text-red-600',
                neutral: 'text-gray-600'
            }
        },
        green: {
            bg: 'bg-green-50',
            text: 'text-green-700',
            value: 'text-green-800',
            icon: 'text-green-600',
            iconBg: 'bg-green-100',
            trend: {
                up: 'text-green-600',
                down: 'text-red-600',
                neutral: 'text-gray-600'
            }
        },
        purple: {
            bg: 'bg-purple-50',
            text: 'text-purple-700',
            value: 'text-purple-800',
            icon: 'text-purple-600',
            iconBg: 'bg-purple-100',
            trend: {
                up: 'text-green-600',
                down: 'text-red-600',
                neutral: 'text-gray-600'
            }
        },
        orange: {
            bg: 'bg-orange-50',
            text: 'text-orange-700',
            value: 'text-orange-800',
            icon: 'text-orange-600',
            iconBg: 'bg-orange-100',
            trend: {
                up: 'text-green-600',
                down: 'text-red-600',
                neutral: 'text-gray-600'
            }
        },
        yellow: {
            bg: 'bg-yellow-50',
            text: 'text-yellow-700',
            value: 'text-yellow-800',
            icon: 'text-yellow-600',
            iconBg: 'bg-yellow-100',
            trend: {
                up: 'text-green-600',
                down: 'text-red-600',
                neutral: 'text-gray-600'
            }
        }
    };

    const currentColor = colorClasses[color];

    return (
        <div className={`p-3 ${currentColor.bg} rounded-lg ${className}`}>
            <div className="flex justify-between items-center">
                <div>
                    <p className={`text-sm font-medium ${currentColor.text}`}>{title}</p>
                    <p className={`text-xl font-bold ${currentColor.value}`}>
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {trend && (
                        <p className={`text-xs ${currentColor.trend[trend.direction]}`}>
                            {trend.direction === 'up' && '↑'} {trend.direction === 'down' && '↓'} {trend.value}
                        </p>
                    )}
                </div>
                <div className={`p-2 ${currentColor.iconBg} rounded-lg`}>
                    <Icon className={`w-6 h-6 ${currentColor.icon}`} />
                </div>
            </div>
        </div>
    );
}
