"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_js_1 = require("../controllers/adminController.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const validateMiddleware_js_1 = require("../middleware/validateMiddleware.js");
const courseValidator_js_1 = require("../validators/courseValidator.js");
const quizValidator_js_1 = require("../validators/quizValidator.js");
const codingValidator_js_1 = require("../validators/codingValidator.js");
const router = (0, express_1.Router)();
// Enforce admin RBAC on all admin routes
router.use(authMiddleware_js_1.requireAuth, authMiddleware_js_1.requireAdmin);
router.get('/analytics', adminController_js_1.AdminController.getAnalytics);
// Course Management
router.get('/courses', adminController_js_1.AdminController.getCourses);
router.post('/courses', (0, validateMiddleware_js_1.validate)(courseValidator_js_1.courseCreateSchema), adminController_js_1.AdminController.createCourse);
router.put('/courses/:courseId', (0, validateMiddleware_js_1.validate)(courseValidator_js_1.courseUpdateSchema), adminController_js_1.AdminController.updateCourse);
router.delete('/courses/:courseId', adminController_js_1.AdminController.deleteCourse);
// Curriculum Management
router.post('/courses/:courseId/modules', (0, validateMiddleware_js_1.validate)(courseValidator_js_1.moduleCreateSchema), adminController_js_1.AdminController.addModule);
router.post('/courses/:courseId/lessons', (0, validateMiddleware_js_1.validate)(courseValidator_js_1.lessonCreateSchema), adminController_js_1.AdminController.addLesson);
router.put('/lessons/:lessonId', adminController_js_1.AdminController.updateLesson);
router.delete('/lessons/:lessonId', adminController_js_1.AdminController.deleteLesson);
// Assessments Management
router.post('/quizzes', (0, validateMiddleware_js_1.validate)(quizValidator_js_1.quizCreateSchema), adminController_js_1.AdminController.createQuiz);
router.post('/challenges', (0, validateMiddleware_js_1.validate)(codingValidator_js_1.challengeCreateSchema), adminController_js_1.AdminController.createChallenge);
// Users Management
router.get('/users', adminController_js_1.AdminController.getUsers);
router.patch('/users/:userId/role', adminController_js_1.AdminController.updateUserRole);
// Categories Management
router.get('/categories', adminController_js_1.AdminController.getCategories);
router.post('/categories', adminController_js_1.AdminController.createCategory);
exports.default = router;
