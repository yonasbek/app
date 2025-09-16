'use client';
import React, { useEffect, useState } from 'react';
import { knowledgeBaseService, KnowledgeBaseFile } from '@/services/knowledgeBaseService';
import KnowledgeBaseUpload from './KnowledgeBaseUpload';
import KnowledgeBaseList from './KnowledgeBaseList';
import { Loader2, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KnowledgeBaseSummary from './KnowledgeBaseSummary';

export default function KnowledgeBasePage() {
  const [files, setFiles] = useState<KnowledgeBaseFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const data = await knowledgeBaseService.list();
      data.sort((a: KnowledgeBaseFile, b: KnowledgeBaseFile) => {
        const aDate = new Date(a.updated_at || a.upload_date);
        const bDate = new Date(b.updated_at || b.upload_date);
        return bDate.getTime() - aDate.getTime();
      });
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
      <div className="flex sm:flex-row flex-col items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">

          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-app-foreground">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-app-foreground mb-1">Knowledge Base</h1>
            <p className="text-neutral-600 text-sm">
              Upload, manage, and download your knowledge base documents.
            </p>
          </div>
        </div>
        <Button
          onClick={() => setUploadModalOpen(true)}
          className="gap-2 bg-app-foreground text-white "
        >
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <KnowledgeBaseSummary
        files={files}
        onDownload={handleDownload}
        isLoading={loading}
      />

      <div className="bg-white rounded-xl shadow border border-app-secondary p-6 mt-4">
        <KnowledgeBaseList
          files={files}
          onDelete={handleDelete}
          onDownload={handleDownload}
          isLoading={loading}
        />
      </div>

      <KnowledgeBaseUpload
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUpload={loadFiles}
      />
    </div>
  );
}