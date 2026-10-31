import { Router } from 'express';
import { CourseController } from '../controllers/courseController.js';
import { EnrollmentController } from '../controllers/enrollmentController.js';
import { CertificateController } from '../controllers/certificateController.js';
import { optionalAuth, requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public / optionally authenticated catalog discovery
router.get('/', optionalAuth, CourseController.getCourses);
router.get('/trending', CourseController.getTrending);
router.get('/recent', CourseController.getRecent);
router.get('/:slug', optionalAuth, CourseController.getCourseBySlug);
router.get('/:courseId/curriculum', optionalAuth, CourseController.getCurriculum);

// Enrollment & learning on a specific course
router.post('/:courseId/enroll', requireAuth, EnrollmentController.enroll);
router.post('/:courseId/lessons/:lessonId/complete', requireAuth, EnrollmentController.completeLesson);
router.get('/:courseId/progress', requireAuth, EnrollmentController.getCourseProgress);

// Certificate claim on a specific course
router.post('/:courseId/certificate', requireAuth, CertificateController.claimCertificate);

export default router;

