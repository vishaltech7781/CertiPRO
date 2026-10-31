import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Enrollment, Course, Certificate, ActivityEvent } from '../types';
import { CourseCard } from '../components/courses/CourseCard';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['learner-dashboard'],
    queryFn: () => api.get('/me/dashboard'),
  });

  if (isLoading) return <LoadingSpinner message="Loading your learner dashboard..." />;

  const dashboardData = data?.data || {};
  const stats = dashboardData.stats || {
    totalEnrolled: 0,
    inProgressCount: 0,
    completedCount: 0,
    certificatesCount: 0,
  };
  const inProgress: Enrollment[] = dashboardData.inProgress || [];
  const completed: Enrollment[] = dashboardData.completed || [];
  const certificates: Certificate[] = dashboardData.certificates || [];
  const recentActivity: ActivityEvent[] = dashboardData.recentActivity || [];
  const recommendations: Course[] = dashboardData.recommendations || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-10">
      {/* Welcome & Top Stats */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs text-ink-600 mt-1">
            Track your coursework progress, assessments, and verifiable certificates.
          </p>
        </div>

        {/* Real Metric Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg border border-surface-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider block">
                Total Enrolled
              </span>
              <span className="text-2xl font-bold font-mono text-ink-900 mt-1 block">
                {stats.totalEnrolled}
              </span>
            </div>
            <div className="w-10 h-10 rounded bg-brand-50 text-brand-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-surface-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider block">
                In Progress
              </span>
              <span className="text-2xl font-bold font-mono text-ink-900 mt-1 block">
                {stats.inProgressCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-surface-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider block">
                Completed Courses
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block">
                {stats.completedCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-surface-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider block">
                Certificates Earned
              </span>
              <span className="text-2xl font-bold font-mono text-accent-700 mt-1 block">
                {stats.certificatesCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded bg-accent-50 text-accent-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink-900">In-Progress Learning</h2>
            <p className="text-xs text-surface-400">Courses currently in progress</p>
          </div>
          {inProgress.length > 0 && (
            <Link
              to="/my-learning"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {inProgress.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-dashed border-surface-300 text-center space-y-3">
            <p className="text-xs text-ink-600">You currently have no active in-progress courses.</p>
            <Link to="/courses">
              <Button variant="primary" size="sm">
                Explore Course Catalog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgress.map((enr) => (
              <CourseCard
                key={enr._id}
                course={enr.course}
                isEnrolled={true}
                progressPercent={enr.progressPercent}
              />
            ))}
          </div>
        )}
      </section>

      {/* Earned Certificates Ribbon */}
      {certificates.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink-900">Earned Verified Credentials</h2>
              <p className="text-xs text-surface-400">Verifiable certificates awarded to you</p>
            </div>
            <Link
              to="/certificates"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              All Certificates ({certificates.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.slice(0, 2).map((cert) => (
              <div
                key={cert._id}
                className="bg-white p-5 rounded-lg border border-surface-200 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider block">
                    Verified Certificate
                  </span>
                  <h4 className="font-bold text-sm text-ink-900 truncate max-w-xs">
                    {cert.completionSnapshot.courseTitle}
                  </h4>
                  <p className="text-[11px] text-surface-400 font-mono">
                    ID: {cert.certificateId} • Issued: {new Date(cert.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <Link to={`/certificates/${cert.certificateId}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grid: Recent Activity & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Learning Activity (1 col) */}
        <div className="lg:col-span-1 bg-white p-5 rounded-lg border border-surface-200 space-y-4">
          <h3 className="font-bold text-sm text-ink-900">Recent Activity Timeline</h3>
          {recentActivity.length === 0 ? (
            <p className="text-xs text-surface-400">No recorded activity yet. Start a lesson!</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((act) => (
                <div key={act._id} className="flex items-start gap-2.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-brand-600 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-ink-900">{act.title}</p>
                    <span className="text-[10px] text-surface-400">
                      {new Date(act.timestamp).toLocaleDateString()} at{' '}
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended for You (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-ink-900">Recommended Next Steps</h3>
              <p className="text-xs text-surface-400">Based on your learning history and interests</p>
            </div>
            <Link to="/courses" className="text-xs font-semibold text-brand-700 hover:text-brand-800">
              Browse More
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.slice(0, 2).map((rec) => (
              <CourseCard key={rec._id} course={rec} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

