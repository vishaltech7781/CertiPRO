import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Badge } from '../../components/ui/Badge';
import {
  Users,
  BookOpen,
  GraduationCap,
  Award,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => api.get('/admin/analytics'),
  });

  if (isLoading) return <LoadingSpinner message="Calculating platform metrics..." />;

  const analytics = data?.data || {};
  const topCourses = analytics.topCourses || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 tracking-tight">Platform Analytics</h1>
        <p className="text-xs text-surface-400 mt-1">
          Real-time metrics derived from database enrollments, completions, and certificate records.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-surface-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider block">
              Registered Users
            </span>
            <span className="text-2xl font-bold font-mono text-ink-900 mt-1 block">
              {analytics.totalUsers || 0}
            </span>
          </div>
          <div className="w-9 h-9 rounded bg-brand-50 text-brand-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-surface-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider block">
              Published Courses
            </span>
            <span className="text-2xl font-bold font-mono text-ink-900 mt-1 block">
              {analytics.publishedCourses || 0}
            </span>
          </div>
          <div className="w-9 h-9 rounded bg-accent-50 text-accent-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-surface-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider block">
              Total Enrollments
            </span>
            <span className="text-2xl font-bold font-mono text-ink-900 mt-1 block">
              {analytics.totalEnrollments || 0}
            </span>
          </div>
          <div className="w-9 h-9 rounded bg-amber-50 text-amber-700 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-surface-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider block">
              Certificates Issued
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block">
              {analytics.totalCertificates || 0}
            </span>
          </div>
          <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Completion Rate Banner */}
      <div className="bg-white p-6 rounded-lg border border-surface-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-ink-900">Platform Completion Rate</h3>
          <p className="text-xs text-surface-400 mt-0.5">
            {analytics.completedEnrollments || 0} courses completed of {analytics.totalEnrollments || 0} total enrollments
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black font-mono text-brand-700">
            {analytics.completionRate || 0}%
          </span>
        </div>
      </div>

      {/* Top Courses Table */}
      <div className="bg-white rounded-lg border border-surface-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-surface-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-ink-900">Most Enrolled Curricula</h3>
          <span className="text-xs text-surface-400">Ranked by verified student enrollment</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-50 text-surface-400 uppercase text-[10px] font-semibold border-b border-surface-200">
              <tr>
                <th className="px-4 py-3">Course Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Learners Enrolled</th>
                <th className="px-4 py-3">Average Rating</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {topCourses.map((c: any) => (
                <tr key={c._id} className="hover:bg-surface-50">
                  <td className="px-4 py-3 font-semibold text-ink-900">{c.title}</td>
                  <td className="px-4 py-3 text-ink-700">{c.category}</td>
                  <td className="px-4 py-3 font-mono text-ink-900 font-bold">{c.enrolledCount}</td>
                  <td className="px-4 py-3 font-mono text-ink-900">{c.ratingAvg} / 5.0</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.isPublished ? 'success' : 'neutral'} size="sm">
                      {c.isPublished ? 'Published' : 'Draft'}
                    </Badge>
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

