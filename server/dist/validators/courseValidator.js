"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleCreateSchema = exports.lessonCreateSchema = exports.courseUpdateSchema = exports.courseCreateSchema = void 0;
const zod_1 = require("zod");
exports.courseCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(150),
    shortDescription: zod_1.z.string().min(10).max(250),
    description: zod_1.z.string().min(20),
    thumbnail: zod_1.z.string().min(1),
    category: zod_1.z.string().min(2),
    subcategory: zod_1.z.string().optional(),
    instructor: zod_1.z.object({
        name: zod_1.z.string().min(2),
        title: zod_1.z.string().min(2),
        bio: zod_1.z.string().min(10),
        avatar: zod_1.z.string().optional(),
    }),
    skillLevel: zod_1.z.enum(['Beginner', 'Intermediate', 'Advanced']),
    courseType: zod_1.z.enum(['Theory', 'Coding', 'Mixed']),
    language: zod_1.z.string().default('English'),
    estimatedDuration: zod_1.z.string().min(2),
    skills: zod_1.z.array(zod_1.z.string()).default([]),
    prerequisites: zod_1.z.array(zod_1.z.string()).default([]),
    learningObjectives: zod_1.z.array(zod_1.z.string()).default([]),
    certificatePolicy: zod_1.z
        .object({
        requireAllLessons: zod_1.z.boolean().default(true),
        requireQuizzes: zod_1.z.boolean().default(true),
        minQuizScorePercent: zod_1.z.number().min(0).max(100).default(70),
        requireCoding: zod_1.z.boolean().default(false),
        minCodingSolvedPercent: zod_1.z.number().min(0).max(100).default(80),
    })
        .default({
        requireAllLessons: true,
        requireQuizzes: true,
        minQuizScorePercent: 70,
        requireCoding: false,
        minCodingSolvedPercent: 80,
    }),
    isFree: zod_1.z.boolean().default(true),
    price: zod_1.z.number().min(0).default(0),
    isPublished: zod_1.z.boolean().default(true),
    isTrending: zod_1.z.boolean().default(false),
    isFeatured: zod_1.z.boolean().default(false),
});
exports.courseUpdateSchema = exports.courseCreateSchema.partial();
exports.lessonCreateSchema = zod_1.z.object({
    moduleId: zod_1.z.string().min(1),
    title: zod_1.z.string().min(3).max(150),
    description: zod_1.z.string().optional().default(''),
    lessonType: zod_1.z.enum(['video', 'article']).default('video'),
    youtubeVideoId: zod_1.z.string().default(''),
    videoUrl: zod_1.z.string().optional(),
    durationMinutes: zod_1.z.number().min(1).default(10),
    order: zod_1.z.number().min(1),
    resources: zod_1.z
        .array(zod_1.z.object({
        title: zod_1.z.string(),
        url: zod_1.z.string(),
    }))
        .default([]),
    isRequired: zod_1.z.boolean().default(true),
});
exports.moduleCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(150),
    description: zod_1.z.string().optional().default(''),
    order: zod_1.z.number().min(1),
});
