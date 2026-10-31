import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Category } from '../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Plus, FolderTree } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['categories-admin'],
    queryFn: () => api.get<Category[]>('/categories'),
  });

  const addCategoryMutation = useMutation({
    mutationFn: () =>
      api.post('/admin/categories', {
        name,
        description,
      }),
    onSuccess: () => {
      setName('');
      setDescription('');
      queryClient.invalidateQueries({ queryKey: ['categories-admin'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to add category');
    },
  });

  if (isLoading) return <LoadingSpinner message="Loading categories..." />;

  const categories: Category[] = data?.data || [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 tracking-tight">Category Taxonomy</h1>
        <p className="text-xs text-surface-400 mt-1">
          Define academic disciplines and catalog classification tags.
        </p>
      </div>

      {/* Add Category Form */}
      <div className="bg-white p-5 rounded-lg border border-surface-200 space-y-3 shadow-sm text-xs">
        <h3 className="font-bold text-sm text-ink-900 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-brand-700" /> Add New Discipline
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Distributed Systems"
            required
          />
          <Input
            label="Brief Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Core curriculum description..."
            required
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => addCategoryMutation.mutate()}
          loading={addCategoryMutation.isPending}
        >
          Save Category
        </Button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg border border-surface-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-50 text-surface-400 uppercase text-[10px] font-semibold border-b border-surface-200">
            <tr>
              <th className="px-4 py-3">Category Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-right">Published Courses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-surface-50">
                <td className="px-4 py-3 font-semibold text-ink-900">{cat.name}</td>
                <td className="px-4 py-3 font-mono text-surface-400">{cat.slug}</td>
                <td className="px-4 py-3 text-ink-700 max-w-sm truncate">{cat.description}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-ink-900">
                  {cat.courseCount || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

