import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  courseCreateSchema,
  courseUpdateSchema,
  lessonCreateSchema,
  moduleCreateSchema,
} from '../validators/courseValidator.js';
import { quizCreateSchema } from '../validators/quizValidator.js';
import { challengeCreateSchema } from '../validators/codingValidator.js';

const router = Router();

// Enforce admin RBAC on all admin routes
router.use(requireAuth, requireAdmin);

router.get('/analytics', AdminController.getAnalytics);

// Course Management
router.get('/courses', AdminController.getCourses);
router.post('/courses', validate(courseCreateSchema), AdminController.createCourse);
router.put('/courses/:courseId', validate(courseUpdateSchema), AdminController.updateCourse);
router.delete('/courses/:courseId', AdminController.deleteCourse);

// Curriculum Management
router.post('/courses/:courseId/modules', validate(moduleCreateSchema), AdminController.addModule);
router.post('/courses/:courseId/lessons', validate(lessonCreateSchema), AdminController.addLesson);
router.put('/lessons/:lessonId', AdminController.updateLesson);
router.delete('/lessons/:lessonId', AdminController.deleteLesson);

// Assessments Management
router.post('/quizzes', validate(quizCreateSchema), AdminController.createQuiz);
router.post('/challenges', validate(challengeCreateSchema), AdminController.createChallenge);

// Users Management
router.get('/users', AdminController.getUsers);
router.patch('/users/:userId/role', AdminController.updateUserRole);

// Categories Management
router.get('/categories', AdminController.getCategories);
router.post('/categories', AdminController.createCategory);

export default router;

