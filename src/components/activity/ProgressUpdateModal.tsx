'use client';

import React, { useState } from 'react';
import { SubActivity } from '@/types/subactivity';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProgressUpdateModalProps {
  subActivity: SubActivity;
  onSubmit: (data: { progress: number, notes?: string }) => void;
  onCancel: () => void;
  open: boolean;
}

export default function ProgressUpdateModal({ subActivity, onSubmit, onCancel, open }: ProgressUpdateModalProps) {
  const [progress, setProgress] = useState(subActivity.progress);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { progress, notes };
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
          <DialogDescription>
            {subActivity.title}
            <p className="text-sm text-muted-foreground mt-1">
              {subActivity.description}
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form id="progress-form" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Progress ({progress}%)
                </label>
                <Select
                  value={String(progress)}
                  onValueChange={val => setProgress(Number(val))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select progress" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Draft</SelectItem>
                    <SelectItem value="50">In Progress</SelectItem>
                    <SelectItem value="100">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-foreground"
                  placeholder="Add any notes about the progress..."
                />
              </div>
            </div>
          </form>
        </DialogBody>

        <DialogFooter>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="progress-form"
            className="px-4 py-2 bg-app-foreground text-white rounded-md hover:bg-app-foreground/90"
          >
            Update Progress
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
