'use client';
import React from 'react';
import { KnowledgeBaseFile, knowledgeBaseService } from '@/services/knowledgeBaseService';

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
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {files.map((file: any) => (
            <tr key={file.id}>
              <td className="px-6 py-4">{file.document_name}</td>
              <td className="px-6 py-4">{(file.document_size / 1024).toFixed(2)} KB</td>
              <td className="px-6 py-4">{new Date(file.upload_date).toLocaleString()}</td>
              <td className="px-6 py-4">{file.module}</td>
              <td className="px-6 py-4 flex gap-2">
                <button
                  onClick={() => onDownload(file.id)}
                  className="text-blue-600 hover:underline"
                  
                >
                  Download
                </button>
                <button
                  onClick={() => onDelete(file.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}