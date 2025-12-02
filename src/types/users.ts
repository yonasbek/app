export interface User {
  id: string;
  email: string;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  jobTitle?: string | null;
  supervisorName?: string | null;
  comments?: string | null;
  isActive: boolean;
  roleId?: string | null;
  departmentId?: string | null;
}
