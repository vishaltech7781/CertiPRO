import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Course, Category, Enrollment } from '../types';
import { CourseCard } from '../components/courses/CourseCard';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle2,
  Code,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  // Trending courses
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-courses'],
    queryFn: () => api.get<Course[]>('/courses/trending'),
  });

  // Recent courses
  const { data: recentData } = useQuery({
    queryKey: ['recent-courses'],
    queryFn: () => api.get<Course[]>('/courses/recent'),
  });

  // Categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories'),
  });

  // Active enrollments for authenticated learner
  const { data: enrollmentsData } = useQuery({
    queryKey: ['my-enrollments-active', user?._id],
    queryFn: () => api.get<Enrollment[]>('/me/enrollments?status=in-progress'),
    enabled: !!user,
  });

  const trendingCourses: Course[] = trendingData?.data || [];
  const recentCourses: Course[] = recentData?.data || [];
  const categories: Category[] = categoriesData?.data || [];
  const inProgressEnrollments: Enrollment[] = enrollmentsData?.data || [];

  return (
    <div className="space-y-16 py-8 md:py-12">
      {/* 1. Main Introduction / Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-surface-200 p-8 sm:p-12 lg:p-16 shadow-sm">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-50 border border-brand-200 text-brand-900 text-xs font-semibold tracking-wide">
              <span>Verified Technology Credentials</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-ink-900 leading-tight">
              Find your next skill. <br />
              Learn it one lesson at a time.
            </h1>

            <p className="text-base sm:text-lg text-ink-600 leading-relaxed max-w-2xl">
              Explore structured computer science and engineering courses, practice what you learn through interactive theory and coding benchmarks, and earn verifiable certificates upon curriculum completion.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/courses">
                <Button variant="primary" size="lg">
                  Explore Courses <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>

              {user ? (
                <Link to="/my-learning">
                  <Button variant="outline" size="lg">
                    View My Learning
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button variant="outline" size="lg">
                    Create Account
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Continue Learning Section (Only for Authenticated Users with In-Progress Courses) */}
      {user && inProgressEnrollments.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-ink-900">Continue Learning</h2>
              <p className="text-xs text-surface-400 mt-0.5">Resume where you left off</p>
            </div>
            <Link
              to="/my-learning"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              All Enrolled Courses ({inProgressEnrollments.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressEnrollments.slice(0, 3).map((enr) => (
              <CourseCard
                key={enr._id}
                course={enr.course}
                isEnrolled={true}
                progressPercent={enr.progressPercent}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. Explore Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink-900">Academic Disciplines</h2>
            <p className="text-xs text-surface-400 mt-0.5">Curated curricula organized by domain</p>
          </div>
          <Link
            to="/courses"
            className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
          >
            Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/courses?category=${encodeURIComponent(cat.name)}`}
              className="p-4 bg-white rounded-lg border border-surface-200 hover:border-surface-300 transition-colors shadow-sm group"
            >
              <h3 className="font-semibold text-sm text-ink-900 group-hover:text-brand-700 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-surface-400 mt-1 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-brand-700 font-medium font-mono">
                <span>{cat.courseCount || 0} courses</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Trending Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink-900">Trending Courses</h2>
            <p className="text-xs text-surface-400 mt-0.5">Popular courses across computer science and engineering</p>
          </div>
          <Link
            to="/courses?sort=popular"
            className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {trendingLoading ? (
          <LoadingSpinner message="Loading courses..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* 5. How Certification Works on CertiPro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-surface-200 p-8 sm:p-12">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-semibold text-accent-700 uppercase tracking-wider">
              Educational Standard
            </span>
            <h2 className="text-2xl font-bold text-ink-900 mt-1">
              How Course Certification Works
            </h2>
            <p className="text-xs text-ink-600 mt-2 leading-relaxed">
              CertiPro certificates are earned, not merely clicked. Credentials are unlocked only when learners satisfy rigorous course criteria enforced on our servers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded bg-surface-100 flex items-center justify-center text-ink-900 font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-sm text-ink-900">Complete Core Curriculum</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Work through structured modules and high-quality educational video lectures. Lesson progress is recorded persistently.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded bg-surface-100 flex items-center justify-center text-ink-900 font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-sm text-ink-900">Pass Assessments</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Achieve the passing threshold on theory quizzes and solve hands-on coding challenges evaluated against test suites.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded bg-surface-100 flex items-center justify-center text-ink-900 font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-sm text-ink-900">Verifiable Credentials</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Download a clean, print-ready PDF certificate with unique identification codes that can be authenticated publicly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Recently Added Courses */}
      {recentCourses.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink-900">Recently Added</h2>
              <p className="text-xs text-surface-400 mt-0.5">Newly published learning paths</p>
            </div>
            <Link
              to="/courses?sort=newest"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCourses.slice(0, 3).map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

