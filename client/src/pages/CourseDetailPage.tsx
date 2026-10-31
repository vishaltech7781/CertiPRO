import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Course, Lesson } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Alert } from '../components/ui/Alert';
import {
  Clock,
  BookOpen,
  Award,
  CheckCircle,
  FileText,
  HelpCircle,
  Code,
  ShieldCheck,
  User as UserIcon,
  PlayCircle,
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['course-detail', slug],
    queryFn: () => api.get(`/courses/${slug}`),
  });

  const enrollMutation = useMutation({
    mutationFn: (courseId: string) => api.post(`/courses/${courseId}/enroll`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-detail', slug] });
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
    },
    onError: (err: any) => {
      setEnrollError(err.message || 'Enrollment failed. Please try again.');
    },
  });

  if (isLoading) return <LoadingSpinner message="Loading course syllabus..." />;

  const course: (Course & { lessons: Lesson[]; quizCount: number; codingCount: number; isEnrolled?: boolean; enrollment?: any }) | null =
    data?.data || null;

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-ink-900">Course Not Found</h2>
        <p className="text-xs text-ink-600">The requested course could not be located or has been archived.</p>
        <Link to="/courses">
          <Button variant="primary">Browse All Courses</Button>
        </Link>
      </div>
    );
  }

  const handleEnroll = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    enrollMutation.mutate(course._id);
  };

  const firstLesson = course.lessons?.[0];

  return (
    <div className="py-8 md:py-12 space-y-10">
      {/* Top Banner & Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Courses', href: '/courses' },
            { label: course.category, href: `/courses?category=${encodeURIComponent(course.category)}` },
            { label: course.title },
          ]}
          className="mb-6"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white rounded-xl border border-surface-200 p-6 sm:p-10 shadow-sm">
          {/* Left 2 Cols: Title, Description, Instructor */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="teal">{course.category}</Badge>
              <Badge variant="neutral">{course.skillLevel} Level</Badge>
              <Badge variant="default">{course.courseType} Track</Badge>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-ink-900 leading-tight">
              {course.title}
            </h1>

            <p className="text-sm text-ink-600 leading-relaxed">{course.shortDescription}</p>

            <div className="flex items-center gap-6 text-xs text-surface-400 font-medium pt-2 border-t border-surface-100 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-ink-700" />
                <span>Duration: {course.estimatedDuration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-ink-700" />
                <span>Lessons: {course.lessons?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <Award className="w-4 h-4" />
                <span>Verified Certificate Included</span>
              </div>
            </div>

            {/* Instructor Summary */}
            <div className="pt-4 border-t border-surface-100 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-200 flex items-center justify-center text-ink-700 font-bold text-xs flex-shrink-0">
                {course.instructor?.name?.[0] || 'I'}
              </div>
              <div className="text-xs">
                <p className="font-bold text-ink-900">{course.instructor?.name}</p>
                <p className="text-surface-400 font-medium">{course.instructor?.title}</p>
                <p className="mt-1 text-ink-600 leading-relaxed text-[11px]">{course.instructor?.bio}</p>
              </div>
            </div>
          </div>

          {/* Right Col: Thumbnail Card & Enrollment CTA */}
          <div className="lg:col-span-1 bg-surface-50 rounded-lg p-5 border border-surface-200 flex flex-col justify-between">
            <div>
              <div className="aspect-video w-full rounded overflow-hidden mb-4 bg-surface-200">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-xs space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm font-bold text-ink-900 pb-2 border-b border-surface-200">
                  <span>Tuition:</span>
                  <span className="text-emerald-700">
                    {course.isFree ? 'Free Enrollment' : `$${course.price}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-surface-400">
                  <span>Language:</span>
                  <span className="font-medium text-ink-900">{course.language}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-surface-400">
                  <span>Interactive Quizzes:</span>
                  <span className="font-medium text-ink-900">{course.quizCount}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-surface-400">
                  <span>Coding Challenges:</span>
                  <span className="font-medium text-ink-900">{course.codingCount}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {enrollError && <Alert type="error">{enrollError}</Alert>}

              {course.isEnrolled ? (
                <Link
                  to={
                    firstLesson
                      ? `/my-learning/${course._id}/learn/${firstLesson._id}`
                      : `/my-learning`
                  }
                  className="w-full block"
                >
                  <Button variant="accent" size="lg" className="w-full">
                    <PlayCircle className="w-4 h-4 mr-1.5" /> Continue Learning
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleEnroll}
                  loading={enrollMutation.isPending}
                >
                  Enroll in Course
                </Button>
              )}

              <p className="text-[10px] text-surface-400 text-center">
                Instant access to lessons, quizzes, and certificate requirements upon enrollment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Detailed Curriculum & Objectives */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (2 cols): Objectives, Description, Syllabus */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Objectives */}
            <div className="bg-white rounded-lg border border-surface-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-ink-900">What You Will Learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-ink-700">
                {course.learningObjectives.map((obj, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-lg border border-surface-200 p-6 space-y-3 text-xs text-ink-800 leading-relaxed">
              <h2 className="text-lg font-bold text-ink-900">About this Course</h2>
              <p className="whitespace-pre-line">{course.description}</p>
            </div>

            {/* Course Syllabus / Curriculum */}
            <div className="bg-white rounded-lg border border-surface-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-ink-900">Course Syllabus</h2>
                <span className="text-xs text-surface-400">
                  {course.modules?.length || 0} Modules • {course.lessons?.length || 0} Lessons
                </span>
              </div>

              <div className="space-y-4">
                {course.modules?.map((mod) => {
                  const modLessons = course.lessons?.filter(
                    (l) => l.moduleId === mod._id || l.moduleId === mod.order?.toString()
                  ) || [];

                  return (
                    <div key={mod._id} className="border border-surface-200 rounded-md overflow-hidden">
                      <div className="bg-surface-50 p-3.5 border-b border-surface-200 flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-xs text-ink-900">
                            Module {mod.order}: {mod.title}
                          </h4>
                          {mod.description && (
                            <p className="text-[11px] text-surface-400 mt-0.5">{mod.description}</p>
                          )}
                        </div>
                        <span className="text-[10px] text-surface-400 font-mono">
                          {modLessons.length} lessons
                        </span>
                      </div>

                      <div className="divide-y divide-surface-100 p-2">
                        {modLessons.map((lesson) => (
                          <div
                            key={lesson._id}
                            className="p-2 flex items-center justify-between text-xs text-ink-700"
                          >
                            <div className="flex items-center gap-2">
                              <PlayCircle className="w-4 h-4 text-surface-400" />
                              <span className="font-medium text-ink-900">{lesson.title}</span>
                            </div>
                            <span className="text-[11px] text-surface-400 font-mono">
                              {lesson.durationMinutes}m
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Column: Prerequisites, Skills, Certificate Policy */}
          <div className="lg:col-span-1 space-y-6">
            {/* Skills Gained */}
            <div className="bg-white rounded-lg border border-surface-200 p-5 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-ink-900">
                Skills You Will Develop
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {course.skills?.map((skill) => (
                  <Badge key={skill} variant="neutral" size="sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            {course.prerequisites?.length > 0 && (
              <div className="bg-white rounded-lg border border-surface-200 p-5 space-y-3 text-xs">
                <h3 className="font-bold uppercase tracking-wider text-ink-900">
                  Prerequisites
                </h3>
                <ul className="space-y-1.5 text-ink-600">
                  {course.prerequisites.map((pre, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-surface-400 rounded-full" />
                      {pre}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certificate Policy */}
            <div className="bg-white rounded-lg border border-surface-200 p-5 space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-ink-900">Certificate Requirements</h3>
              </div>
              <p className="text-surface-400 text-[11px] leading-relaxed">
                To receive the official CertiPro certificate, you must satisfy:
              </p>
              <ul className="space-y-2 text-ink-700 text-[11px]">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Complete 100% of required curriculum lessons</span>
                </li>
                {course.certificatePolicy?.requireQuizzes && (
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pass theory quizzes with ≥ {course.certificatePolicy.minQuizScorePercent}% score</span>
                  </li>
                )}
                {course.certificatePolicy?.requireCoding && (
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Solve required coding challenges accepted by test runner</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

