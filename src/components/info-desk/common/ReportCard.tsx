'use client';

import { LucideIcon } from 'lucide-react';

interface ReportCardProps {
    title: string;
    icon: LucideIcon;
    color: 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'yellow';
    children: React.ReactNode;
    className?: string;
}

export default function ReportCard({
    title,
    icon: Icon,
    color,
    children,
    className = ''
}: ReportCardProps) {
    const colorClasses = {
        blue: {
            icon: 'text-blue-600',
            iconBg: 'bg-blue-100'
        },
        red: {
            icon: 'text-red-600',
            iconBg: 'bg-red-100'
        },
        green: {
            icon: 'text-green-600',
            iconBg: 'bg-green-100'
        },
        purple: {
            icon: 'text-purple-600',
            iconBg: 'bg-purple-100'
        },
        orange: {
            icon: 'text-orange-600',
            iconBg: 'bg-orange-100'
        },
        yellow: {
            icon: 'text-yellow-600',
            iconBg: 'bg-yellow-100'
        }
    };

    const currentColor = colorClasses[color];

    return (
        <div className={`bg-white rounded-2xl shadow-lg border border-app-secondary p-6 ${className}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 ${currentColor.iconBg} rounded-lg`}>
                    <Icon className={`w-6 h-6 ${currentColor.icon}`} />
                </div>
                <h3 className="text-lg font-semibold text-app-foreground">{title}</h3>
            </div>
            {children}
        </div>
    );
}
