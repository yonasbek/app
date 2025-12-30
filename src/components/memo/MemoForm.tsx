'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Memo, MemoType, PriorityLevel, MemoStatus, CreateMemoDto } from '@/types/memo';
import { PlanType } from '@/types/activity';
import { memoService } from '@/services/memoService';
import {
  FileText,
  Building2,
  Calendar,
  Shield,
  User,
  Upload,
  X,
  Save,
  ArrowLeft,
  AlertCircle,
  Paperclip
} from 'lucide-react';
import { EthiopianDatePicker } from '../ui/ethiopian-date-picker';
interface MemoFormProps {
  initialData?: Memo;
  mode: 'create' | 'edit';
}

export default function MemoForm({ initialData, mode }: MemoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    memo_type: initialData?.memo_type || MemoType.GENERAL,
    department: initialData?.department || '',
    body: initialData?.body || '',
    recipient_ids: initialData?.recipients.map(r => r.id) || [],
    date_of_issue: initialData?.date_of_issue
      ? new Date(initialData.date_of_issue).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    priority_level: initialData?.priority_level || PriorityLevel.NORMAL,
    authorId: '',
    approverIds: [],
    status: initialData?.status || MemoStatus.DRAFT,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'create') {
        await memoService.create(formData as CreateMemoDto, files);
      } else {
        await memoService.update(initialData!.id, formData, files);
      }
      router.push('/memos');
    } catch (error) {
      console.error('Failed to save memo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === 'create' ? 'Create New Memo' : 'Edit Memo'}
            </h1>
            <p className="text-gray-600">
              {mode === 'create'
                ? 'Fill in the details to create a new memo'
                : 'Update the memo information below'
              }
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/memos')}
            className="flex items-center space-x-2 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-app-accent to-app-accent px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Memo Title *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter memo title"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-foreground focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Type and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Memo Type *
                </label>
                <select
                  name="memo_type"
                  value={formData.memo_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-foreground focus:border-transparent transition-all appearance-none bg-white"
                >
                  {Object.values(MemoType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Priority Level *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="priority_level"
                    value={formData.priority_level}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-foreground focus:border-transparent transition-all appearance-none bg-white"
                  >
                    {Object.values(PriorityLevel).map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Department and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Department *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-foreground focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">Select Department</option>
                    <option value="PFRD">PFRD - Pre-Facility & Referral Development</option>
                    <option value="ECCD">ECCD - Emergency & Critical Care Development</option>
                    <option value="HDD">HDD - Hospital Development Directorate</option>
                    <option value="SRD">SRD - Specialty & Rehabilitative Services</option>
                    <option value="LEO">LEO - Lead Executive Officer Plan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Date of Issue *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <EthiopianDatePicker
                    label=""
                    value={formData.date_of_issue ? new Date(formData.date_of_issue) : null}
                    onChange={(selectedDate: Date) => {
                      // Adjust for timezone offset to ensure correct local date
                      const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
                      handleChange({
                        target: {
                          name: "date_of_issue",
                          value: localDate.toISOString().split('T')[0],
                        }
                      } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-app-accent to-app-accent px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Memo Content</h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Body *
            </label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
              rows={10}
              placeholder="Enter the memo content..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-foreground focus:border-transparent transition-all resize-none"
            />
            <p className="mt-2 text-xs text-gray-500">
              Provide detailed information for this memo
            </p>
          </div>
        </div>

        {/* Attachments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-app-accent to-app-accent px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Attachments</h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Supporting Documents
            </label>
            <div className="mt-2">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, XLS, XLSX (MAX. 10MB)</p>
                </div>
                <input
                  type="file"
                  id="supporting_documents"
                  name="supporting_documents"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-gray-700">Selected files:</p>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Paperclip className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      className="text-rose-600 hover:text-rose-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-2 text-sm text-gray-600">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p>
                Make sure all required fields are filled before submitting.
                {mode === 'create' && ' The memo will be saved as a draft.'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => router.push('/memos')}
                className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-app-foreground text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{mode === 'create' ? 'Create Memo' : 'Update Memo'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 