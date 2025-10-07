'use client';
import React, { useState } from 'react';
import { KnowledgeBaseFile, knowledgeBaseService } from '@/services/knowledgeBaseService';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileCard } from '@/components/ui/info-card';
import { FileCardSkeleton } from '@/components/ui/file-card-skeleton';

const CATEGORIES = [
  { id: 'technical', name: 'Technical Documentation', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100/80' },
  { id: 'business', name: 'Business Documents', className: 'bg-green-100 text-green-800 hover:bg-green-100/80' },
  { id: 'legal', name: 'Legal Documents', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100/80' },
  { id: 'training', name: 'Training Materials', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80' },
  { id: 'other', name: 'Other', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100/80' }
];

interface KnowledgeBaseListProps {
  files: KnowledgeBaseFile[];
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
  isLoading?: boolean;
}

export default function KnowledgeBaseList({
  files,
  onDelete,
  onDownload,
  isLoading = false,
}: KnowledgeBaseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredAndSortedFiles = files
    .filter(file => {
      const matchesSearch = file.document_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || file.module === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a: KnowledgeBaseFile, b: KnowledgeBaseFile) => {
      const aDate = new Date(a.updated_at || a.upload_date);
      const bDate = new Date(b.updated_at || b.upload_date);
      return bDate.getTime() - aDate.getTime();
    });

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Knowledge Base Documents</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-8 w-[250px]"
              disabled={isLoading}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" disabled={isLoading}>
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                All Categories
              </DropdownMenuItem>
              {CATEGORIES.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {isLoading ? (
          // Show 8 skeleton cards while loading
          Array.from({ length: 8 }).map((_, index) => (
            <FileCardSkeleton key={index} />
          ))
        ) : filteredAndSortedFiles.length > 0 ? (
          filteredAndSortedFiles.map((file) => (
            <FileCard
              key={file.id}
              id={file.id}
              document_name={file.document_name}
              document_size={file.document_size}
              upload_date={file.upload_date}
              module={CATEGORIES.find(cat => cat.id === file.module)?.name || 'Uncategorized'}
              onDownload={onDownload}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No documents found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}