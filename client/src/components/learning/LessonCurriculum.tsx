import React from 'react';
import { Link } from 'react-router-dom';
import { Lesson, CourseModule, Quiz, CodingChallenge } from '../../types';
import { CheckCircle2, Circle, Play, HelpCircle, Code, ChevronDown } from 'lucide-react';

export interface LessonCurriculumProps {
  courseId: string;
  modules: CourseModule[];
  lessons: Lesson[];
  quizzes: Quiz[];
  challenges: CodingChallenge[];
  currentLessonId?: string;
  completedLessonIds: string[];
}

export const LessonCurriculum: React.FC<LessonCurriculumProps> = ({
  courseId,
  modules,
  lessons,
  quizzes,
  challenges,
  currentLessonId,
  completedLessonIds,
}) => {
  const completedSet = new Set(completedLessonIds);

  return (
    <div className="bg-white rounded-lg border border-surface-200 overflow-hidden text-xs">
      <div className="p-4 bg-surface-50 border-b border-surface-200">
        <h4 className="font-bold text-ink-900 text-sm">Course Curriculum</h4>
        <p className="text-[11px] text-surface-400 mt-0.5">
          {completedLessonIds.length} of {lessons.length} lessons completed
        </p>
      </div>

      <div className="divide-y divide-surface-100 max-h-[600px] overflow-y-auto">
        {modules.map((module) => {
          const moduleLessons = lessons.filter((l) => l.moduleId === module._id || l.moduleId === module.order.toString());

          return (
            <div key={module._id} className="p-3">
              <div className="font-semibold text-ink-900 mb-2 flex items-center justify-between">
                <span>
                  Module {module.order}: {module.title}
                </span>
                <span className="text-[10px] text-surface-400 font-normal">
                  {moduleLessons.length} lessons
                </span>
              </div>

              <div className="space-y-1">
                {moduleLessons.map((lesson) => {
                  const isCurrent = lesson._id === currentLessonId;
                  const isDone = completedSet.has(lesson._id);

                  return (
                    <Link
                      key={lesson._id}
                      to={`/my-learning/${courseId}/learn/${lesson._id}`}
                      className={`flex items-start gap-2.5 p-2 rounded transition-colors ${
                        isCurrent
                          ? 'bg-brand-50 text-brand-900 font-semibold border-l-2 border-brand-700'
                          : 'text-ink-700 hover:bg-surface-50'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-surface-300 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 truncate">
                        <p className="truncate">{lesson.title}</p>
                        <span className="text-[10px] text-surface-400 font-normal">
                          {lesson.durationMinutes} mins
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Course Theory Quizzes */}
        {quizzes.length > 0 && (
          <div className="p-3 bg-amber-50/50">
            <h5 className="font-semibold text-ink-900 mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              Theory Assessment
            </h5>
            <div className="space-y-1">
              {quizzes.map((quiz) => (
                <Link
                  key={quiz._id}
                  to={`/my-learning/${courseId}/quiz`}
                  className="flex items-center justify-between p-2 rounded bg-white border border-amber-200 text-ink-800 hover:bg-amber-50 transition-colors"
                >
                  <span className="font-medium truncate">{quiz.title}</span>
                  <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-mono">
                    Pass: {quiz.passThreshold}%
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Coding Challenges */}
        {challenges.length > 0 && (
          <div className="p-3 bg-teal-50/50">
            <h5 className="font-semibold text-ink-900 mb-2 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-teal-700" />
              Coding Assessment
            </h5>
            <div className="space-y-1">
              {challenges.map((ch) => (
                <Link
                  key={ch._id}
                  to={`/my-learning/${courseId}/coding`}
                  className="flex items-center justify-between p-2 rounded bg-white border border-teal-200 text-ink-800 hover:bg-teal-50 transition-colors"
                >
                  <span className="font-medium truncate">{ch.title}</span>
                  <span className="text-[10px] text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded font-mono">
                    {ch.difficulty}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

