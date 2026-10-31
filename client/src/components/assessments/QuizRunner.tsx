import React, { useState } from 'react';
import { Quiz, QuizQuestion } from '../../types';
import { api } from '../../lib/api';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { CheckCircle2, XCircle, RotateCcw, Award, ShieldAlert } from 'lucide-react';

export interface QuizRunnerProps {
  quiz: Quiz;
  onCompleted?: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ quiz, onCompleted }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyWarning, setCopyWarning] = useState<string | null>(null);

  const triggerCopyWarning = (action = 'Copying and pasting') => {
    setCopyWarning(`${action} is disabled during assessment tests to uphold test integrity.`);
    setTimeout(() => {
      setCopyWarning(null);
    }, 3500);
  };

  React.useEffect(() => {
    const handleGlobalCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerCopyWarning('Copying question or option content');
    };
    const handleGlobalCut = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerCopyWarning('Cutting content');
    };
    const handleGlobalPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerCopyWarning('Pasting content');
    };
    const handleGlobalContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerCopyWarning('Right-click context menu');
    };
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a', 'C', 'V', 'X', 'A'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        triggerCopyWarning('Keyboard shortcuts (Copy/Paste)');
      }
    };

    window.addEventListener('copy', handleGlobalCopy);
    window.addEventListener('cut', handleGlobalCut);
    window.addEventListener('paste', handleGlobalPaste);
    window.addEventListener('contextmenu', handleGlobalContextMenu);
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('copy', handleGlobalCopy);
      window.removeEventListener('cut', handleGlobalCut);
      window.removeEventListener('paste', handleGlobalPaste);
      window.removeEventListener('contextmenu', handleGlobalContextMenu);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a', 'C', 'V', 'X', 'A'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      triggerCopyWarning('Keyboard shortcuts (Copy/Paste)');
    }
  };

  const handleOptionToggle = (questionId: string, optionIndex: number, isMulti: boolean) => {
    if (result) return; // Locked once submitted

    setSelectedAnswers((prev) => {
      const current = prev[questionId] || [];
      if (isMulti) {
        return {
          ...prev,
          [questionId]: current.includes(optionIndex)
            ? current.filter((idx) => idx !== optionIndex)
            : [...current, optionIndex],
        };
      } else {
        return {
          ...prev,
          [questionId]: [optionIndex],
        };
      }
    });
  };

  const handleSubmit = async () => {
    setError(null);

    // Ensure all questions answered
    const unanswered = quiz.questions.filter((q) => !selectedAnswers[q.id]?.length);
    if (unanswered.length > 0) {
      setError(`Please answer all questions before submitting (${unanswered.length} unanswered).`);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        answers: quiz.questions.map((q) => ({
          questionId: q.id,
          selectedAnswers: selectedAnswers[q.id] || [],
        })),
      };

      const res = await api.post(`/quizzes/${quiz._id}/submit`, payload);
      if (res.success && res.data) {
        setResult(res.data);
        if (onCompleted) onCompleted();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setResult(null);
    setError(null);
  };

  return (
    <div
      className="bg-white rounded-lg border border-surface-200 p-6 max-w-3xl mx-auto space-y-6 select-none"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
      onCopy={(e) => {
        e.preventDefault();
        triggerCopyWarning('Copying question or option content');
      }}
      onCut={(e) => {
        e.preventDefault();
        triggerCopyWarning('Cutting content');
      }}
      onPaste={(e) => {
        e.preventDefault();
        triggerCopyWarning('Pasting content');
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        triggerCopyWarning('Right-click context menu');
      }}
      onDragStart={(e) => {
        e.preventDefault();
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="border-b border-surface-200 pb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-ink-900">{quiz.title}</h2>
            <p className="mt-1 text-xs text-ink-600">{quiz.instructions}</p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>Anti-Cheating: Copy &amp; Paste Disabled</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs text-surface-400 font-mono">
          <span>Passing Score: {quiz.passThreshold}%</span>
          <span>•</span>
          <span>Questions: {quiz.questions.length}</span>
        </div>
      </div>

      {copyWarning && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-900 rounded-md text-xs flex items-center justify-between">
          <span>⚠️ {copyWarning}</span>
          <button
            onClick={() => setCopyWarning(null)}
            className="text-red-700 hover:text-red-900 font-bold ml-2 text-sm leading-none"
          >
            ×
          </button>
        </div>
      )}

      {error && <Alert type="error">{error}</Alert>}

      {/* Result Card if Submitted */}
      {result && (
        <div
          className={`p-5 rounded-lg border ${
            result.passed
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-red-50 border-red-300 text-red-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {result.passed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <h3 className="text-base font-bold">
                {result.passed ? 'Quiz Passed!' : 'Did Not Meet Passing Threshold'}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-mono">{result.score}%</span>
              <p className="text-[11px] opacity-75">
                {result.earnedPoints} of {result.totalPoints} points
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed">{result.message}</p>

          {!result.passed && result.remainingAttempts > 0 && (
            <div className="mt-4">
              <Button variant="secondary" size="sm" onClick={handleRetake}>
                <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz ({result.remainingAttempts} attempts remaining)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Question List */}
      <div className="space-y-8">
        {quiz.questions.map((q, qIndex) => {
          const gradedInfo = result?.gradedAnswers?.find((ga: any) => ga.questionId === q.id);
          const isMulti = q.type === 'multiple-select';

          return (
            <div key={q.id} className="space-y-3 select-none">
              <div className="flex items-start gap-2">
                <span className="font-mono text-xs bg-surface-100 text-ink-700 px-2 py-0.5 rounded font-semibold mt-0.5 select-none">
                  Q{qIndex + 1}
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-ink-900 leading-snug select-none">
                    {q.questionText}
                  </h4>
                  {isMulti && (
                    <span className="text-[11px] text-surface-400 italic select-none">Select all that apply</span>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2 pl-8">
                {q.options.map((option, optIndex) => {
                  const isChecked = selectedAnswers[q.id]?.includes(optIndex);
                  const isCorrect = gradedInfo?.correctAnswers?.includes(optIndex);
                  const userSelectedThis = gradedInfo?.selectedAnswers?.includes(optIndex);

                  let optionStyle = 'border-surface-200 bg-white hover:bg-surface-50 text-ink-800';
                  if (result) {
                    if (isCorrect) {
                      optionStyle = 'border-emerald-400 bg-emerald-50 text-emerald-950 font-medium';
                    } else if (userSelectedThis && !isCorrect) {
                      optionStyle = 'border-red-400 bg-red-50 text-red-950';
                    }
                  } else if (isChecked) {
                    optionStyle = 'border-ink-800 bg-ink-50 text-ink-950 font-medium';
                  }

                  return (
                    <label
                      key={optIndex}
                      onClick={() => handleOptionToggle(q.id, optIndex, isMulti)}
                      className={`flex items-center gap-3 p-3 rounded-md border text-xs cursor-pointer select-none transition-colors ${optionStyle}`}
                    >
                      <input
                        type={isMulti ? 'checkbox' : 'radio'}
                        name={`q-${q.id}`}
                        checked={isChecked || false}
                        disabled={!!result}
                        onChange={() => {}}
                        className="text-ink-900 focus:ring-ink-800 cursor-pointer"
                      />
                      <span className="flex-1 select-none">{option}</span>
                      {result && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {gradedInfo?.explanation && (
                <div className="pl-8 pt-1">
                  <p className="text-xs text-ink-600 bg-surface-50 p-3 rounded border border-surface-200 leading-relaxed">
                    <span className="font-semibold text-ink-900">Explanation:</span>{' '}
                    {gradedInfo.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      {!result && (
        <div className="pt-4 border-t border-surface-200 flex justify-end">
          <Button variant="primary" size="md" onClick={handleSubmit} loading={submitting}>
            Submit Answers for Scoring
          </Button>
        </div>
      )}
    </div>
  );
};

