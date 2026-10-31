import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { Category } from '../../types';

export interface FilterState {
  category: string;
  skillLevel: string;
  courseType: string;
  isFree: string;
  sort: string;
}

export interface CourseFiltersProps {
  categories: Category[];
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  className?: string;
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  categories,
  filters,
  onChange,
  onReset,
  className = '',
}) => {
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.skillLevel !== 'All' ||
    filters.courseType !== 'All' ||
    filters.isFree !== 'All';

  return (
    <div className={`bg-white rounded-lg border border-surface-200 p-5 space-y-6 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-surface-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ink-700" />
          <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wider">Refine Courses</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-brand-700 hover:text-brand-800 font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <div>
        <label className="block text-xs font-semibold text-ink-900 mb-2">Category</label>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <label className="flex items-center gap-2 text-xs text-ink-700 cursor-pointer hover:text-ink-900">
            <input
              type="radio"
              name="category"
              checked={filters.category === 'All'}
              onChange={() => handleFilterChange('category', 'All')}
              className="text-ink-900 focus:ring-ink-800"
            />
            <span>All Categories</span>
          </label>
          {categories.map((cat) => (
            <label
              key={cat._id}
              className="flex items-center justify-between gap-2 text-xs text-ink-700 cursor-pointer hover:text-ink-900"
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat.name}
                  onChange={() => handleFilterChange('category', cat.name)}
                  className="text-ink-900 focus:ring-ink-800"
                />
                <span>{cat.name}</span>
              </div>
              {cat.courseCount !== undefined && (
                <span className="text-[10px] text-surface-400 bg-surface-100 px-1.5 py-0.2 rounded font-mono">
                  {cat.courseCount}
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Skill Level Filter */}
      <div>
        <label className="block text-xs font-semibold text-ink-900 mb-2">Skill Level</label>
        <div className="space-y-1.5">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
            <label
              key={lvl}
              className="flex items-center gap-2 text-xs text-ink-700 cursor-pointer hover:text-ink-900"
            >
              <input
                type="radio"
                name="skillLevel"
                checked={filters.skillLevel === lvl}
                onChange={() => handleFilterChange('skillLevel', lvl)}
                className="text-ink-900 focus:ring-ink-800"
              />
              <span>{lvl === 'All' ? 'All Skill Levels' : lvl}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Course Type Filter */}
      <div>
        <label className="block text-xs font-semibold text-ink-900 mb-2">Course Type</label>
        <div className="space-y-1.5">
          {['All', 'Theory', 'Coding', 'Mixed'].map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 text-xs text-ink-700 cursor-pointer hover:text-ink-900"
            >
              <input
                type="radio"
                name="courseType"
                checked={filters.courseType === type}
                onChange={() => handleFilterChange('courseType', type)}
                className="text-ink-900 focus:ring-ink-800"
              />
              <span>{type === 'All' ? 'All Types (Theory & Coding)' : `${type} Oriented`}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Pricing / Enrollment Filter */}
      <div>
        <label className="block text-xs font-semibold text-ink-900 mb-2">Access</label>
        <div className="space-y-1.5">
          {[
            { label: 'All Courses', value: 'All' },
            { label: 'Free by Default', value: 'true' },
          ].map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-2 text-xs text-ink-700 cursor-pointer hover:text-ink-900"
            >
              <input
                type="radio"
                name="isFree"
                checked={filters.isFree === item.value}
                onChange={() => handleFilterChange('isFree', item.value)}
                className="text-ink-900 focus:ring-ink-800"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

