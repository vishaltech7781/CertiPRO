"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseController = void 0;
const Course_js_1 = require("../models/Course.js");
const Lesson_js_1 = require("../models/Lesson.js");
const Quiz_js_1 = require("../models/Quiz.js");
const CodingChallenge_js_1 = require("../models/CodingChallenge.js");
const Enrollment_js_1 = require("../models/Enrollment.js");
class CourseController {
    static async getCourses(req, res, next) {
        try {
            const { q, category, skillLevel, courseType, isFree, language, hasCertificate, sort = 'popular', page = '1', limit = '12', } = req.query;
            const pageNum = Math.max(1, parseInt(page, 10) || 1);
            const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
            const skip = (pageNum - 1) * limitNum;
            const filter = { isPublished: true };
            // Search term
            if (q && typeof q === 'string' && q.trim()) {
                filter.$or = [
                    { title: { $regex: q.trim(), $options: 'i' } },
                    { shortDescription: { $regex: q.trim(), $options: 'i' } },
                    { skills: { $regex: q.trim(), $options: 'i' } },
                    { category: { $regex: q.trim(), $options: 'i' } },
                    { 'instructor.name': { $regex: q.trim(), $options: 'i' } },
                ];
            }
            // Category filter
            if (category && typeof category === 'string' && category !== 'All') {
                filter.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
            }
            // Skill level filter
            if (skillLevel && typeof skillLevel === 'string' && skillLevel !== 'All') {
                filter.skillLevel = skillLevel;
            }
            // Course type filter
            if (courseType && typeof courseType === 'string' && courseType !== 'All') {
                filter.courseType = courseType;
            }
            // Free / Paid filter
            if (isFree !== undefined && isFree !== '') {
                filter.isFree = isFree === 'true';
            }
            // Language filter
            if (language && typeof language === 'string' && language !== 'All') {
                filter.language = language;
            }
            // Sort order
            let sortObj = { enrolledCount: -1 };
            if (sort === 'newest') {
                sortObj = { createdAt: -1 };
            }
            else if (sort === 'rating') {
                sortObj = { ratingAvg: -1, ratingCount: -1 };
            }
            else if (sort === 'popular') {
                sortObj = { enrolledCount: -1, isTrending: -1 };
            }
            else if (sort === 'relevance' && q) {
                sortObj = { enrolledCount: -1 };
            }
            const [courses, total] = await Promise.all([
                Course_js_1.Course.find(filter).sort(sortObj).skip(skip).limit(limitNum).lean(),
                Course_js_1.Course.countDocuments(filter),
            ]);
            // If user is authenticated, check their enrollment status for each course
            let enrolledCourseIds = new Set();
            if (req.user) {
                const enrollments = await Enrollment_js_1.Enrollment.find({
                    user: req.user._id,
                    course: { $in: courses.map((c) => c._id) },
                })
                    .select('course status progressPercent')
                    .lean();
                for (const enr of enrollments) {
                    enrolledCourseIds.add(enr.course.toString());
                }
            }
            const enrichedCourses = courses.map((c) => ({
                ...c,
                isEnrolled: enrolledCourseIds.has(c._id.toString()),
            }));
            res.json({
                success: true,
                data: enrichedCourses,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                    hasMore: skip + courses.length < total,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getCourseBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const course = await Course_js_1.Course.findOne({ slug }).lean();
            if (!course) {
                res.status(404).json({ success: false, message: 'Course not found' });
                return;
            }
            // Fetch lessons for this course
            const lessons = await Lesson_js_1.Lesson.find({ course: course._id }).sort({ order: 1 }).lean();
            // Check for quizzes and coding challenges counts
            const [quizCount, codingCount] = await Promise.all([
                Quiz_js_1.Quiz.countDocuments({ course: course._id }),
                CodingChallenge_js_1.CodingChallenge.countDocuments({ course: course._id }),
            ]);
            let isEnrolled = false;
            let enrollmentData = null;
            if (req.user) {
                const enrollment = await Enrollment_js_1.Enrollment.findOne({
                    user: req.user._id,
                    course: course._id,
                }).lean();
                if (enrollment) {
                    isEnrolled = true;
                    enrollmentData = enrollment;
                }
            }
            res.json({
                success: true,
                data: {
                    ...course,
                    lessons,
                    totalLessons: lessons.length,
                    quizCount,
                    codingCount,
                    isEnrolled,
                    enrollment: enrollmentData,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getCurriculum(req, res, next) {
        try {
            const { courseId } = req.params;
            const course = await Course_js_1.Course.findById(courseId).lean();
            if (!course) {
                res.status(404).json({ success: false, message: 'Course not found' });
                return;
            }
            const lessons = await Lesson_js_1.Lesson.find({ course: courseId }).sort({ order: 1 }).lean();
            const quizzes = await Quiz_js_1.Quiz.find({ course: courseId }).select('-questions.correctAnswers').lean();
            const challenges = await CodingChallenge_js_1.CodingChallenge.find({ course: courseId })
                .select('-hiddenTestCases')
                .lean();
            res.json({
                success: true,
                data: {
                    modules: course.modules,
                    lessons,
                    quizzes,
                    challenges,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getTrending(req, res, next) {
        try {
            const trendingCourses = await Course_js_1.Course.find({ isPublished: true, isTrending: true })
                .limit(6)
                .lean();
            res.json({
                success: true,
                data: trendingCourses,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getRecent(req, res, next) {
        try {
            const recentCourses = await Course_js_1.Course.find({ isPublished: true })
                .sort({ createdAt: -1 })
                .limit(6)
                .lean();
            res.json({
                success: true,
                data: recentCourses,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CourseController = CourseController;
