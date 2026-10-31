import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../../types';
import { Clock, BookOpen, Award, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  progressPercent?: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isEnrolled = false,
  progressPercent,
}) => {
  const isCompleted = progressPercent === 100;

  return (
    <div className="flex flex-col bg-white rounded-lg border border-surface-200 overflow-hidden hover:border-surface-300 transition-all duration-150 shadow-sm">
      {/* Thumbnail */}
      <Link to={`/courses/${course.slug}`} className="relative aspect-video w-full overflow-hidden bg-surface-100 block">
        <img
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
          onError={(e) => {
            // Neutral fallback
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          <Badge variant="teal" size="sm">
            {course.category}
          </Badge>
          <Badge variant="neutral" size="sm">
            {course.skillLevel}
          </Badge>
        </div>

        {course.isTrending && (
          <div className="absolute top-2.5 right-2.5">
            <Badge variant="warning" size="sm">
              Trending
            </Badge>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-surface-400 font-medium mb-1.5">
            <span>{course.courseType} Course</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {course.estimatedDuration}
            </span>
          </div>

          <Link to={`/courses/${course.slug}`}>
            <h3 className="text-base font-bold text-ink-900 leading-snug line-clamp-2 hover:text-brand-600 transition-colors">
              {course.title}
            </h3>
          </Link>

          <p className="mt-2 text-xs text-ink-600 line-clamp-2 leading-relaxed">
            {course.shortDescription}
          </p>

          <div className="mt-3 pt-3 border-t border-surface-100 flex items-center justify-between text-xs text-ink-700">
            <span className="truncate max-w-[170px] text-ink-600">
              By <span className="font-medium text-ink-900">{course.instructor?.name}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
              <Award className="w-3 h-3 text-emerald-600" />
              Certificate
            </span>
          </div>
        </div>

        {/* Footer Actions / Progress */}
        <div className="mt-4 pt-3 border-t border-surface-100">
          {isEnrolled ? (
            <div>
              {progressPercent !== undefined && (
                <div className="mb-2">
                  <div className="flex items-center justify-between text-[11px] font-medium text-ink-700 mb-1">
                    <span>{isCompleted ? 'Completed' : 'Course Progress'}</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-surface-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isCompleted ? 'bg-emerald-600' : 'bg-brand-600'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
              <Link to={`/courses/${course.slug}`}>
                <Button variant={isCompleted ? 'outline' : 'primary'} size="sm" className="w-full">
                  {isCompleted ? 'Review Course' : 'Continue Learning'}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-emerald-700">
                {course.isFree ? 'Free Enrollment' : `$${course.price}`}
              </span>
              <Link to={`/courses/${course.slug}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

