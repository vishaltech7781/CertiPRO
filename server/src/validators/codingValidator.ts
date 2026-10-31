import { z } from 'zod';

export const runCodeSchema = z.object({
  language: z.enum(['javascript', 'python', 'sql']),
  sourceCode: z.string().min(1, 'Source code is required').max(10000),
});

export const submitCodeSchema = z.object({
  language: z.enum(['javascript', 'python', 'sql']),
  sourceCode: z.string().min(1, 'Source code is required').max(10000),
});

export const challengeCreateSchema = z.object({
  courseId: z.string(),
  title: z.string().min(3),
  problemStatement: z.string().min(10),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Easy'),
  topicTags: z.array(z.string()).default([]),
  supportedLanguages: z.array(z.string()).default(['javascript', 'python']),
  starterCode: z.object({
    javascript: z.string().optional(),
    python: z.string().optional(),
    sql: z.string().optional(),
  }),
  inputFormat: z.string().default(''),
  outputFormat: z.string().default(''),
  sampleTestCases: z.array(
    z.object({
      input: z.string(),
      expectedOutput: z.string(),
      explanation: z.string().optional(),
    })
  ),
  hiddenTestCases: z.array(
    z.object({
      input: z.string(),
      expectedOutput: z.string(),
    })
  ),
  constraints: z.array(z.string()).default([]),
  isRequired: z.boolean().default(true),
  order: z.number().default(1),
});

