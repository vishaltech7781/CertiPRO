"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Enrollment_js_1 = require("../models/Enrollment.js");
const Certificate_js_1 = require("../models/Certificate.js");
const ActivityEvent_js_1 = require("../models/ActivityEvent.js");
const Course_js_1 = require("../models/Course.js");
class ProfileController {
    static async getProfile(req, res, next) {
        try {
            const user = req.user;
            const [enrolledCount, completedCount, certificatesCount] = await Promise.all([
                Enrollment_js_1.Enrollment.countDocuments({ user: user._id }),
                Enrollment_js_1.Enrollment.countDocuments({ user: user._id, status: 'completed' }),
                Certificate_js_1.Certificate.countDocuments({ user: user._id, status: 'valid' }),
            ]);
            res.json({
                success: true,
                data: {
                    ...user.toJSON(),
                    stats: {
                        enrolledCount,
                        completedCount,
                        certificatesCount,
                    },
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProfile(req, res, next) {
        try {
            const user = req.user;
            const { name, bio, learningInterests, avatar } = req.body;
            if (name)
                user.name = name;
            if (bio !== undefined)
                user.bio = bio;
            if (learningInterests)
                user.learningInterests = learningInterests;
            if (avatar !== undefined)
                user.avatar = avatar;
            await user.save();
            res.json({
                success: true,
                message: 'Profile updated successfully.',
                data: user.toJSON(),
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updatePassword(req, res, next) {
        try {
            const user = req.user;
            const { currentPassword, newPassword } = req.body;
            const isMatch = await bcryptjs_1.default.compare(currentPassword, user.passwordHash);
            if (!isMatch) {
                res.status(400).json({ success: false, message: 'Current password is incorrect.' });
                return;
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            user.passwordHash = await bcryptjs_1.default.hash(newPassword, salt);
            await user.save();
            res.json({
                success: true,
                message: 'Password changed successfully.',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteAccount(req, res, next) {
        try {
            const user = req.user;
            // Mark account as suspended / deactivated and clear personal identifiable info
            user.accountStatus = 'suspended';
            user.name = 'Deactivated Learner';
            user.email = `deactivated_${user._id}@certipro.local`;
            await user.save();
            res.clearCookie('cp_token');
            res.json({
                success: true,
                message: 'Your account has been deactivated in accordance with CertiPro privacy policy.',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getActivity(req, res, next) {
        try {
            const user = req.user;
            const activities = await ActivityEvent_js_1.ActivityEvent.find({ user: user._id })
                .populate('course', 'title slug')
                .sort({ timestamp: -1 })
                .limit(20)
                .lean();
            res.json({
                success: true,
                data: activities,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getDashboard(req, res, next) {
        try {
            const user = req.user;
            // 1. Fetch In-Progress and Enrolled courses
            const enrollments = await Enrollment_js_1.Enrollment.find({ user: user._id })
                .populate({
                path: 'course',
                select: 'title slug thumbnail category instructor skillLevel courseType estimatedDuration',
            })
                .sort({ lastAccessedAt: -1 })
                .lean();
            const inProgress = enrollments.filter((e) => e.status === 'in-progress');
            const completed = enrollments.filter((e) => e.status === 'completed');
            // 2. Certificates
            const certificates = await Certificate_js_1.Certificate.find({ user: user._id })
                .populate('course', 'title slug thumbnail')
                .sort({ issueDate: -1 })
                .lean();
            // 3. Recent activity
            const recentActivity = await ActivityEvent_js_1.ActivityEvent.find({ user: user._id })
                .populate('course', 'title slug')
                .sort({ timestamp: -1 })
                .limit(8)
                .lean();
            // 4. Recommendations: courses matching user interests or popular in enrolled categories
            const enrolledCourseIds = enrollments.map((e) => e.course?._id).filter(Boolean);
            const userCategories = enrollments.map((e) => e.course?.category).filter(Boolean);
            const recFilter = {
                _id: { $nin: enrolledCourseIds },
                isPublished: true,
            };
            if (user.learningInterests && user.learningInterests.length > 0) {
                recFilter.$or = [
                    { category: { $in: user.learningInterests } },
                    { skills: { $in: user.learningInterests } },
                ];
            }
            else if (userCategories.length > 0) {
                recFilter.category = { $in: userCategories };
            }
            let recommendations = await Course_js_1.Course.find(recFilter)
                .sort({ enrolledCount: -1 })
                .limit(4)
                .lean();
            if (recommendations.length === 0) {
                recommendations = await Course_js_1.Course.find({
                    _id: { $nin: enrolledCourseIds },
                    isPublished: true,
                })
                    .sort({ enrolledCount: -1 })
                    .limit(4)
                    .lean();
            }
            res.json({
                success: true,
                data: {
                    stats: {
                        totalEnrolled: enrollments.length,
                        inProgressCount: inProgress.length,
                        completedCount: completed.length,
                        certificatesCount: certificates.length,
                    },
                    inProgress,
                    completed,
                    certificates,
                    recentActivity,
                    recommendations,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProfileController = ProfileController;
