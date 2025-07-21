"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import Link from "next/link";
import { Users, Search, Edit, Trash2, Plus, UserCheck, UserX, RefreshCw } from "lucide-react";
import Card from "@/components/ui/Card";
import { TableSkeleton } from "@/components/ui/LoadingSkeleton";

export default function UsersListPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; userId: string | null }>({
    show: false,
    userId: null
  });

  useEffect(() => {
    setIsClient(true);
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ show: true, userId: id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.userId) return;

    try {
      await userService.delete(deleteConfirm.userId);
      setDeleteConfirm({ show: false, userId: null });
      loadUsers();
    } catch (error) {
      setError("Failed to delete user");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, userId: null });
  };

  const filteredUsers = users.filter((user) => {
    if (!isClient) return true; // During SSR, show all users to avoid hydration mismatch

    const searchTerm = search.toLowerCase();
    return (
      (user.fullName || "").toLowerCase().includes(searchTerm) ||
      (user.email || "").toLowerCase().includes(searchTerm) ||
      (user.username || "").toLowerCase().includes(searchTerm) ||
      (user.role?.name || "").toLowerCase().includes(searchTerm) ||
      (user.department?.name || "").toLowerCase().includes(searchTerm)
    );
  });

  const stats = {
    total: users.length,
    active: users.filter(user => user.isActive).length,
    inactive: users.filter(user => !user.isActive).length
  };

  // Don't render search-dependent content during SSR
  const showingCount = isClient ? filteredUsers.length : users.length;

  if (loading) {
    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-neutral-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-neutral-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="h-12 bg-neutral-200 rounded-lg w-36 animate-pulse"></div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-neutral-200 rounded w-16"></div>
                  <div className="h-3 bg-neutral-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search Skeleton */}
        <div className="h-12 bg-neutral-200 rounded-lg w-full max-w-md animate-pulse"></div>

        {/* Table Skeleton */}
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Confirm Delete</h3>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-app-foreground mb-2">User Management</h1>
          <p className="text-neutral-600">Manage system users and their permissions</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadUsers}
            className="px-4 py-2.5 bg-white border border-neutral-300 text-sm text-neutral-700 rounded-lg hover:bg-neutral-50 transition-all duration-200 flex items-center space-x-2 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <Link
            href="/users/new"
            className="px-6 py-2.5 bg-app-primary text-sm text-white rounded-lg hover:bg-app-primary-light transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
              <p className="text-sm text-neutral-600">Total Users</p>
            </div>
          </div>
        </Card>

        <Card className="border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats.active}</p>
              <p className="text-sm text-neutral-600">Active Users</p>
            </div>
          </div>
        </Card>

        <Card className="border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
              <UserX className="w-6 h-6 text-neutral-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats.inactive}</p>
              <p className="text-sm text-neutral-600">Inactive Users</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}


      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Showing <span className="font-medium text-neutral-900">{showingCount}</span> of <span className="font-medium text-neutral-900">{users.length}</span> users
        </p>
        {/* <Card className="border border-neutral-200 bg-white shadow-sm p-0"> */}

        <div className="relative bg-[#fff] p-2 rounded-lg border border-neutral-200">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search users by name, email, username, role, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-10 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-neutral-900 placeholder-neutral-500"
          />
          {search && isClient && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
              aria-label="Clear search"
              tabIndex={0}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <Card className="border border-neutral-200 bg-white shadow-sm overflow-hidden">
        {error ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Something went wrong</h3>
            <p className="text-red-600 font-medium mb-6">{error}</p>
            <button
              onClick={loadUsers}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 mx-auto shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      User
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Contact Info
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Role
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Department
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Status
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-100">
                {(isClient ? filteredUsers : users).map((user, index) => (
                  <tr
                    key={user.id}
                    className={`group hover:bg-neutral-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-25'
                      }`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-11 h-11 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center shadow-sm">
                          <Users className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-neutral-900 truncate">
                            {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'}
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5 truncate">
                            @{user.username || 'no-username'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-neutral-900 font-medium">
                        {user.email || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
                        {user.role?.name || 'No Role'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {user.department?.name || 'No Department'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {user.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-50 text-neutral-600 border border-neutral-200">
                          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full mr-2"></div>
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/users/edit/${user.id}`}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100 border border-primary-200 transition-colors duration-200 group-hover:shadow-sm"
                        >
                          <Edit className="w-3.5 h-3.5 mr-1.5" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(user.id)}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 border border-red-200 transition-colors duration-200 group-hover:shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(isClient ? filteredUsers : users).length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-20">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center">
                          <Users className="w-10 h-10 text-neutral-400" />
                        </div>
                        <div className="max-w-sm">
                          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                            {!isClient || !search ? "No users found" : "No matching users"}
                          </h3>
                          <p className="text-sm text-neutral-500 leading-relaxed">
                            {!isClient || !search
                              ? "Get started by adding your first user to the system"
                              : "Try adjusting your search terms or clear the search to see all users"
                            }
                          </p>
                        </div>
                        {(!isClient || !search) && (
                          <Link
                            href="/users/new"
                            className="inline-flex items-center px-6 py-2.5 bg-app-primary text-white rounded-lg hover:bg-app-primary-light transition-colors duration-200 shadow-sm hover:shadow-md"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            <span>Add First User</span>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
} 