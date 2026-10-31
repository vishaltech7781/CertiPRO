import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { CodingChallenge } from '../types';
import { CodeEditorRunner } from '../components/assessments/CodeEditorRunner';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Code } from 'lucide-react';

export const CourseCodingPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['course-challenges', courseId],
    queryFn: () => api.get(`/challenges/course/${courseId}`),
  });

  const challenges: CodingChallenge[] = data?.data || [];
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

  const activeChallengeId = selectedChallengeId || challenges[0]?._id;
  const { data: challengeDetailData, isLoading: detailLoading, refetch } = useQuery({
    queryKey: ['challenge-detail', activeChallengeId],
    queryFn: () => api.get(`/challenges/${activeChallengeId}`),
    enabled: !!activeChallengeId,
  });

  if (isLoading || (activeChallengeId && detailLoading)) {
    return <LoadingSpinner message="Loading coding challenge workspace..." />;
  }

  const activeChallenge: CodingChallenge | null = challengeDetailData?.data || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={[
            { label: 'My Learning', href: '/my-learning' },
            { label: 'Course Player', href: `/my-learning/${courseId}/learn/active` },
            { label: 'Coding Assessment' },
          ]}
        />
        <Link to={`/my-learning/${courseId}/learn/active`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Return to Player
          </Button>
        </Link>
      </div>

      {challenges.length === 0 ? (
        <div className="bg-white p-8 rounded-lg border border-surface-200 text-center space-y-3">
          <Code className="w-8 h-8 text-surface-400 mx-auto" />
          <h3 className="font-bold text-ink-900">No Coding Challenges Configured</h3>
          <p className="text-xs text-surface-400">
            This course does not currently include hands-on coding challenges.
          </p>
          <Link to={`/my-learning/${courseId}/learn/active`}>
            <Button variant="primary" size="sm">
              Return to Course
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Challenge selector tabs if multiple challenges */}
          {challenges.length > 1 && (
            <div className="flex gap-2 border-b border-surface-200 pb-2">
              {challenges.map((ch, idx) => (
                <button
                  key={ch._id}
                  onClick={() => setSelectedChallengeId(ch._id)}
                  className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-colors ${
                    ch._id === activeChallengeId
                      ? 'bg-ink-900 text-white'
                      : 'bg-surface-100 text-ink-700 hover:bg-surface-200'
                  }`}
                >
                  Challenge {idx + 1}: {ch.title}
                </button>
              ))}
            </div>
          )}

          {activeChallenge && (
            <CodeEditorRunner
              challenge={activeChallenge}
              onSolutionAccepted={() => {
                refetch();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

