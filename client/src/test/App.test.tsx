import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CourseCard } from '../components/courses/CourseCard';
import { Course } from '../types';

const mockCourse: Course = {
  _id: 'test-course-123',
  title: 'Full-Stack Distributed Architecture',
  slug: 'full-stack-distributed-architecture',
  shortDescription: 'Learn event-driven architectures, distributed caching, and microservices.',
  description: 'Full course syllabus.',
  thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
  category: 'Web Development',
  instructor: {
    name: 'Alex Rivera',
    title: 'Staff Architect',
    bio: 'Lead architect.',
  },
  skillLevel: 'Intermediate',
  courseType: 'Mixed',
  language: 'English',
  estimatedDuration: '12 hours',
  skills: ['React', 'Node.js', 'Distributed Systems'],
  prerequisites: ['JavaScript ES6'],
  learningObjectives: ['Design distributed APIs'],
  modules: [],
  certificatePolicy: {
    requireAllLessons: true,
    requireQuizzes: true,
    minQuizScorePercent: 70,
    requireCoding: true,
    minCodingSolvedPercent: 80,
  },
  isFree: true,
  price: 0,
  isPublished: true,
  isTrending: true,
  isFeatured: true,
  enrolledCount: 1250,
  ratingAvg: 4.9,
  ratingCount: 150,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('CertiPro Frontend Component Tests', () => {
  it('renders Button with variants and handles loading state', () => {
    const { rerender } = render(<Button variant="primary">Explore Courses</Button>);
    expect(screen.getByRole('button', { name: /explore courses/i })).toBeInTheDocument();

    rerender(<Button loading>Loading State</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders Badge with correct text and styling', () => {
    render(<Badge variant="teal">Artificial Intelligence</Badge>);
    expect(screen.getByText('Artificial Intelligence')).toBeInTheDocument();
  });

  it('renders CourseCard with title, category, instructor, and duration', () => {
    render(
      <BrowserRouter>
        <CourseCard course={mockCourse} />
      </BrowserRouter>
    );

    expect(screen.getByText('Full-Stack Distributed Architecture')).toBeInTheDocument();
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
    expect(screen.getByText('12 hours')).toBeInTheDocument();
    expect(screen.getByText('Free Enrollment')).toBeInTheDocument();
  });

  it('renders CourseCard with continue learning state when enrolled', () => {
    render(
      <BrowserRouter>
        <CourseCard course={mockCourse} isEnrolled={true} progressPercent={75} />
      </BrowserRouter>
    );

    expect(screen.getByText('Course Progress')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Continue Learning')).toBeInTheDocument();
  });
});

