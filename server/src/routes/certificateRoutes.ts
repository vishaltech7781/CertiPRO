import { Router } from 'express';
import { CertificateController } from '../controllers/certificateController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public certificate verification
router.get('/verify/:verificationCode', CertificateController.verifyCertificate);

// Certificate metadata & download
router.get('/:certificateId', optionalAuth, CertificateController.getCertificateById);
router.get('/:certificateId/download', CertificateController.downloadPdf);

export default router;

