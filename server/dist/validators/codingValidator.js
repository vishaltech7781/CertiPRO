"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.challengeCreateSchema = exports.submitCodeSchema = exports.runCodeSchema = void 0;
const zod_1 = require("zod");
exports.runCodeSchema = zod_1.z.object({
    language: zod_1.z.enum(['javascript', 'python', 'sql']),
    sourceCode: zod_1.z.string().min(1, 'Source code is required').max(10000),
});
exports.submitCodeSchema = zod_1.z.object({
    language: zod_1.z.enum(['javascript', 'python', 'sql']),
    sourceCode: zod_1.z.string().min(1, 'Source code is required').max(10000),
});
exports.challengeCreateSchema = zod_1.z.object({
    courseId: zod_1.z.string(),
    title: zod_1.z.string().min(3),
    problemStatement: zod_1.z.string().min(10),
    difficulty: zod_1.z.enum(['Easy', 'Medium', 'Hard']).default('Easy'),
    topicTags: zod_1.z.array(zod_1.z.string()).default([]),
    supportedLanguages: zod_1.z.array(zod_1.z.string()).default(['javascript', 'python']),
    starterCode: zod_1.z.object({
        javascript: zod_1.z.string().optional(),
        python: zod_1.z.string().optional(),
        sql: zod_1.z.string().optional(),
    }),
    inputFormat: zod_1.z.string().default(''),
    outputFormat: zod_1.z.string().default(''),
    sampleTestCases: zod_1.z.array(zod_1.z.object({
        input: zod_1.z.string(),
        expectedOutput: zod_1.z.string(),
        explanation: zod_1.z.string().optional(),
    })),
    hiddenTestCases: zod_1.z.array(zod_1.z.object({
        input: zod_1.z.string(),
        expectedOutput: zod_1.z.string(),
    })),
    constraints: zod_1.z.array(zod_1.z.string()).default([]),
    isRequired: zod_1.z.boolean().default(true),
    order: zod_1.z.number().default(1),
});
