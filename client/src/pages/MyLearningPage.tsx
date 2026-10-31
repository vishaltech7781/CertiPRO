import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Enrollment } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { BookOpen, Award, CheckCircle, Clock, PlayCircle } from 'lucide-react';

export const MyLearningPage: React.FC = () => {
  const [tab, setTab] = useState<'all' | 'in-progress' | 'completed'>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['my-learning-courses'],
    queryFn: () => api.get<Enrollment[]>('/me/enrollments'),
  });

  if (isLoading) return <LoadingSpinner message="Loading your enrolled courses..." />;

  const allEnrollments: Enrollment[] = data?.data || [];
  const filtered = allEnrollments.filter((e) => {
    if (tab === 'in-progress') return e.status === 'in-progress';
    if (tab === 'completed') return e.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
          My Learning
        </h1>
        <p className="text-xs text-ink-600 mt-1">
          Continue your active courses, review curriculum milestones, and view earned certificates.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setTab('all')}
          className={`pb-3 transition-colors border-b-2 ${
            tab === 'all'
              ? 'border-ink-900 text-ink-900'
              : 'border-transparent text-surface-400 hover:text-ink-700'
          }`}
        >
          All Enrolled ({allEnrollments.length})
        </button>
        <button
          onClick={() => setTab('in-progress')}
          className={`pb-3 transition-colors border-b-2 ${
            tab === 'in-progress'
              ? 'border-ink-900 text-ink-900'
              : 'border-transparent text-surface-400 hover:text-ink-700'
          }`}
        >
          In Progress ({allEnrollments.filter((e) => e.status === 'in-progress').length})
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`pb-3 transition-colors border-b-2 ${
            tab === 'completed'
              ? 'border-ink-900 text-ink-900'
              : 'border-transparent text-surface-400 hover:text-ink-700'
          }`}
        >
          Completed ({allEnrollments.filter((e) => e.status === 'completed').length})
        </button>
      </div>

      {/* Course List */}
      {filtered.length === 0 ? (
        <EmptyState
          title={`No ${tab !== 'all' ? tab : 'enrolled'} courses found`}
          description="Explore our curated catalog to enroll in courses across software engineering, artificial intelligence, and databases."
          actionLabel="Explore Course Catalog"
          actionHref="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((enr) => {
            const course = enr.course;
            const isDone = enr.status === 'completed';

            return (
              <div
                key={enr._id}
                className="bg-white rounded-lg border border-surface-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full bg-surface-100 overflow-hidden">
                    <img
                      src={course?.thumbnail}
                      alt={course?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant="teal" size="sm">
                        {course?.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-base text-ink-900 leading-snug line-clamp-2">
                      {course?.title}
                    </h3>
                    <p className="text-xs text-surface-400">
                      Instructor: <span className="text-ink-800 font-medium">{course?.instructor?.name}</span>
                    </p>

                    {/* Progress Bar */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs text-ink-700 font-medium mb-1">
                        <span>{isDone ? 'Completed' : 'Course Progress'}</span>
                        <span className="font-mono">{enr.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-surface-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isDone ? 'bg-emerald-600' : 'bg-brand-600'
                          }`}
                          style={{ width: `${enr.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-surface-400 mt-1 block">
                        {enr.completedLessonsCount} of {enr.totalLessonsCount} lessons finished
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-surface-100 mt-4 flex items-center justify-between gap-2">
                  <Link to={`/courses/${course?.slug}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Syllabus
                    </Button>
                  </Link>

                  <Link to={`/my-learning/${course?._id}/learn/active`} className="flex-1">
                    <Button
                      variant={isDone ? 'secondary' : 'primary'}
                      size="sm"
                      className="w-full"
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> {isDone ? 'Review' : 'Continue'}
                    </Button>
                  </Link>

                  {isDone && enr.certificate && (
                    <Link to={`/certificates/${enr.certificate.certificateId}`}>
                      <Button variant="accent" size="sm" title="View Certificate">
                        <Award className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

