'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Memo, MemoStatus, PriorityLevel } from '@/types/memo';
import { memoService } from '@/services/memoService';
import MemoWorkflow from './MemoWorkflow';
import { formatToEthiopianDate } from '@/utils/ethiopianDateUtils';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  FileText,
  Calendar,
  Building2,
  User,
  Download,
  Paperclip,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Users
} from 'lucide-react';

interface MemoDetailProps {
  memoId: string;
  userRole?: string; // This would come from auth context in real app
}

const getStatusConfig = (status: MemoStatus) => {
  const configs = {
    [MemoStatus.DRAFT]: {
      color: 'bg-slate-500',
      textColor: 'text-slate-700',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      icon: FileText,
    },
    [MemoStatus.PENDING_DESK_HEAD]: {
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      icon: Clock,
    },
    [MemoStatus.APPROVED]: {
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      icon: CheckCircle2,
    },
    [MemoStatus.RETURNED_TO_CREATOR]: {
      color: 'bg-orange-500',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: Clock,
    },
    [MemoStatus.REJECTED]: {
      color: 'bg-rose-500',
      textColor: 'text-rose-700',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      icon: XCircle,
    },
    [MemoStatus.PENDING_LEO]: {
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: Clock,
    },
  };
  return configs[status];
};

const getPriorityConfig = (priority: PriorityLevel) => {
  const configs = {
    [PriorityLevel.NORMAL]: {
      color: 'bg-slate-500',
      textColor: 'text-slate-700',
      bgColor: 'bg-slate-50',
      icon: FileText,
    },
    [PriorityLevel.URGENT]: {
      color: 'bg-rose-500',
      textColor: 'text-rose-700',
      bgColor: 'bg-rose-50',
      icon: Clock,
    },
    [PriorityLevel.CONFIDENTIAL]: {
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      icon: Shield,
    },
  };
  return configs[priority];
};

export default function MemoDetail({ memoId, userRole = 'CREATOR' }: MemoDetailProps) {
  const router = useRouter();

  const [memo, setMemo] = useState<Memo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemo();
  }, [memoId]);

  const loadMemo = async () => {
    try {
      const data = await memoService.getById(memoId);
      setMemo(data);
    } catch (error) {
      console.error('Failed to load memo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMemoUpdate = (updatedMemo: Memo) => {
    setMemo(updatedMemo);
  };

  const handleEdit = () => {
    router.push(`/memos/${memoId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this memo?')) return;

    try {
      await memoService.delete(memoId);
      router.push('/memos');
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
  };

  const handleDownloadAttachment = (fileName: string) => {
    window.open(`/api/memos/${memoId}/attachments/${fileName}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading memo details...</p>
        </div>
      </div>
    );
  }

  if (!memo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Memo not found</h3>
        <p className="text-gray-600 mb-6">The memo you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => router.push('/memos')}
          className="flex items-center space-x-2 px-6 py-3 bg-app-foreground text-white rounded-lg hover:opacity-90 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Memos</span>
        </button>
      </div>
    );
  }

  const canEdit = memo.status === MemoStatus.DRAFT || memo.status === MemoStatus.RETURNED_TO_CREATOR;
  const canDelete = memo.status === MemoStatus.DRAFT;
  const statusConfig = getStatusConfig(memo.status);
  const priorityConfig = getPriorityConfig(memo.priority_level);
  const StatusIcon = statusConfig.icon;
  const PriorityIcon = priorityConfig.icon;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h1 className="text-3xl font-bold text-gray-900">{memo.title}</h1>
              <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}>
                <StatusIcon className="w-4 h-4" />
                <span>{memo.status.replace(/_/g, ' ')}</span>
              </div>
            </div>
            <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1.5">
                <Building2 className="w-4 h-4" />
                <span>{memo.department}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4" />
                <span>{formatToEthiopianDate(memo.date_of_issue, 'long')}</span>
              </div>
              <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig.bgColor} ${priorityConfig.textColor}`}>
                <PriorityIcon className="w-3.5 h-3.5" />
                <span>{memo.priority_level}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/memos')}
              className="flex items-center space-x-2 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            {canEdit && (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 px-4 py-2.5 bg-app-foreground text-white rounded-lg hover:opacity-90 transition-all font-medium"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Memo Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-app-accent to-app-accent px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Document Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</label>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 font-medium">{memo.memo_type}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</label>
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 font-medium">{memo.department}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date of Issue</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 font-medium">
                      {formatToEthiopianDate(memo.date_of_issue, 'long')}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Signature</label>
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 font-medium">{memo.signature}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recipients Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-app-accent to-app-accent px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Recipients</h2>
                <span className="px-2 py-0.5 bg-app-foreground text-white text-xs font-semibold rounded-full">
                  {memo.recipients.length}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {memo.recipients.map((recipient) => (
                  <div key={recipient.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-app-foreground to-app-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {recipient.firstName.charAt(0)}{recipient.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {recipient.firstName} {recipient.lastName}
                      </p>
                      <p className="text-xs text-gray-600">{recipient.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-app-accent to-app-accent px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Memo Content</h2>
            </div>
            <div className="p-6">
              <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: memo.body }}
              />
            </div>
          </div>

          {/* Attachments Card */}
          {memo.attachments && memo.attachments.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-app-accent to-app-accent px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Paperclip className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">Attachments</h2>
                  <span className="px-2 py-0.5 bg-app-foreground text-white text-xs font-semibold rounded-full">
                    {memo.attachments.length}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {memo.attachments.map((fileName) => (
                    <div
                      key={fileName}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Paperclip className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate">{fileName}</span>
                      </div>
                      <button
                        className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-app-foreground hover:text-app-foreground transition-all font-medium"
                        onClick={() => handleDownloadAttachment(fileName)}
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Signatures Card */}
          {memo.signatures && memo.signatures.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-app-accent to-app-accent px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Signatures</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {memo.signatures.map((signature) => (
                    <div
                      key={signature.id}
                      className="p-4 bg-gray-50 rounded-lg border-l-4 border-emerald-500"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{signature.signer_name}</div>
                            <div className="flex items-center space-x-1 text-xs text-gray-600">
                              <Calendar className="w-3 h-3" />
                              <span>{formatToEthiopianDate(signature.signed_at, 'medium')}</span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${signature.action === 'APPROVE'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                            }`}
                        >
                          {signature.action === 'APPROVE' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{signature.action}</span>
                        </span>
                      </div>
                      {signature.comments && (
                        <div className="mt-3 pl-13 text-sm text-gray-700 bg-white rounded p-3">
                          {signature.comments}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Workflow Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <MemoWorkflow
              memo={memo}
              onMemoUpdate={handleMemoUpdate}
              userRole={userRole}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 