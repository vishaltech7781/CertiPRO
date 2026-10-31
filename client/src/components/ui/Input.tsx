import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-ink-800 mb-1.5">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-surface-300 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'border-surface-300 focus:border-ink-700 focus:ring-ink-200'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-surface-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

