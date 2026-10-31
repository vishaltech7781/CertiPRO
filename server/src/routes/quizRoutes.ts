import { Router } from 'express';
import { QuizController } from '../controllers/quizController.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { submitQuizSchema } from '../validators/quizValidator.js';

const router = Router();

router.get('/course/:courseId', optionalAuth, QuizController.getQuizzesForCourse);
router.get('/:quizId', optionalAuth, QuizController.getQuizById);
router.post('/:quizId/submit', requireAuth, validate(submitQuizSchema), QuizController.submitQuiz);

export default router;

