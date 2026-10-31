"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profileController_js_1 = require("../controllers/profileController.js");
const enrollmentController_js_1 = require("../controllers/enrollmentController.js");
const certificateController_js_1 = require("../controllers/certificateController.js");
const quizController_js_1 = require("../controllers/quizController.js");
const codingController_js_1 = require("../controllers/codingController.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const validateMiddleware_js_1 = require("../middleware/validateMiddleware.js");
const authValidator_js_1 = require("../validators/authValidator.js");
const router = (0, express_1.Router)();
// All routes under /me require authentication
router.use(authMiddleware_js_1.requireAuth);
// Profile & Account
router.get('/profile', profileController_js_1.ProfileController.getProfile);
router.patch('/profile', (0, validateMiddleware_js_1.validate)(authValidator_js_1.updateProfileSchema), profileController_js_1.ProfileController.updateProfile);
router.patch('/password', (0, validateMiddleware_js_1.validate)(authValidator_js_1.updatePasswordSchema), profileController_js_1.ProfileController.updatePassword);
router.delete('/account', profileController_js_1.ProfileController.deleteAccount);
// Dashboard & Activity
router.get('/dashboard', profileController_js_1.ProfileController.getDashboard);
router.get('/activity', profileController_js_1.ProfileController.getActivity);
// Enrollments
router.get('/enrollments', enrollmentController_js_1.EnrollmentController.getMyEnrollments);
router.get('/enrollments/:courseId', enrollmentController_js_1.EnrollmentController.getEnrollmentByCourse);
// Certificates
router.get('/certificates', certificateController_js_1.CertificateController.getMyCertificates);
// Assessment history
router.get('/quiz-attempts', quizController_js_1.QuizController.getMyQuizAttempts);
router.get('/coding-submissions', codingController_js_1.CodingController.getMySubmissions);
exports.default = router;
