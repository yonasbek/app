'use client';
import React, { useEffect, useState } from 'react';
import { knowledgeBaseService, KnowledgeBaseFile } from '@/services/knowledgeBaseService';
import KnowledgeBaseUpload from './KnowledgeBaseUpload';
import KnowledgeBaseList from './KnowledgeBaseList';
import { Loader2, FileText } from 'lucide-react';

export default function KnowledgeBasePage() {
  const [files, setFiles] = useState<KnowledgeBaseFile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const data = await knowledgeBaseService.list();
      setFiles(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    await knowledgeBaseService.delete(id);
    loadFiles();
  };

  const handleDownload = async (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return;
    const normalizedUrl = file.document_url.replace(/\\/g, '/');
    window.open('https://api-mo6f.onrender.com/' + normalizedUrl, '_blank');
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100">
          <FileText className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-app-foreground mb-1">Knowledge Base</h1>
          <p className="text-neutral-600 text-sm">
            Upload, manage, and download your knowledge base documents.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-app-secondary p-6 mb-8">
        <KnowledgeBaseUpload onUpload={loadFiles} />
      </div>

      <div className="bg-white rounded-xl shadow border border-app-secondary p-6">
        <h2 className="text-lg font-semibold text-app-foreground mb-4">Uploaded Documents</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-blue-600 py-8 justify-center">
            <Loader2 className="animate-spin w-5 h-5" />
            <span>Loading documents...</span>
          </div>
        ) : files.length === 0 ? (
          <div className="text-neutral-500 text-center py-8">
            No documents found. Upload your first file above.
          </div>
        ) : (
          <KnowledgeBaseList
            files={files}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  );
}