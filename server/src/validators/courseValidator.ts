import { z } from 'zod';

export const courseCreateSchema = z.object({
  title: z.string().min(3).max(150),
  shortDescription: z.string().min(10).max(250),
  description: z.string().min(20),
  thumbnail: z.string().min(1),
  category: z.string().min(2),
  subcategory: z.string().optional(),
  instructor: z.object({
    name: z.string().min(2),
    title: z.string().min(2),
    bio: z.string().min(10),
    avatar: z.string().optional(),
  }),
  skillLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  courseType: z.enum(['Theory', 'Coding', 'Mixed']),
  language: z.string().default('English'),
  estimatedDuration: z.string().min(2),
  skills: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  learningObjectives: z.array(z.string()).default([]),
  certificatePolicy: z
    .object({
      requireAllLessons: z.boolean().default(true),
      requireQuizzes: z.boolean().default(true),
      minQuizScorePercent: z.number().min(0).max(100).default(70),
      requireCoding: z.boolean().default(false),
      minCodingSolvedPercent: z.number().min(0).max(100).default(80),
    })
    .default({
      requireAllLessons: true,
      requireQuizzes: true,
      minQuizScorePercent: 70,
      requireCoding: false,
      minCodingSolvedPercent: 80,
    }),
  isFree: z.boolean().default(true),
  price: z.number().min(0).default(0),
  isPublished: z.boolean().default(true),
  isTrending: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export const courseUpdateSchema = courseCreateSchema.partial();

export const lessonCreateSchema = z.object({
  moduleId: z.string().min(1),
  title: z.string().min(3).max(150),
  description: z.string().optional().default(''),
  lessonType: z.enum(['video', 'article']).default('video'),
  youtubeVideoId: z.string().default(''),
  videoUrl: z.string().optional(),
  durationMinutes: z.number().min(1).default(10),
  order: z.number().min(1),
  resources: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
      })
    )
    .default([]),
  isRequired: z.boolean().default(true),
});

export const moduleCreateSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().optional().default(''),
  order: z.number().min(1),
});

