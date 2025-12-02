'use client';
import React, { useEffect, useState } from 'react';
import { knowledgeBaseService, KnowledgeBaseFile } from '@/services/knowledgeBaseService';
import KnowledgeBaseList from '../KnowledgeBaseList';
import { Loader2, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DocumentApprovalsPage() {
  const [files, setFiles] = useState<KnowledgeBaseFile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPendingFiles = async () => {
    setLoading(true);
    try {
      const data = await knowledgeBaseService.listPending();
      data.sort((a: KnowledgeBaseFile, b: KnowledgeBaseFile) => {
        const aDate = new Date(a.updated_at || a.upload_date);
        const bDate = new Date(b.updated_at || b.upload_date);
        return bDate.getTime() - aDate.getTime();
      });
      setFiles(data);
    } catch (error) {
      console.error('Failed to load pending files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this document?')) return;
    try {
      await knowledgeBaseService.approve(id);
      loadPendingFiles();
    } catch (error) {
      console.error('Failed to approve document:', error);
      alert('Failed to approve document. Please try again.');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this document?')) return;
    try {
      await knowledgeBaseService.reject(id);
      loadPendingFiles();
    } catch (error) {
      console.error('Failed to reject document:', error);
      alert('Failed to reject document. Please try again.');
    }
  };

  const handleDownload = async (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return;
    const normalizedUrl = file.document_url.replace(/\\/g, '/');
    window.open(`${normalizedUrl}`, '_blank');
  };

  useEffect(() => {
    loadPendingFiles();
  }, []);

  // Custom list component with approve/reject buttons
  const ApprovalList = ({ files, onApprove, onReject, onDownload, isLoading }: {
    files: KnowledgeBaseFile[];
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onDownload: (id: string) => void;
    isLoading: boolean;
  }) => {
    return (
      <KnowledgeBaseList
        files={files}
        onDelete={() => {}}
        onDownload={onDownload}
        isLoading={isLoading}
        showApproveActions={true}
        onApprove={onApprove}
        onReject={onReject}
      />
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-2">
      <div className="flex sm:flex-row flex-col items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-app-foreground mb-1">Document Approvals</h1>
            <p className="text-neutral-600 text-sm">
              Review and approve pending document uploads.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-app-secondary p-6 mt-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-app-foreground" />
              <p className="text-gray-600">Loading pending documents...</p>
            </div>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg">No pending documents for approval</p>
            <p className="text-gray-500 text-sm mt-2">All documents have been reviewed.</p>
          </div>
        ) : (
          <KnowledgeBaseList
            files={files}
            onDelete={() => {}}
            onDownload={handleDownload}
            isLoading={loading}
            showApproveActions={true}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>
    </div>
  );
}

