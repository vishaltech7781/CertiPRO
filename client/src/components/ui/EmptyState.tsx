import React from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}) => {
  return (
    <div className="rounded-lg border border-dashed border-surface-300 bg-white p-8 sm:p-12 text-center max-w-lg mx-auto">
      <div className="w-12 h-12 mx-auto rounded-full bg-surface-100 flex items-center justify-center text-ink-600 mb-4">
        {icon || <BookOpen className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-ink-900">{title}</h3>
      <p className="mt-1.5 text-sm text-surface-400 max-w-sm mx-auto leading-relaxed">{description}</p>
      {(actionLabel && (actionHref || onAction)) && (
        <div className="mt-6">
          {actionHref ? (
            <Link to={actionHref}>
              <Button variant="primary" size="md">
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button variant="primary" size="md" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

