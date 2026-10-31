import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Course } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Plus, Edit, Eye, EyeOff } from 'lucide-react';

export const AdminCoursesPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-courses-list'],
    queryFn: () => api.get('/admin/courses?limit=50'),
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ courseId, isPublished }: { courseId: string; isPublished: boolean }) =>
      api.put(`/admin/courses/${courseId}`, { isPublished }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses-list'] });
      queryClient.invalidateQueries({ queryKey: ['courses-catalog'] });
    },
  });

  if (isLoading) return <LoadingSpinner message="Loading course directory..." />;

  const courses: Course[] = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 tracking-tight">Course Management</h1>
          <p className="text-xs text-surface-400 mt-0.5">
            Manage course catalog, modules, lessons, quizzes, and certificate criteria.
          </p>
        </div>

        <Link to="/admin/courses/new">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1" /> Create New Course
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-surface-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-50 text-surface-400 uppercase text-[10px] font-semibold border-b border-surface-200">
              <tr>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Track & Level</th>
                <th className="px-4 py-3">Enrolled</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-surface-50">
                  <td className="px-4 py-3 font-semibold text-ink-900 max-w-xs truncate">
                    {course.title}
                  </td>
                  <td className="px-4 py-3 text-ink-700">{course.category}</td>
                  <td className="px-4 py-3 text-ink-700">
                    {course.courseType} • {course.skillLevel}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-ink-900">{course.enrolledCount}</td>
                  <td className="px-4 py-3">
                    <Badge variant={course.isPublished ? 'success' : 'neutral'} size="sm">
                      {course.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() =>
                        togglePublishMutation.mutate({
                          courseId: course._id,
                          isPublished: !course.isPublished,
                        })
                      }
                      className="p-1 rounded text-surface-400 hover:text-ink-900"
                      title={course.isPublished ? 'Unpublish Course' : 'Publish Course'}
                    >
                      {course.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>

                    <Link to={`/admin/courses/${course._id}/edit`}>
                      <button className="p-1 rounded text-brand-700 hover:text-brand-900" title="Edit Course Curriculum">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
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

