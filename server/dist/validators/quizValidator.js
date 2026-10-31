"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizCreateSchema = exports.submitQuizSchema = void 0;
const zod_1 = require("zod");
exports.submitQuizSchema = zod_1.z.object({
    answers: zod_1.z.array(zod_1.z.object({
        questionId: zod_1.z.string(),
        selectedAnswers: zod_1.z.array(zod_1.z.number()),
    })),
});
exports.quizCreateSchema = zod_1.z.object({
    courseId: zod_1.z.string(),
    moduleId: zod_1.z.string().optional(),
    lessonId: zod_1.z.string().optional(),
    title: zod_1.z.string().min(3),
    instructions: zod_1.z.string().default('Answer all questions and submit.'),
    passThreshold: zod_1.z.number().min(0).max(100).default(70),
    maximumAttempts: zod_1.z.number().min(1).default(5),
    isRequired: zod_1.z.boolean().default(true),
    questions: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        questionText: zod_1.z.string().min(3),
        type: zod_1.z.enum(['multiple-choice', 'true-false', 'multiple-select']).default('multiple-choice'),
        options: zod_1.z.array(zod_1.z.string()).min(2),
        correctAnswers: zod_1.z.array(zod_1.z.number()).min(1),
        explanation: zod_1.z.string().default(''),
        points: zod_1.z.number().default(1),
    })),
});
