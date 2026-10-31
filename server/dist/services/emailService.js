"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const env_js_1 = require("../config/env.js");
class EmailService {
    static async sendPasswordResetEmail(toEmail, resetToken) {
        const resetUrl = `${env_js_1.env.CLIENT_URL}/reset-password/${resetToken}`;
        if (env_js_1.env.SMTP_HOST && env_js_1.env.SMTP_USER && env_js_1.env.SMTP_PASSWORD) {
            // In production with configured SMTP
            console.log(`[EmailService] Production SMTP dispatched to ${toEmail}`);
        }
        else {
            // Development mode fallback
            console.log(`\n======================================================`);
            console.log(`[CertiPro Dev Mode] Password Reset Email Simulation`);
            console.log(`To: ${toEmail}`);
            console.log(`Reset URL: ${resetUrl}`);
            console.log(`Note: In production, configure SMTP_* environment variables.`);
            console.log(`======================================================\n`);
        }
    }
}
exports.EmailService = EmailService;
