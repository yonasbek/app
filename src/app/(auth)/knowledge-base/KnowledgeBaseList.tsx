'use client';
import React from 'react';
import { KnowledgeBaseFile, knowledgeBaseService } from '@/services/knowledgeBaseService';
import { Download, Trash2 } from 'lucide-react';

export default function KnowledgeBaseList({
  files,
  onDelete,
  onDownload,
}: {
  files: KnowledgeBaseFile[];
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="rounded-xl border border-app-secondary overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-app-foreground scrollbar-hide scrollbar-thin scrollbar-thumb-app-secondary scrollbar-track-app-foreground">
            <thead className="bg-app-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-app-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-app-foreground uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-app-foreground uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-app-foreground uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-app-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-secondary">
              {files.map((file, index) => {
                const isEvenRow = index % 2 === 0;
                const rowBgClass = isEvenRow ? 'bg-white' : 'bg-app-secondary';
                return (
                  <tr
                    key={file.id}
                    className={`transition-colors group ${rowBgClass} `}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-app-foreground group-hover:text-app-primary transition-colors">
                      {file.document_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {(file.document_size / 1024).toFixed(2)} KB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {new Date(file.upload_date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {file.module}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        onClick={() => onDownload(file.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-app-primary hover:bg-app-primary/10 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                        <span className="sr-only sm:not-sr-only">Download</span>
                      </button>
                      <button
                        onClick={() => onDelete(file.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only sm:not-sr-only">Delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
}