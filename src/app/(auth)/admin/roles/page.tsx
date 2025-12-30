'use client';

import { useState, useEffect } from 'react';
import { roleService } from '@/services/roleService';
import { Role, Permission } from '@/types/role';
import Card from '@/components/ui/Card';
import {
  Users,
  Shield,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Check,
  Search,
  Settings
} from 'lucide-react';

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [activeModule, setActiveModule] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [showNewRoleForm, setShowNewRoleForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (modules.length > 0 && !activeModule) {
      setActiveModule(modules[0]);
    }
  }, [modules, activeModule]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesData, permissionsData, modulesData] = await Promise.all([
        roleService.getAll(),
        roleService.getAllPermissions(),
        roleService.getModules(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
      setModules(modulesData);
      if (rolesData.length > 0 && !selectedRole) {
        setSelectedRole(rolesData[0]);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setEditingRole(null);
  };

  const handlePermissionToggle = async (permissionId: string) => {
    if (!selectedRole) return;

    const currentPermissionIds = selectedRole.permissions?.map(p => p.id) || [];
    const isSelected = currentPermissionIds.includes(permissionId);

    const newPermissionIds = isSelected
      ? currentPermissionIds.filter(id => id !== permissionId)
      : [...currentPermissionIds, permissionId];

    try {
      setSaving(true);
      const updatedRole = await roleService.assignPermissions(selectedRole.id, newPermissionIds);
      setSelectedRole(updatedRole);
      // Update in roles list
      setRoles(roles.map(r => r.id === updatedRole.id ? updatedRole : r));
    } catch (error) {
      console.error('Failed to update permissions:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;

    try {
      setSaving(true);
      const newRole = await roleService.create({
        name: newRoleName,
        description: newRoleDescription,
      });
      setRoles([...roles, newRole]);
      setSelectedRole(newRole);
      setNewRoleName('');
      setNewRoleDescription('');
      setShowNewRoleForm(false);
    } catch (error) {
      console.error('Failed to create role:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole || !editingRole.name.trim()) return;

    try {
      setSaving(true);
      const updatedRole = await roleService.update(editingRole.id, {
        name: editingRole.name,
        description: editingRole.description,
      });
      setRoles(roles.map(r => r.id === updatedRole.id ? updatedRole : r));
      setSelectedRole(updatedRole);
      setEditingRole(null);
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      await roleService.delete(roleId);
      setRoles(roles.filter(r => r.id !== roleId));
      if (selectedRole?.id === roleId) {
        setSelectedRole(roles.find(r => r.id !== roleId) || null);
      }
    } catch (error) {
      console.error('Failed to delete role:', error);
    }
  };

  const getPermissionsByModule = (module: string) => {
    return permissions.filter(p => p.module === module);
  };

  const isPermissionSelected = (permissionId: string) => {
    return selectedRole?.permissions?.some(p => p.id === permissionId) || false;
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-app-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-app-foreground rounded-xl flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-app-foreground">Role Management</h1>
            <p className="text-neutral-600 text-sm mt-1">Manage roles and their permissions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Roles List */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-app-foreground">Roles</h2>
              <button
                onClick={() => setShowNewRoleForm(!showNewRoleForm)}
                className="p-1.5 text-app-foreground hover:bg-app-accent rounded transition-colors"
                title="Add Role"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-app-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-app-foreground text-sm"
              />
            </div>

            {/* New Role Form */}
            {showNewRoleForm && (
              <div className="mb-4 p-3 bg-app-accent rounded-lg space-y-2">
                <input
                  type="text"
                  placeholder="Role name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-3 py-2 border border-app-secondary rounded text-sm"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-app-secondary rounded text-sm"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateRole}
                    disabled={saving || !newRoleName.trim()}
                    className="flex-1 px-3 py-1.5 bg-app-foreground text-white rounded text-sm hover:bg-app-primary-light disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 inline mr-1" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowNewRoleForm(false);
                      setNewRoleName('');
                      setNewRoleDescription('');
                    }}
                    className="px-3 py-1.5 border border-app-secondary rounded text-sm hover:bg-app-accent"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Roles List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredRoles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedRole?.id === role.id
                      ? 'bg-app-foreground text-white'
                      : 'bg-app-accent hover:bg-app-secondary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{role.name}</h3>
                      {role.description && (
                        <p className={`text-xs mt-1 truncate ${
                          selectedRole?.id === role.id ? 'text-white/80' : 'text-neutral-600'
                        }`}>
                          {role.description}
                        </p>
                      )}
                      <p className={`text-xs mt-1 ${
                        selectedRole?.id === role.id ? 'text-white/70' : 'text-neutral-500'
                      }`}>
                        {role.permissions?.length || 0} permissions
                      </p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingRole(role);
                        }}
                        className={`p-1 rounded hover:bg-black/10 ${
                          selectedRole?.id === role.id ? 'text-white' : 'text-neutral-600'
                        }`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRole(role.id);
                        }}
                        className={`p-1 rounded hover:bg-red-500/20 ${
                          selectedRole?.id === role.id ? 'text-white' : 'text-red-600'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Content - Permissions */}
        <div className="lg:col-span-3">
          {selectedRole ? (
            <Card className="p-6">
              {/* Role Header */}
              <div className="mb-6">
                {editingRole && editingRole.id === selectedRole.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingRole.name}
                      onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                      className="w-full px-4 py-2 border border-app-secondary rounded-lg text-lg font-semibold"
                    />
                    <textarea
                      value={editingRole.description || ''}
                      onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                      placeholder="Description"
                      className="w-full px-4 py-2 border border-app-secondary rounded-lg"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateRole}
                        disabled={saving}
                        className="px-4 py-2 bg-app-foreground text-white rounded-lg hover:bg-app-primary-light disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 inline mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingRole(null)}
                        className="px-4 py-2 border border-app-secondary rounded-lg hover:bg-app-accent"
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-app-foreground">{selectedRole.name}</h2>
                        {selectedRole.description && (
                          <p className="text-neutral-600 mt-1">{selectedRole.description}</p>
                        )}
                        <p className="text-sm text-neutral-500 mt-2">
                          {selectedRole.permissions?.length || 0} permissions assigned
                        </p>
                      </div>
                      <button
                        onClick={() => setEditingRole(selectedRole)}
                        className="p-2 text-app-foreground hover:bg-app-accent rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Module Tabs */}
              {modules.length > 0 && (
                <div className="mb-6">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {modules.map((module) => (
                      <button
                        key={module}
                        onClick={() => setActiveModule(module)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                          activeModule === module
                            ? 'bg-app-foreground text-white'
                            : 'bg-app-accent text-app-foreground hover:bg-app-secondary'
                        }`}
                      >
                        {module}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Permissions List */}
              {activeModule && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-app-foreground mb-4">
                    {activeModule} Permissions
                  </h3>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {getPermissionsByModule(activeModule).map((permission) => {
                      const isSelected = isPermissionSelected(permission.id);
                      return (
                        <label
                          key={permission.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-app-foreground/10 border-app-foreground'
                              : 'bg-white border-app-secondary hover:bg-app-accent'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handlePermissionToggle(permission.id)}
                            disabled={saving}
                            className="mt-1 w-4 h-4 text-app-foreground border-app-secondary rounded focus:ring-app-foreground"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-app-foreground">{permission.name}</span>
                              <span className="text-xs px-2 py-0.5 bg-app-accent rounded text-neutral-600">
                                {permission.action}
                              </span>
                            </div>
                            {permission.description && (
                              <p className="text-sm text-neutral-600 mt-1">{permission.description}</p>
                            )}
                            {permission.resource && (
                              <p className="text-xs text-neutral-500 mt-1">Resource: {permission.resource}</p>
                            )}
                          </div>
                          {isSelected && (
                            <Check className="w-5 h-5 text-app-foreground flex-shrink-0" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                  {getPermissionsByModule(activeModule).length === 0 && (
                    <p className="text-neutral-500 text-center py-8">No permissions found for this module</p>
                  )}
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <Shield className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-app-foreground mb-2">No Role Selected</h3>
              <p className="text-neutral-600">Select a role from the list to manage its permissions</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

