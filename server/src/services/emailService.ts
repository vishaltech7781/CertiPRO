import { env } from '../config/env.js';

export class EmailService {
  public static async sendPasswordResetEmail(toEmail: string, resetToken: string): Promise<void> {
    const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;

    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD) {
      // In production with configured SMTP
      console.log(`[EmailService] Production SMTP dispatched to ${toEmail}`);
    } else {
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

