"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const Course_js_1 = require("../models/Course.js");
const Lesson_js_1 = require("../models/Lesson.js");
const Quiz_js_1 = require("../models/Quiz.js");
const CodingChallenge_js_1 = require("../models/CodingChallenge.js");
const Enrollment_js_1 = require("../models/Enrollment.js");
const Certificate_js_1 = require("../models/Certificate.js");
const User_js_1 = require("../models/User.js");
const Category_js_1 = require("../models/Category.js");
class AdminController {
    static async getAnalytics(req, res, next) {
        try {
            const [totalUsers, totalLearners, totalCourses, publishedCourses, totalEnrollments, completedEnrollments, totalCertificates,] = await Promise.all([
                User_js_1.User.countDocuments(),
                User_js_1.User.countDocuments({ role: 'learner' }),
                Course_js_1.Course.countDocuments(),
                Course_js_1.Course.countDocuments({ isPublished: true }),
                Enrollment_js_1.Enrollment.countDocuments(),
                Enrollment_js_1.Enrollment.countDocuments({ status: 'completed' }),
                Certificate_js_1.Certificate.countDocuments({ status: 'valid' }),
            ]);
            const topCourses = await Course_js_1.Course.find()
                .sort({ enrolledCount: -1 })
                .limit(5)
                .select('title category enrolledCount ratingAvg isPublished')
                .lean();
            res.json({
                success: true,
                data: {
                    totalUsers,
                    totalLearners,
                    totalCourses,
                    publishedCourses,
                    totalEnrollments,
                    completedEnrollments,
                    totalCertificates,
                    completionRate: totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
                    topCourses,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getCourses(req, res, next) {
        try {
            const { page = '1', limit = '20', q } = req.query;
            const pageNum = parseInt(page, 10) || 1;
            const limitNum = parseInt(limit, 10) || 20;
            const filter = {};
            if (q && typeof q === 'string') {
                filter.title = { $regex: q.trim(), $options: 'i' };
            }
            const [courses, total] = await Promise.all([
                Course_js_1.Course.find(filter)
                    .sort({ createdAt: -1 })
                    .skip((pageNum - 1) * limitNum)
                    .limit(limitNum)
                    .lean(),
                Course_js_1.Course.countDocuments(filter),
            ]);
            res.json({
                success: true,
                data: courses,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async createCourse(req, res, next) {
        try {
            const body = req.body;
            const slug = body.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            const existing = await Course_js_1.Course.findOne({ slug });
            const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;
            const course = await Course_js_1.Course.create({
                ...body,
                slug: finalSlug,
            });
            res.status(201).json({
                success: true,
                message: 'Course created successfully.',
                data: course,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateCourse(req, res, next) {
        try {
            const { courseId } = req.params;
            const course = await Course_js_1.Course.findByIdAndUpdate(courseId, req.body, { new: true });
            if (!course) {
                res.status(404).json({ success: false, message: 'Course not found' });
                return;
            }
            res.json({
                success: true,
                message: 'Course updated successfully.',
                data: course,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteCourse(req, res, next) {
        try {
            const { courseId } = req.params;
            const course = await Course_js_1.Course.findById(courseId);
            if (!course) {
                res.status(404).json({ success: false, message: 'Course not found' });
                return;
            }
            // Check if learners are enrolled; if yes, unpublish instead of breaking enrollment records
            const enrollmentCount = await Enrollment_js_1.Enrollment.countDocuments({ course: courseId });
            if (enrollmentCount > 0) {
                course.isPublished = false;
                await course.save();
                res.json({
                    success: true,
                    message: 'Course has existing enrollments and has been safely unpublished rather than deleted.',
                });
                return;
            }
            await Course_js_1.Course.findByIdAndDelete(courseId);
            await Lesson_js_1.Lesson.deleteMany({ course: courseId });
            await Quiz_js_1.Quiz.deleteMany({ course: courseId });
            await CodingChallenge_js_1.CodingChallenge.deleteMany({ course: courseId });
            res.json({
                success: true,
                message: 'Course and associated curriculum deleted successfully.',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async addModule(req, res, next) {
        try {
            const { courseId } = req.params;
            const { title, description, order } = req.body;
            const course = await Course_js_1.Course.findById(courseId);
            if (!course) {
                res.status(404).json({ success: false, message: 'Course not found' });
                return;
            }
            course.modules.push({
                title,
                description,
                order: order || course.modules.length + 1,
            });
            await course.save();
            res.status(201).json({
                success: true,
                message: 'Module added successfully.',
                data: course.modules,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async addLesson(req, res, next) {
        try {
            const { courseId } = req.params;
            const body = req.body;
            const course = await Course_js_1.Course.findById(courseId);
            if (!course) {
                res.status(404).json({ success: false, message: 'Course not found' });
                return;
            }
            const lesson = await Lesson_js_1.Lesson.create({
                ...body,
                course: courseId,
            });
            // Update total lessons count in active enrollments
            const totalLessons = await Lesson_js_1.Lesson.countDocuments({ course: courseId });
            await Enrollment_js_1.Enrollment.updateMany({ course: courseId }, { totalLessonsCount: totalLessons });
            res.status(201).json({
                success: true,
                message: 'Lesson created successfully.',
                data: lesson,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateLesson(req, res, next) {
        try {
            const { lessonId } = req.params;
            const lesson = await Lesson_js_1.Lesson.findByIdAndUpdate(lessonId, req.body, { new: true });
            if (!lesson) {
                res.status(404).json({ success: false, message: 'Lesson not found' });
                return;
            }
            res.json({
                success: true,
                message: 'Lesson updated successfully.',
                data: lesson,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteLesson(req, res, next) {
        try {
            const { lessonId } = req.params;
            const lesson = await Lesson_js_1.Lesson.findByIdAndDelete(lessonId);
            if (!lesson) {
                res.status(404).json({ success: false, message: 'Lesson not found' });
                return;
            }
            // Update enrollment counts
            const totalLessons = await Lesson_js_1.Lesson.countDocuments({ course: lesson.course });
            await Enrollment_js_1.Enrollment.updateMany({ course: lesson.course }, { totalLessonsCount: totalLessons });
            res.json({
                success: true,
                message: 'Lesson removed.',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async createQuiz(req, res, next) {
        try {
            const body = req.body;
            const quiz = await Quiz_js_1.Quiz.create({
                ...body,
                course: body.courseId,
            });
            res.status(201).json({
                success: true,
                message: 'Quiz created successfully.',
                data: quiz,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async createChallenge(req, res, next) {
        try {
            const body = req.body;
            const challenge = await CodingChallenge_js_1.CodingChallenge.create({
                ...body,
                course: body.courseId,
            });
            res.status(201).json({
                success: true,
                message: 'Coding challenge created successfully.',
                data: challenge,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getUsers(req, res, next) {
        try {
            const { page = '1', limit = '20', role } = req.query;
            const pageNum = parseInt(page, 10) || 1;
            const limitNum = parseInt(limit, 10) || 20;
            const filter = {};
            if (role && role !== 'all') {
                filter.role = role;
            }
            const [users, total] = await Promise.all([
                User_js_1.User.find(filter)
                    .sort({ createdAt: -1 })
                    .skip((pageNum - 1) * limitNum)
                    .limit(limitNum)
                    .select('-passwordHash')
                    .lean(),
                User_js_1.User.countDocuments(filter),
            ]);
            res.json({
                success: true,
                data: users,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateUserRole(req, res, next) {
        try {
            const { userId } = req.params;
            const { role } = req.body;
            if (!['learner', 'admin'].includes(role)) {
                res.status(400).json({ success: false, message: 'Invalid role.' });
                return;
            }
            const user = await User_js_1.User.findByIdAndUpdate(userId, { role }, { new: true }).select('-passwordHash');
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }
            res.json({
                success: true,
                message: `User role updated to ${role}.`,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getCategories(req, res, next) {
        try {
            const categories = await Category_js_1.Category.find().sort({ displayOrder: 1 }).lean();
            res.json({ success: true, data: categories });
        }
        catch (error) {
            next(error);
        }
    }
    static async createCategory(req, res, next) {
        try {
            const { name, description, iconName } = req.body;
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            const category = await Category_js_1.Category.create({
                name,
                slug,
                description,
                iconName: iconName || 'BookOpen',
                displayOrder: 0,
            });
            res.status(201).json({
                success: true,
                message: 'Category created successfully.',
                data: category,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminController = AdminController;
