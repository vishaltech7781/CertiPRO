import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Quiz } from '../types';
import { QuizRunner } from '../components/assessments/QuizRunner';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { ArrowLeft, HelpCircle } from 'lucide-react';

export const CourseQuizPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  // Fetch quizzes for this course
  const { data, isLoading } = useQuery({
    queryKey: ['course-quizzes', courseId],
    queryFn: () => api.get(`/quizzes/course/${courseId}`),
  });

  const quizzes: Quiz[] = data?.data || [];
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  // Fetch full details of selected quiz (safe questions without answers)
  const activeQuizId = selectedQuizId || quizzes[0]?._id;
  const { data: quizDetailData, isLoading: detailLoading, refetch } = useQuery({
    queryKey: ['quiz-detail', activeQuizId],
    queryFn: () => api.get(`/quizzes/${activeQuizId}`),
    enabled: !!activeQuizId,
  });

  if (isLoading || (activeQuizId && detailLoading)) {
    return <LoadingSpinner message="Loading course quiz..." />;
  }

  const activeQuiz: Quiz | null = quizDetailData?.data || null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={[
            { label: 'My Learning', href: '/my-learning' },
            { label: 'Course Player', href: `/my-learning/${courseId}/learn/active` },
            { label: 'Theory Quiz' },
          ]}
        />
        <Link to={`/my-learning/${courseId}/learn/active`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Return to Player
          </Button>
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white p-8 rounded-lg border border-surface-200 text-center space-y-3">
          <HelpCircle className="w-8 h-8 text-surface-400 mx-auto" />
          <h3 className="font-bold text-ink-900">No Theory Quizzes Configured</h3>
          <p className="text-xs text-surface-400">
            This course does not currently require theory examinations for certification.
          </p>
          <Link to={`/my-learning/${courseId}/learn/active`}>
            <Button variant="primary" size="sm">
              Return to Course
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quiz selector tabs if multiple quizzes */}
          {quizzes.length > 1 && (
            <div className="flex gap-2 border-b border-surface-200 pb-2">
              {quizzes.map((q) => (
                <button
                  key={q._id}
                  onClick={() => setSelectedQuizId(q._id)}
                  className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-colors ${
                    q._id === activeQuizId
                      ? 'bg-ink-900 text-white'
                      : 'bg-surface-100 text-ink-700 hover:bg-surface-200'
                  }`}
                >
                  {q.title}
                </button>
              ))}
            </div>
          )}

          {activeQuiz && (
            <QuizRunner
              quiz={activeQuiz}
              onCompleted={() => {
                refetch();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

