import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Course, Lesson, Quiz, CodingChallenge, Enrollment } from '../types';
import { VideoPlayer } from '../components/learning/VideoPlayer';
import { LessonCurriculum } from '../components/learning/LessonCurriculum';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Alert } from '../components/ui/Alert';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Award,
  HelpCircle,
  Code,
  FileText,
  ExternalLink,
} from 'lucide-react';

export const CoursePlayerPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [claimStatus, setClaimStatus] = useState<any>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  // Fetch course & curriculum
  const { data: curriculumData, isLoading: curriculumLoading } = useQuery({
    queryKey: ['course-curriculum', courseId],
    queryFn: () => api.get(`/courses/${courseId}/curriculum`),
  });

  // Fetch user progress on this course
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ['course-progress', courseId],
    queryFn: () => api.get(`/courses/${courseId}/progress`),
  });

  // Mark lesson complete mutation
  const completeMutation = useMutation({
    mutationFn: (targetLessonId: string) =>
      api.post(`/courses/${courseId}/lessons/${targetLessonId}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-progress', courseId] });
      queryClient.invalidateQueries({ queryKey: ['my-learning-courses'] });
      queryClient.invalidateQueries({ queryKey: ['learner-dashboard'] });
    },
  });

  // Claim certificate mutation
  const claimMutation = useMutation({
    mutationFn: () => api.post(`/courses/${courseId}/certificate`),
    onSuccess: (res) => {
      setClaimStatus(res.data);
      queryClient.invalidateQueries({ queryKey: ['my-certificates'] });
      queryClient.invalidateQueries({ queryKey: ['my-learning-courses'] });
    },
    onError: (err: any) => {
      setClaimError(err.message || 'Certificate requirements not yet satisfied.');
    },
  });

  if (curriculumLoading || progressLoading) {
    return <LoadingSpinner message="Loading course player and curriculum..." />;
  }

  const modules = curriculumData?.data?.modules || [];
  const lessons: Lesson[] = curriculumData?.data?.lessons || [];
  const quizzes: Quiz[] = curriculumData?.data?.quizzes || [];
  const challenges: CodingChallenge[] = curriculumData?.data?.challenges || [];

  const completedLessonIds: string[] = progressData?.data?.completedLessonIds || [];
  const progressPercent: number = progressData?.data?.progressPercent || 0;
  const enrollment: Enrollment | null = progressData?.data?.enrollment || null;

  // Determine active lesson: if lessonId === 'active', pick first incomplete or first lesson
  let activeLesson = lessons.find((l) => l._id === lessonId);
  if (!activeLesson) {
    activeLesson = lessons.find((l) => !completedLessonIds.includes(l._id)) || lessons[0];
  }

  const currentIndex = lessons.findIndex((l) => l._id === activeLesson?._id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const isCurrentLessonCompleted = activeLesson ? completedLessonIds.includes(activeLesson._id) : false;

  const handleMarkComplete = () => {
    if (activeLesson) {
      completeMutation.mutate(activeLesson._id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-200 pb-4">
        <div>
          <Breadcrumbs
            items={[
              { label: 'My Learning', href: '/my-learning' },
              { label: activeLesson?.title || 'Lesson Player' },
            ]}
          />
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900 mt-1">
            {activeLesson?.title || 'Course Lecture'}
          </h1>
        </div>

        {/* Course Progress & Certificate Claim CTA */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs font-semibold text-ink-900 font-mono">
              Progress: {progressPercent}%
            </span>
            <div className="w-32 bg-surface-200 h-2 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-300 ${
                  progressPercent === 100 ? 'bg-emerald-600' : 'bg-brand-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {progressPercent === 100 && (
            <Button
              variant="accent"
              size="sm"
              onClick={() => claimMutation.mutate()}
              loading={claimMutation.isPending}
            >
              <Award className="w-4 h-4" /> Claim Certificate
            </Button>
          )}
        </div>
      </div>

      {claimError && <Alert type="error">{claimError}</Alert>}
      {claimStatus && (
        <Alert type="success" title="Certificate Earned!">
          Congratulations! You have satisfied all course completion criteria. Your verified certificate has been issued.{' '}
          <Link
            to={`/certificates/${claimStatus.certificateId}`}
            className="font-bold underline ml-1"
          >
            View & Download Certificate
          </Link>
        </Alert>
      )}

      {/* Main 2-Column Learning Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Video Player, Controls, Lesson Description, Resources */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          {activeLesson && (
            <VideoPlayer
              youtubeVideoId={activeLesson.youtubeVideoId}
              title={activeLesson.title}
            />
          )}

          {/* Action Bar: Mark Complete + Previous/Next */}
          <div className="bg-white p-4 rounded-lg border border-surface-200 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant={isCurrentLessonCompleted ? 'secondary' : 'primary'}
                size="md"
                onClick={handleMarkComplete}
                loading={completeMutation.isPending}
              >
                <CheckCircle2
                  className={`w-4 h-4 ${
                    isCurrentLessonCompleted ? 'text-emerald-600' : 'text-white'
                  }`}
                />
                {isCurrentLessonCompleted ? 'Lesson Completed' : 'Mark Lesson Complete'}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!prevLesson}
                onClick={() =>
                  prevLesson && navigate(`/my-learning/${courseId}/learn/${prevLesson._id}`)
                }
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={!nextLesson}
                onClick={() =>
                  nextLesson && navigate(`/my-learning/${courseId}/learn/${nextLesson._id}`)
                }
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Lesson Details & Description */}
          {activeLesson && (
            <div className="bg-white p-6 rounded-lg border border-surface-200 space-y-4">
              <div className="flex items-center justify-between border-b border-surface-100 pb-3">
                <h3 className="font-bold text-base text-ink-900">{activeLesson.title}</h3>
                <span className="text-xs text-surface-400 font-mono">
                  Duration: {activeLesson.durationMinutes} mins
                </span>
              </div>

              {activeLesson.description && (
                <p className="text-xs text-ink-700 leading-relaxed whitespace-pre-line">
                  {activeLesson.description}
                </p>
              )}

              {/* Lesson Resources */}
              {activeLesson.resources && activeLesson.resources.length > 0 && (
                <div className="pt-4 border-t border-surface-100 space-y-2">
                  <h4 className="text-xs font-semibold text-ink-900 uppercase tracking-wider">
                    Supplementary Resources
                  </h4>
                  <div className="space-y-1.5">
                    {activeLesson.resources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-brand-700 hover:text-brand-800 font-medium"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {res.title}
                        <ExternalLink className="w-3 h-3 text-surface-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Assessment Entry Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quizzes.length > 0 && (
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-ink-900 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-700" />
                    Course Theory Quizzes
                  </h4>
                  <p className="text-[11px] text-ink-600 mt-0.5">
                    Test your understanding to satisfy certificate requirements
                  </p>
                </div>
                <Link to={`/my-learning/${courseId}/quiz`}>
                  <Button variant="outline" size="sm" className="bg-white">
                    Start Quiz
                  </Button>
                </Link>
              </div>
            )}

            {challenges.length > 0 && (
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-ink-900 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-teal-700" />
                    Coding Assessment
                  </h4>
                  <p className="text-[11px] text-ink-600 mt-0.5">
                    Solve hands-on programming challenges
                  </p>
                </div>
                <Link to={`/my-learning/${courseId}/coding`}>
                  <Button variant="outline" size="sm" className="bg-white">
                    Solve
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Curriculum Navigation Drawer */}
        <div className="lg:col-span-1">
          <LessonCurriculum
            courseId={courseId!}
            modules={modules}
            lessons={lessons}
            quizzes={quizzes}
            challenges={challenges}
            currentLessonId={activeLesson?._id}
            completedLessonIds={completedLessonIds}
          />
        </div>
      </div>
    </div>
  );
};

