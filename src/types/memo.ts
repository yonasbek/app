export enum MemoType {
  GENERAL = 'GENERAL',
  INSTRUCTIONAL = 'INSTRUCTIONAL',
  INFORMATIONAL = 'INFORMATIONAL'
}

export enum PriorityLevel {
  NORMAL = 'NORMAL',
  URGENT = 'URGENT',
  CONFIDENTIAL = 'CONFIDENTIAL'
}

export enum MemoStatus {
  DRAFT = 'DRAFT',
  PENDING_DESK_HEAD = 'PENDING_DESK_HEAD',
  PENDING_LEO = 'PENDING_LEO',
  APPROVED = 'APPROVED',
  RETURNED_TO_CREATOR = 'RETURNED_TO_CREATOR',
  REJECTED = 'REJECTED',
}

export enum WorkflowAction {
  SUBMIT_TO_DESK_HEAD = 'SUBMIT_TO_DESK_HEAD',
  SUBMIT_TO_LEO = 'SUBMIT_TO_LEO',
  APPROVE = 'APPROVE',
  RETURN_TO_CREATOR = 'RETURN_TO_CREATOR',
  REJECT = 'REJECT'
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

export interface MemoSignature {
  id: string;
  memo_id: string;
  signer_id: string;
  signer_name: string;
  action: 'APPROVE' | 'REJECT';
  comments?: string;
  signed_at: Date;
}

export interface WorkflowActionDto {
  action: WorkflowAction;
  comment: string;
  reviewerId?: string;
}

export interface WorkflowHistory {
  memoId: string;
  currentStatus: MemoStatus;
  createdAt: Date;
  submittedToDeskHeadAt?: Date;
  deskHeadReview?: {
    reviewedAt: Date;
    reviewer: string | null;
    reviewerName: string | null;
    comment: string;
  };
  submittedToLeoAt?: Date;
  leoReview?: {
    reviewedAt: Date;
    reviewer: string | null;
    reviewerName: string | null;
    comment: string;
  };
  approvedAt?: Date;
}

export interface DocumentData {
  documentId: string;
  memoNumber: string;
  title: string;
  content: string;
  date: Date;
  signature: string;
  department: string;
  template: string;
  generatedAt: Date;
}

export interface Memo {
  id: string;
  title: string;
  memo_type: MemoType;
  department: string;
  body: string;
  attachments?: string[];
  recipients: User[];
  date_of_issue: Date;
  priority_level: PriorityLevel;
  signature: string;
  status: MemoStatus;
  tags?: string[];
  approved_at?: Date;
  signatures?: MemoSignature[];
  
  // Workflow fields
  desk_head_comment?: string;
  desk_head_reviewed_at?: Date;
  desk_head_reviewer?: User;
  leo_comment?: string;
  leo_reviewed_at?: Date;
  leo_reviewer?: User;
  submitted_to_desk_head_at?: Date;
  submitted_to_leo_at?: Date;
  
  created_at: Date;
  updated_at: Date;
}

export interface CreateMemoDto {
  title: string;
  memo_type: MemoType;
  department: string;
  body: string;
  recipient_ids: string[];
  date_of_issue: string;
  priority_level?: PriorityLevel;
  signature: string;
  tags?: string[];
  status: MemoStatus;
}

export interface UpdateMemoDto extends Partial<CreateMemoDto> {
  attachments?: string[];
} 