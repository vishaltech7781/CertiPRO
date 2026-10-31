import { z } from 'zod';

export const submitQuizSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedAnswers: z.array(z.number()),
    })
  ),
});

export const quizCreateSchema = z.object({
  courseId: z.string(),
  moduleId: z.string().optional(),
  lessonId: z.string().optional(),
  title: z.string().min(3),
  instructions: z.string().default('Answer all questions and submit.'),
  passThreshold: z.number().min(0).max(100).default(70),
  maximumAttempts: z.number().min(1).default(5),
  isRequired: z.boolean().default(true),
  questions: z.array(
    z.object({
      id: z.string(),
      questionText: z.string().min(3),
      type: z.enum(['multiple-choice', 'true-false', 'multiple-select']).default('multiple-choice'),
      options: z.array(z.string()).min(2),
      correctAnswers: z.array(z.number()).min(1),
      explanation: z.string().default(''),
      points: z.number().default(1),
    })
  ),
});

