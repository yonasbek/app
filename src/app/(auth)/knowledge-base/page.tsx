'use client';
import React, { useEffect, useState } from 'react';
import { knowledgeBaseService, KnowledgeBaseFile } from '@/services/knowledgeBaseService';
import KnowledgeBaseUpload from './KnowledgeBaseUpload';
import KnowledgeBaseList from './KnowledgeBaseList';

export default function KnowledgeBasePage() {
  const [files, setFiles] = useState<any[]>([]);
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
    // const responsePath = await knowledgeBaseService.download(file.document_url);
    const normalizedUrl = file.document_url.replace(/\\/g, '/')
    console.log('normalizedUrl', normalizedUrl);
    // const response = await fetch('http://localhost:3000/' + normalizedUrl);
    window.open('http://localhost:3000/' + normalizedUrl, '_blank');
    // const blob = await response.blob();
    // const url = window.URL.createObjectURL(new Blob([blob]));
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = file.name;
    // document.body.appendChild(a);
    // a.click();
    // a.remove();
    // window.URL.revokeObjectURL(url);

  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Knowledge Base</h1>
      <KnowledgeBaseUpload onUpload={loadFiles} />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <KnowledgeBaseList files={files} onDelete={handleDelete} onDownload={handleDownload} />
      )}
    </div>
  );
}