import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { User } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: () => api.get('/admin/users'),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      api.patch(`/admin/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to update user role');
    },
  });

  if (isLoading) return <LoadingSpinner message="Loading user directory..." />;

  const users: User[] = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 tracking-tight">Learner Accounts</h1>
        <p className="text-xs text-surface-400 mt-0.5">
          Review registered learners and manage platform role permissions.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-surface-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-50 text-surface-400 uppercase text-[10px] font-semibold border-b border-surface-200">
              <tr>
                <th className="px-4 py-3">Learner Name</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Registered Date</th>
                <th className="px-4 py-3 text-right">Role Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-surface-50">
                  <td className="px-4 py-3 font-semibold text-ink-900">{u.name}</td>
                  <td className="px-4 py-3 font-mono text-surface-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.role === 'admin' ? 'teal' : 'neutral'} size="sm">
                      {u.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={u.accountStatus === 'active' ? 'success' : 'warning'} size="sm">
                      {u.accountStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-surface-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        updateRoleMutation.mutate({ userId: u._id, role: e.target.value })
                      }
                      className="bg-white border border-surface-300 rounded px-2 py-1 text-xs text-ink-800"
                    >
                      <option value="learner">Learner</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

