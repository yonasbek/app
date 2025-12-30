export interface Permission {
  id: string;
  name: string;
  description?: string;
  module: string;
  action: string;
  resource?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: Permission[];
  users?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissionIds?: string[];
}

export interface CreatePermissionDto {
  name: string;
  description?: string;
  module: string;
  action: string;
  resource?: string;
}

export interface UpdatePermissionDto {
  name?: string;
  description?: string;
  module?: string;
  action?: string;
  resource?: string;
}

