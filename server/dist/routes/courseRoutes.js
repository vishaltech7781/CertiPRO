"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseController_js_1 = require("../controllers/courseController.js");
const enrollmentController_js_1 = require("../controllers/enrollmentController.js");
const certificateController_js_1 = require("../controllers/certificateController.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// Public / optionally authenticated catalog discovery
router.get('/', authMiddleware_js_1.optionalAuth, courseController_js_1.CourseController.getCourses);
router.get('/trending', courseController_js_1.CourseController.getTrending);
router.get('/recent', courseController_js_1.CourseController.getRecent);
router.get('/:slug', authMiddleware_js_1.optionalAuth, courseController_js_1.CourseController.getCourseBySlug);
router.get('/:courseId/curriculum', authMiddleware_js_1.optionalAuth, courseController_js_1.CourseController.getCurriculum);
// Enrollment & learning on a specific course
router.post('/:courseId/enroll', authMiddleware_js_1.requireAuth, enrollmentController_js_1.EnrollmentController.enroll);
router.post('/:courseId/lessons/:lessonId/complete', authMiddleware_js_1.requireAuth, enrollmentController_js_1.EnrollmentController.completeLesson);
router.get('/:courseId/progress', authMiddleware_js_1.requireAuth, enrollmentController_js_1.EnrollmentController.getCourseProgress);
// Certificate claim on a specific course
router.post('/:courseId/certificate', authMiddleware_js_1.requireAuth, certificateController_js_1.CertificateController.claimCertificate);
exports.default = router;
