'use client';
import React, { useState } from 'react';
import { knowledgeBaseService } from '@/services/knowledgeBaseService';

export default function KnowledgeBaseUpload({ onUpload }: { onUpload: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    setFile(e?.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    try {
      await knowledgeBaseService.upload(file);
      // setFile(null);
      // handleChange(null);
      window.location.reload();
      // onUpload();
    } catch (err) {
      alert('Failed to upload file');
    } finally {
      setIsUploading(false);
      // handleChange(null);
      // setFile(null);
    }
  };

  return (
    <form className="flex items-center gap-4 mb-6" onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={handleChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={!file || isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}