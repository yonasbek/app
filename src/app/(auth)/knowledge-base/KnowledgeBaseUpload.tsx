'use client';
import React, { useState } from 'react';
import { knowledgeBaseService } from '@/services/knowledgeBaseService';
import EnhancedFileUpload from '@/components/ui/enhanced-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Modal, ModalContent, ModalDescription, ModalHeader, ModalTitle, ModalFooter, ModalClose } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

const CATEGORIES = [
  { id: 'technical', name: 'Technical Documentation' },
  { id: 'business', name: 'Business Documents' },
  { id: 'legal', name: 'Legal Documents' },
  { id: 'training', name: 'Training Materials' },
  { id: 'other', name: 'Other' }
];

interface KnowledgeBaseUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: () => void;
}

export default function KnowledgeBaseUpload({ open, onOpenChange, onUpload }: KnowledgeBaseUploadProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = () => {
    // This is called after file is selected
  };

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    // Return a promise that never resolves to prevent auto-reset
    return new Promise<void>(() => { });
  };

  const handleConfirmUpload = async () => {
    if (!selectedCategory || !selectedFile) {
      throw new Error('Please select a category and file before uploading');
    }
    try {
      setIsUploading(true);
      await knowledgeBaseService.upload(selectedFile, selectedCategory);
      onUpload();
      onOpenChange(false);
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedCategory('');
    setSelectedFile(null);
  };

  const handleUploadComplete = () => {
    onUpload();
    setSelectedCategory('');
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className='p-4 bg-white'>
        <ModalHeader>
          <ModalTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Knowledge Base Document
          </ModalTitle>
          <ModalDescription>
            Upload your documents and categorize them for better organization
          </ModalDescription>
        </ModalHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Document Category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={`mt-4 ${!selectedCategory ? 'opacity-60 pointer-events-none' : ''}`}>
            <EnhancedFileUpload
              onUpload={handleFileSelect}
              uploadFunction={handleFileUpload}
              title="Drag & drop your file here"
              maxFileSize={10}
              acceptedFileTypes={[
                "text/csv",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/pdf",
                "text/plain"
              ]}
            />
          </div>
        </div>
        {(
          <ModalFooter>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
                Cancel
              </Button>
              <Button className='bg-app-foreground text-white' onClick={handleConfirmUpload} disabled={isUploading || !selectedCategory}>
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}