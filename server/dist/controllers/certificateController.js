"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const Course_js_1 = require("../models/Course.js");
const Enrollment_js_1 = require("../models/Enrollment.js");
const Lesson_js_1 = require("../models/Lesson.js");
const LessonProgress_js_1 = require("../models/LessonProgress.js");
const Quiz_js_1 = require("../models/Quiz.js");
const QuizAttempt_js_1 = require("../models/QuizAttempt.js");
const CodingChallenge_js_1 = require("../models/CodingChallenge.js");
const CodingSubmission_js_1 = require("../models/CodingSubmission.js");
const Certificate_js_1 = require("../models/Certificate.js");
const ActivityEvent_js_1 = require("../models/ActivityEvent.js");
const certificateService_js_1 = require("../services/certificateService.js");
class CertificateController {
    static async claimCertificate(req, res, next) {
        try {
            const user = req.user;
            const { courseId } = req.params;
            const course = await Course_js_1.Course.findById(courseId);
            if (!course) {
                res.status(404).json({ success: false, message: 'Course not found' });
                return;
            }
            const enrollment = await Enrollment_js_1.Enrollment.findOne({ user: user._id, course: course._id });
            if (!enrollment) {
                res.status(403).json({ success: false, message: 'You are not enrolled in this course.' });
                return;
            }
            // Check if certificate already exists
            const existingCert = await Certificate_js_1.Certificate.findOne({ user: user._id, course: course._id });
            if (existingCert) {
                res.json({
                    success: true,
                    message: 'Certificate has already been issued for this course.',
                    data: existingCert,
                });
                return;
            }
            // --- Eligibility Verification Rules ---
            const policy = course.certificatePolicy || {
                requireAllLessons: true,
                requireQuizzes: true,
                minQuizScorePercent: 70,
                requireCoding: false,
                minCodingSolvedPercent: 80,
            };
            const eligibilityErrors = [];
            // 1. Lessons completion check
            if (policy.requireAllLessons) {
                const requiredLessons = await Lesson_js_1.Lesson.find({ course: course._id, isRequired: true });
                const completedProgress = await LessonProgress_js_1.LessonProgress.find({
                    user: user._id,
                    course: course._id,
                    completed: true,
                });
                const completedSet = new Set(completedProgress.map((p) => p.lesson.toString()));
                const missingLessons = requiredLessons.filter((l) => !completedSet.has(l._id.toString()));
                if (missingLessons.length > 0) {
                    eligibilityErrors.push(`Lessons incomplete: ${completedProgress.length} of ${requiredLessons.length} required lessons completed.`);
                }
            }
            // 2. Theory Quizzes check
            if (policy.requireQuizzes) {
                const requiredQuizzes = await Quiz_js_1.Quiz.find({ course: course._id, isRequired: true });
                if (requiredQuizzes.length > 0) {
                    const passedAttempts = await QuizAttempt_js_1.QuizAttempt.find({
                        user: user._id,
                        quiz: { $in: requiredQuizzes.map((q) => q._id) },
                        passed: true,
                    });
                    const passedQuizIds = new Set(passedAttempts.map((a) => a.quiz.toString()));
                    const unpassedQuizzes = requiredQuizzes.filter((q) => !passedQuizIds.has(q._id.toString()));
                    if (unpassedQuizzes.length > 0) {
                        eligibilityErrors.push(`Quizzes incomplete: ${unpassedQuizzes.length} required quizzes have not yet achieved the passing threshold (${policy.minQuizScorePercent}%).`);
                    }
                }
            }
            // 3. Coding Challenges check
            if (policy.requireCoding) {
                const requiredChallenges = await CodingChallenge_js_1.CodingChallenge.find({ course: course._id, isRequired: true });
                if (requiredChallenges.length > 0) {
                    const acceptedSubmissions = await CodingSubmission_js_1.CodingSubmission.find({
                        user: user._id,
                        challenge: { $in: requiredChallenges.map((c) => c._id) },
                        status: 'Accepted',
                    });
                    const solvedChallengeIds = new Set(acceptedSubmissions.map((s) => s.challenge.toString()));
                    const unsolvedChallenges = requiredChallenges.filter((c) => !solvedChallengeIds.has(c._id.toString()));
                    if (unsolvedChallenges.length > 0) {
                        eligibilityErrors.push(`Coding challenges incomplete: ${unsolvedChallenges.length} required challenges have not been solved.`);
                    }
                }
            }
            if (eligibilityErrors.length > 0) {
                res.status(400).json({
                    success: false,
                    message: 'Certificate requirements not yet satisfied.',
                    errors: eligibilityErrors,
                });
                return;
            }
            // --- Requirements Satisfied: Issue Certificate ---
            const year = new Date().getFullYear();
            const randomSuffix = crypto_1.default.randomBytes(4).toString('hex').toUpperCase();
            const certificateId = `CP-${year}-${randomSuffix}`;
            const verificationCode = `VRF-${crypto_1.default.randomBytes(5).toString('hex').toUpperCase()}`;
            const certificate = await Certificate_js_1.Certificate.create({
                user: user._id,
                course: course._id,
                enrollment: enrollment._id,
                certificateId,
                verificationCode,
                issueDate: new Date(),
                status: 'valid',
                completionSnapshot: {
                    courseTitle: course.title,
                    courseCategory: course.category,
                    learnerName: user.name,
                    instructorName: course.instructor?.name || 'CertiPro Faculty',
                    completionDate: new Date(),
                    estimatedDuration: course.estimatedDuration,
                    skills: course.skills,
                    gradePercent: 100,
                },
            });
            // Update enrollment
            enrollment.status = 'completed';
            enrollment.progressPercent = 100;
            enrollment.completionDate = new Date();
            await enrollment.save();
            // Record Activity
            await ActivityEvent_js_1.ActivityEvent.create({
                user: user._id,
                eventType: 'certificate_earned',
                course: course._id,
                title: `Earned Certificate for ${course.title}`,
                metadata: { certificateId, verificationCode },
                timestamp: new Date(),
            });
            res.status(201).json({
                success: true,
                message: 'Certificate generated successfully!',
                data: certificate,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMyCertificates(req, res, next) {
        try {
            const user = req.user;
            const certificates = await Certificate_js_1.Certificate.find({ user: user._id })
                .populate('course', 'title slug thumbnail category instructor')
                .sort({ issueDate: -1 })
                .lean();
            res.json({
                success: true,
                data: certificates,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getCertificateById(req, res, next) {
        try {
            const { certificateId } = req.params;
            const certificate = await Certificate_js_1.Certificate.findOne({
                $or: [{ certificateId }, { _id: certificateId.length === 24 ? certificateId : null }],
            })
                .populate('course', 'title slug thumbnail category instructor')
                .lean();
            if (!certificate) {
                res.status(404).json({ success: false, message: 'Certificate not found' });
                return;
            }
            res.json({
                success: true,
                data: certificate,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async downloadPdf(req, res, next) {
        try {
            const { certificateId } = req.params;
            const certificate = await Certificate_js_1.Certificate.findOne({
                $or: [{ certificateId }, { _id: certificateId.length === 24 ? certificateId : null }],
            });
            if (!certificate) {
                res.status(404).json({ success: false, message: 'Certificate not found' });
                return;
            }
            const pdfBuffer = await certificateService_js_1.CertificateService.generateCertificatePdf(certificate);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="CertiPro-Certificate-${certificate.certificateId}.pdf"`);
            res.setHeader('Content-Length', pdfBuffer.length);
            res.send(pdfBuffer);
        }
        catch (error) {
            next(error);
        }
    }
    static async verifyCertificate(req, res, next) {
        try {
            const { verificationCode } = req.params;
            const certificate = await Certificate_js_1.Certificate.findOne({ verificationCode }).lean();
            if (!certificate) {
                res.status(404).json({
                    success: false,
                    isValid: false,
                    message: 'Certificate not found or verification code is invalid.',
                });
                return;
            }
            // Safe public record: no sensitive private user details (email, passwords, etc.)
            res.json({
                success: true,
                isValid: certificate.status === 'valid',
                data: {
                    certificateId: certificate.certificateId,
                    verificationCode: certificate.verificationCode,
                    courseTitle: certificate.completionSnapshot.courseTitle,
                    courseCategory: certificate.completionSnapshot.courseCategory,
                    learnerName: certificate.completionSnapshot.learnerName,
                    instructorName: certificate.completionSnapshot.instructorName,
                    issueDate: certificate.issueDate,
                    completionDate: certificate.completionSnapshot.completionDate,
                    estimatedDuration: certificate.completionSnapshot.estimatedDuration,
                    skills: certificate.completionSnapshot.skills,
                    status: certificate.status,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CertificateController = CertificateController;
