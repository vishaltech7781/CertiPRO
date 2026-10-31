import { Router } from 'express';
import { CodingController } from '../controllers/codingController.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { runCodeSchema, submitCodeSchema } from '../validators/codingValidator.js';

const router = Router();

router.get('/course/:courseId', optionalAuth, CodingController.getChallengesForCourse);
router.get('/:challengeId', optionalAuth, CodingController.getChallengeById);
router.post('/:challengeId/run', requireAuth, validate(runCodeSchema), CodingController.runTests);
router.post('/:challengeId/submit', requireAuth, validate(submitCodeSchema), CodingController.submitChallenge);

export default router;

