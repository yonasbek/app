'use client';

import React, { useState, useEffect } from 'react';
import { attendanceService } from '@/services/attendanceService';
import { User } from '@/types/attendance';

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching users from /users endpoint...');
      const usersData = await attendanceService.getAllUsers();
      console.log('Raw users response:', usersData);
      setUsers(usersData);
    } catch (error: any) {
      console.error('Error loading users:', error);
      setError(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const testUsersByRole = async () => {
    try {
      console.log('Testing /users/byRole endpoint...');
      const usersByRole = await attendanceService.getUsersByRole();
      console.log('Users by role response:', usersByRole);
    } catch (error) {
      console.error('Error testing users by role:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Users from /users endpoint</h3>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Users from /users endpoint</h3>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-700">Error: {error}</p>
          <button
            onClick={loadUsers}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Users from /users endpoint ({users.length})</h3>
        <div className="space-x-2">
          <button
            onClick={loadUsers}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
          <button
            onClick={testUsersByRole}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Test byRole
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No users found from the /users endpoint</p>
          <p className="text-sm mt-2">Check your backend API and authentication</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user.id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">{user.id || 'N/A'}</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">{user.name || 'N/A'}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{user.email || 'N/A'}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{user.department || 'N/A'}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{user.position || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Debug Info */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
          Show Raw Data (Debug)
        </summary>
        <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-64">
          {JSON.stringify(users, null, 2)}
        </pre>
      </details>
    </div>
  );
} 