"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certificateController_js_1 = require("../controllers/certificateController.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// Public certificate verification
router.get('/verify/:verificationCode', certificateController_js_1.CertificateController.verifyCertificate);
// Certificate metadata & download
router.get('/:certificateId', authMiddleware_js_1.optionalAuth, certificateController_js_1.CertificateController.getCertificateById);
router.get('/:certificateId/download', certificateController_js_1.CertificateController.downloadPdf);
exports.default = router;
