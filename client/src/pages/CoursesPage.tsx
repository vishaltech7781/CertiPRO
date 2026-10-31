import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Course, Category } from '../types';
import { CourseCard } from '../components/courses/CourseCard';
import { CourseFilters, FilterState } from '../components/courses/CourseFilters';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, X, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const CoursesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state with URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') || 'All',
    skillLevel: searchParams.get('skillLevel') || 'All',
    courseType: searchParams.get('courseType') || 'All',
    isFree: searchParams.get('isFree') || 'All',
    sort: searchParams.get('sort') || 'popular',
  });
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Update URL search parameters when filters change
  const updateUrl = (newFilters: FilterState, query: string, newPage: number) => {
    const params: Record<string, string> = {};
    if (query.trim()) params.q = query.trim();
    if (newFilters.category !== 'All') params.category = newFilters.category;
    if (newFilters.skillLevel !== 'All') params.skillLevel = newFilters.skillLevel;
    if (newFilters.courseType !== 'All') params.courseType = newFilters.courseType;
    if (newFilters.isFree !== 'All') params.isFree = newFilters.isFree;
    if (newFilters.sort !== 'popular') params.sort = newFilters.sort;
    if (newPage > 1) params.page = newPage.toString();

    setSearchParams(params);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
    updateUrl(newFilters, searchQuery, 1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    updateUrl(filters, searchQuery, 1);
  };

  const handleResetFilters = () => {
    const resetState: FilterState = {
      category: 'All',
      skillLevel: 'All',
      courseType: 'All',
      isFree: 'All',
      sort: 'popular',
    };
    setSearchQuery('');
    setFilters(resetState);
    setPage(1);
    setSearchParams({});
  };

  // Fetch Categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories'),
  });

  // Query string for backend API
  const queryParams = new URLSearchParams();
  if (searchQuery.trim()) queryParams.set('q', searchQuery.trim());
  if (filters.category !== 'All') queryParams.set('category', filters.category);
  if (filters.skillLevel !== 'All') queryParams.set('skillLevel', filters.skillLevel);
  if (filters.courseType !== 'All') queryParams.set('courseType', filters.courseType);
  if (filters.isFree !== 'All') queryParams.set('isFree', filters.isFree);
  queryParams.set('sort', filters.sort);
  queryParams.set('page', page.toString());
  queryParams.set('limit', '9');

  // Fetch Courses with filters
  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['courses-catalog', queryParams.toString()],
    queryFn: () => api.get<Course[]>(`/courses?${queryParams.toString()}`),
  });

  const categories: Category[] = categoriesData?.data || [];
  const courses: Course[] = coursesData?.data || [];
  const pagination = coursesData?.pagination || { total: 0, totalPages: 1 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      {/* Header & Search Bar */}
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
            Course Catalog
          </h1>
          <p className="text-xs text-ink-600 mt-1">
            Browse verified courses across computer science, distributed systems, and software engineering.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search by title, technology (e.g. React, Python, AWS), instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-surface-200 rounded-md pl-10 pr-10 py-2.5 text-xs text-ink-900 placeholder:text-surface-400 focus:outline-none focus:border-ink-800 transition-colors shadow-sm"
            />
            <Search className="w-4 h-4 text-surface-400 absolute left-3.5 top-3 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  updateUrl(filters, '', 1);
                }}
                className="absolute right-3 top-2.5 p-0.5 rounded text-surface-400 hover:text-ink-900"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="sort-select" className="text-xs text-surface-400 whitespace-nowrap hidden sm:inline">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={filters.sort}
              onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value })}
              className="bg-white border border-surface-200 text-xs text-ink-900 py-2.5 px-3 rounded-md focus:outline-none focus:border-ink-800 shadow-sm w-full sm:w-auto"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Recently Added</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Mobile Filter Drawer Button */}
            <Button
              variant="outline"
              size="md"
              className="lg:hidden flex items-center gap-1.5"
              onClick={() => setMobileFilterOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Active Filters Display Chips */}
        {(filters.category !== 'All' ||
          filters.skillLevel !== 'All' ||
          filters.courseType !== 'All' ||
          filters.isFree !== 'All' ||
          searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
            <span className="text-surface-400 text-[11px]">Active Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-surface-200 text-ink-800 px-2 py-0.5 rounded">
                Search: "{searchQuery}"
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => {
                    setSearchQuery('');
                    updateUrl(filters, '', 1);
                  }}
                />
              </span>
            )}
            {filters.category !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-surface-200 text-ink-800 px-2 py-0.5 rounded">
                Category: {filters.category}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => handleFilterChange({ ...filters, category: 'All' })}
                />
              </span>
            )}
            {filters.skillLevel !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-surface-200 text-ink-800 px-2 py-0.5 rounded">
                Level: {filters.skillLevel}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => handleFilterChange({ ...filters, skillLevel: 'All' })}
                />
              </span>
            )}
            {filters.courseType !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-surface-200 text-ink-800 px-2 py-0.5 rounded">
                Type: {filters.courseType}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => handleFilterChange({ ...filters, courseType: 'All' })}
                />
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-brand-700 hover:text-brand-800 font-semibold text-[11px] underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Layout: Sidebar Filters + Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1">
          <CourseFilters
            categories={categories}
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex bg-black/40 lg:hidden">
            <div className="w-4/5 max-w-xs bg-white h-full overflow-y-auto p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-surface-200 mb-4">
                  <h3 className="font-bold text-sm text-ink-900">Filters</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <CourseFilters
                  categories={categories}
                  filters={filters}
                  onChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </div>
              <Button
                variant="primary"
                size="md"
                className="w-full mt-4"
                onClick={() => setMobileFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {/* Course Cards Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-surface-400">
            <span>
              Showing <strong className="text-ink-900">{courses.length}</strong> of{' '}
              <strong className="text-ink-900">{pagination.total}</strong> courses
            </span>
          </div>

          {isLoading ? (
            <LoadingSpinner message="Searching courses..." />
          ) : courses.length === 0 ? (
            <EmptyState
              title="No matching courses found"
              description="Try adjusting your keywords, selecting different categories, or resetting the filters."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  isEnrolled={course.isEnrolled}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="pt-6 border-t border-surface-200 flex items-center justify-between text-xs">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => {
                  setPage(page - 1);
                  updateUrl(filters, searchQuery, page - 1);
                }}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </Button>

              <span className="text-surface-400 font-mono">
                Page {page} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => {
                  setPage(page + 1);
                  updateUrl(filters, searchQuery, page + 1);
                }}
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
