import { Router } from 'express';
import { ProfileController } from '../controllers/profileController.js';
import { EnrollmentController } from '../controllers/enrollmentController.js';
import { CertificateController } from '../controllers/certificateController.js';
import { QuizController } from '../controllers/quizController.js';
import { CodingController } from '../controllers/codingController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { updateProfileSchema, updatePasswordSchema } from '../validators/authValidator.js';

const router = Router();

// All routes under /me require authentication
router.use(requireAuth);

// Profile & Account
router.get('/profile', ProfileController.getProfile);
router.patch('/profile', validate(updateProfileSchema), ProfileController.updateProfile);
router.patch('/password', validate(updatePasswordSchema), ProfileController.updatePassword);
router.delete('/account', ProfileController.deleteAccount);

// Dashboard & Activity
router.get('/dashboard', ProfileController.getDashboard);
router.get('/activity', ProfileController.getActivity);

// Enrollments
router.get('/enrollments', EnrollmentController.getMyEnrollments);
router.get('/enrollments/:courseId', EnrollmentController.getEnrollmentByCourse);

// Certificates
router.get('/certificates', CertificateController.getMyCertificates);

// Assessment history
router.get('/quiz-attempts', QuizController.getMyQuizAttempts);
router.get('/coding-submissions', CodingController.getMySubmissions);

export default router;

