"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const moduleSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    order: { type: Number, required: true },
}, { _id: true });
const certificatePolicySchema = new mongoose_1.Schema({
    requireAllLessons: { type: Boolean, default: true },
    requireQuizzes: { type: Boolean, default: true },
    minQuizScorePercent: { type: Number, default: 70 },
    requireCoding: { type: Boolean, default: false },
    minCodingSolvedPercent: { type: Number, default: 80 },
}, { _id: false });
const courseSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    shortDescription: { type: String, required: true, maxlength: 250 },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, default: '' },
    instructor: {
        name: { type: String, required: true },
        title: { type: String, required: true },
        bio: { type: String, required: true },
        avatar: { type: String, default: '' },
    },
    skillLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true,
        index: true,
    },
    courseType: {
        type: String,
        enum: ['Theory', 'Coding', 'Mixed'],
        required: true,
        index: true,
    },
    language: { type: String, default: 'English' },
    estimatedDuration: { type: String, required: true },
    skills: { type: [String], default: [], index: true },
    prerequisites: { type: [String], default: [] },
    learningObjectives: { type: [String], default: [] },
    modules: [moduleSchema],
    certificatePolicy: {
        type: certificatePolicySchema,
        default: () => ({
            requireAllLessons: true,
            requireQuizzes: true,
            minQuizScorePercent: 70,
            requireCoding: false,
            minCodingSolvedPercent: 80,
        }),
    },
    isFree: { type: Boolean, default: true },
    price: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true, index: true },
    isTrending: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    enrolledCount: { type: Number, default: 0, index: true },
    ratingAvg: { type: Number, default: 4.8 },
    ratingCount: { type: Number, default: 0 },
}, {
    timestamps: true,
});
// Text index for search
courseSchema.index({
    title: 'text',
    shortDescription: 'text',
    description: 'text',
    skills: 'text',
    category: 'text',
    'instructor.name': 'text',
}, {
    weights: {
        title: 10,
        skills: 5,
        category: 4,
        shortDescription: 3,
        'instructor.name': 2,
        description: 1,
    },
    name: 'course_text_index',
});
exports.Course = mongoose_1.default.model('Course', courseSchema);
