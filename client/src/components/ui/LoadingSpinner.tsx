import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string; className?: string }> = ({
  message = 'Loading...',
  className = 'py-12',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="w-8 h-8 border-3 border-surface-200 border-t-ink-800 rounded-full animate-spin" />
      {message && <p className="mt-3 text-sm text-surface-400 font-medium">{message}</p>}
    </div>
  );
};

