'use client';
import React, { useState } from 'react';
import { KnowledgeBaseFile, knowledgeBaseService } from '@/services/knowledgeBaseService';
import { Search, Filter, LayoutGrid, List, Download, Trash2, FileText } from 'lucide-react';
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
import { formatDistanceToNow } from 'date-fns';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('grid')}
              disabled={isLoading}
              className={`rounded-r-none ${viewMode === 'grid' ? 'bg-app-foreground text-white' : ''}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('list')}
              disabled={isLoading}
              className={`rounded-l-none ${viewMode === 'list' ? 'bg-app-foreground text-white' : ''}`}
            >
              <List className="h-4 w-4" />
            </Button>
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

      {viewMode === 'grid' ? (
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
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  // Show skeleton rows while loading
                  Array.from({ length: 8 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={5} className="px-6 py-4">
                        <div className="bg-gray-100 animate-pulse rounded h-8" />
                      </td>
                    </tr>
                  ))
                ) : filteredAndSortedFiles.length > 0 ? (
                  filteredAndSortedFiles.map((file) => (
                    <tr
                      key={file.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="bg-app-secondary rounded-lg p-2 flex-shrink-0">
                            <FileText className="w-5 h-5 text-app-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {file.document_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          {CATEGORIES.find(cat => cat.id === file.module)?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(file.document_size / 1024).toFixed(2)} KB
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(file.upload_date), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDownload(file.id)}
                            className="hover:bg-green-50 hover:text-green-600"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(file.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No documents found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}