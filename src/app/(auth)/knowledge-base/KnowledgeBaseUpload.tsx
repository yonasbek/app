'use client';
import React from 'react';
import { knowledgeBaseService } from '@/services/knowledgeBaseService';
import EnhancedFileUpload from '@/components/ui/enhanced-upload';

export default function KnowledgeBaseUpload({ onUpload }: { onUpload: () => void }) {
  const handleUpload = async (file: File) => {
    await knowledgeBaseService.upload(file);
  };

  const handleUploadComplete = () => {
    // You can choose to reload or call onUpload
    window.location.reload();
    // Or: onUpload();
  };

  return (
    <div className="mb-6">
      <EnhancedFileUpload
        onUpload={handleUploadComplete}
        uploadFunction={handleUpload}
        title="Upload Knowledge Base Document"
        maxFileSize={10}
        acceptedFileTypes={[
          "text/csv",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/pdf", // Add if you support PDFs
          "text/plain" // Add if you support text files
        ]}
      />
    </div>
  );
}