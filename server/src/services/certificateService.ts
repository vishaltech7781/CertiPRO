import PDFDocument from 'pdfkit';
import { ICertificate } from '../models/Certificate.js';
import { env } from '../config/env.js';

export class CertificateService {
  /**
   * Generates a vector PDF certificate buffer using PDFKit.
   * Rendered in A4 Landscape format (841.89 x 595.28 pt).
   */
  public static async generateCertificatePdf(certificate: ICertificate): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 30, bottom: 30, left: 30, right: 30 },
      });

      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const width = doc.page.width; // 841.89
      const height = doc.page.height; // 595.28

      // Background subtle ivory tint
      doc.rect(0, 0, width, height).fill('#FAFAFA');

      // Outer Deep Navy Border
      doc
        .lineWidth(4)
        .strokeColor('#0B132B')
        .rect(25, 25, width - 50, height - 50)
        .stroke();

      // Inner Refined Teal Border
      doc
        .lineWidth(1)
        .strokeColor('#0D9488')
        .rect(32, 32, width - 64, height - 64)
        .stroke();

      // Decorative corner accents
      const cornerSize = 14;
      doc.rect(28, 28, cornerSize, cornerSize).fill('#0B132B');
      doc.rect(width - 28 - cornerSize, 28, cornerSize, cornerSize).fill('#0B132B');
      doc.rect(28, height - 28 - cornerSize, cornerSize, cornerSize).fill('#0B132B');
      doc.rect(width - 28 - cornerSize, height - 28 - cornerSize, cornerSize, cornerSize).fill('#0B132B');

      // Header Brand
      doc
        .fillColor('#0B132B')
        .fontSize(26)
        .font('Helvetica-Bold')
        .text('C E R T I P R O', 0, 70, { align: 'center', characterSpacing: 6 });

      doc
        .fillColor('#0D9488')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('VERIFIED LEARNING CERTIFICATE', 0, 105, { align: 'center', characterSpacing: 3 });

      // Thin separator
      doc
        .moveTo(width / 2 - 120, 125)
        .lineTo(width / 2 + 120, 125)
        .lineWidth(1.5)
        .strokeColor('#0D9488')
        .stroke();

      // "This certifies that"
      doc
        .fillColor('#475569')
        .fontSize(13)
        .font('Helvetica')
        .text('This is to certify that', 0, 150, { align: 'center' });

      // Learner Name
      const learnerName = certificate.completionSnapshot.learnerName || 'Learner';
      doc
        .fillColor('#0B132B')
        .fontSize(28)
        .font('Helvetica-Bold')
        .text(learnerName, 0, 178, { align: 'center' });

      // Underline for name
      doc
        .moveTo(width / 2 - 180, 215)
        .lineTo(width / 2 + 180, 215)
        .lineWidth(0.75)
        .strokeColor('#CBD5E1')
        .stroke();

      // Statement
      doc
        .fillColor('#475569')
        .fontSize(12)
        .font('Helvetica')
        .text('has successfully completed all requirements, assessments, and curriculum for', 0, 230, {
          align: 'center',
        });

      // Course Title
      const courseTitle = certificate.completionSnapshot.courseTitle;
      doc
        .fillColor('#1E3A8A')
        .fontSize(22)
        .font('Helvetica-Bold')
        .text(courseTitle, 60, 255, { align: 'center' });

      // Category and duration info
      const meta = `${certificate.completionSnapshot.courseCategory}  •  Estimated Study: ${certificate.completionSnapshot.estimatedDuration}`;
      doc
        .fillColor('#64748B')
        .fontSize(10)
        .font('Helvetica')
        .text(meta, 0, 290, { align: 'center' });

      // Skills taught tag list
      if (certificate.completionSnapshot.skills && certificate.completionSnapshot.skills.length > 0) {
        const skillsText = `Demonstrated Competencies: ${certificate.completionSnapshot.skills.slice(0, 5).join('  |  ')}`;
        doc
          .fillColor('#334155')
          .fontSize(9)
          .font('Helvetica')
          .text(skillsText, 80, 312, { align: 'center' });
      }

      // Bottom Row Information Grid
      const bottomY = 380;

      // Column 1: Issue Date & Verification
      doc
        .fillColor('#64748B')
        .fontSize(9)
        .font('Helvetica')
        .text('ISSUED DATE', 80, bottomY);

      const issueDateFormatted = new Date(certificate.issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      doc
        .fillColor('#0B132B')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(issueDateFormatted, 80, bottomY + 16);

      // Column 2: Instructor
      const instructorName = certificate.completionSnapshot.instructorName || 'CertiPro Academic Faculty';
      doc
        .fillColor('#64748B')
        .fontSize(9)
        .font('Helvetica')
        .text('COURSE INSTRUCTOR', width / 2 - 100, bottomY);

      doc
        .fillColor('#0B132B')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(instructorName, width / 2 - 100, bottomY + 16);

      // Column 3: Verification & Security
      doc
        .fillColor('#64748B')
        .fontSize(9)
        .font('Helvetica')
        .text('CERTIFICATE ID', width - 260, bottomY);

      doc
        .fillColor('#0B132B')
        .fontSize(10)
        .font('Courier-Bold')
        .text(certificate.certificateId, width - 260, bottomY + 16);

      doc
        .fillColor('#64748B')
        .fontSize(9)
        .font('Helvetica')
        .text('VERIFICATION CODE', width - 260, bottomY + 36);

      doc
        .fillColor('#0D9488')
        .fontSize(10)
        .font('Courier-Bold')
        .text(certificate.verificationCode, width - 260, bottomY + 50);

      // Bottom Verification URL Bar
      const verifyUrl = `${env.CLIENT_URL}/certificate/verify/${certificate.verificationCode}`;
      doc
        .fillColor('#94A3B8')
        .fontSize(8)
        .font('Helvetica')
        .text(`Verify authenticity securely online at: ${verifyUrl}`, 0, height - 52, {
          align: 'center',
        });

      doc.end();
    });
  }
}

