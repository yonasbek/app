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
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface User {
  id: string;
  name: string;
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
  author_id: string;
  author_name: string;
  approver_ids: string[];
  status: MemoStatus;
  tags?: string[];
  approved_at?: Date;
  signatures?: MemoSignature[];
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
  authorId: string;
  approverIds: string[];
  tags?: string[];
  status: MemoStatus;
}

export interface UpdateMemoDto extends Partial<CreateMemoDto> {
  attachments?: string[];
} 