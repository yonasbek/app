'use client';
import React from 'react';
import { KnowledgeBaseFile } from '@/services/knowledgeBaseService';
import { FileText, Calendar, FolderOpen, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { SummaryCardSkeleton, RecentUploadsSkeleton } from '@/components/ui/summary-card-skeleton';

interface KnowledgeBaseSummaryProps {
    files: KnowledgeBaseFile[];
    onDownload: (id: string) => void;
    isLoading?: boolean;
}

interface SummaryCard {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

export default function KnowledgeBaseSummary({ files, onDownload, isLoading = false }: KnowledgeBaseSummaryProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <SummaryCardSkeleton key={index} />
                ))}
                <RecentUploadsSkeleton />
            </div>
        );
    }

    const totalFiles = files.length;
    const totalSize = files.reduce((acc, file) => acc + file.document_size, 0);
    const categories = [...new Set(files.map(file => file.category))].length;
    const recentUploads = files.filter(file => {
        const uploadDate = new Date(file.upload_date);
        const daysDiff = (Date.now() - uploadDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
    }).length;

    const summaryCards: SummaryCard[] = [
        {
            title: 'Total Documents',
            value: totalFiles,
            icon: <FileText className="w-4 h-4" />,
            color: 'bg-app-secondary text-app-foreground',
        },
        {
            title: 'Total Size',
            value: `${(totalSize / (1024 * 1024)).toFixed(2)} MB`,
            icon: <Download className="w-4 h-4" />,
            color: 'bg-app-secondary text-app-foreground',
        },
        {
            title: 'Categories',
            value: categories,
            icon: <FolderOpen className="w-4 h-4" />,
            color: 'bg-app-secondary text-app-foreground',
        },
        {
            title: 'Recent Uploads',
            value: recentUploads,
            icon: <Calendar className="w-4 h-4" />,
            color: 'bg-app-secondary text-app-foreground',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {summaryCards.map((card, index) => (
                <div
                    key={index}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center ${card.color} mb-2`}>
                        {card.icon}
                    </div>
                    <h3 className="text-xs font-medium text-gray-600 mb-0.5">{card.title}</h3>
                    <p className="text-base font-semibold text-app-foreground">{card.value}</p>
                </div>
            ))}

            <div className="col-span-full">
                <h3 className="text-lg font-semibold mb-4">Recent Uploads</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.slice(0, 3).map((file) => (
                        <div
                            key={file.id}
                            className="bg-white rounded-lg p-4 border border-gray-100 hover:border-app-foreground transition-all duration-300"
                            onClick={() => onDownload(file.id)}
                        >
                            <div className="flex items-start gap-3">
                                <div className="bg-app-secondary rounded-lg p-2">
                                    <FileText className="w-5 h-5 text-app-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                        {file.document_name}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatDistanceToNow(new Date(file.upload_date), { addSuffix: true })}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Category: {file.module}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}