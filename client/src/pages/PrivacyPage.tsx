import React from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />

      <div className="bg-white rounded-xl border border-surface-200 p-8 sm:p-12 shadow-sm space-y-6 text-xs text-ink-700 leading-relaxed">
        <div className="border-b border-surface-100 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-surface-400 text-xs mt-1">Effective Date: October 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            1. Information We Collect
          </h2>
          <p>
            CertiPro collects information you provide directly, including your name, email address, password hash, and learning interests when creating an account. As you use the platform, we store your course enrollment dates, lesson completion records, quiz attempt answers, scores, and coding challenge submissions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            2. How Information is Used
          </h2>
          <p>
            Your information is used solely to maintain platform functionality, track course progress, determine certificate eligibility, deliver verifiable credentials, and recommend relevant curricula. We do not sell or monetize personal learner data to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            3. Authentication & Cookies
          </h2>
          <p>
            We use secure HTTP-only session cookies and authorization tokens to authenticate requests and persist your login state securely. These cookies prevent cross-site scripting (XSS) exfiltration and expire automatically.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            4. Certificate Verification & Public Disclosure
          </h2>
          <p>
            When a certificate is issued, a verification snapshot containing the recipient's display name, course title, and completion date is associated with a unique verification code. Anyone possessing the verification code or URL can view this minimal verification record to validate credential authenticity. Private contact information such as email addresses is never disclosed publicly.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            5. Account Deletion & Data Retention
          </h2>
          <p>
            You may request account deletion at any time via Account Settings. Upon deactivation, personal identifying details are removed or anonymized. Historic certificate records remain archived under cryptographic hashes to prevent broken verification links for previously verified achievements.
          </p>
        </section>
      </div>
    </div>
  );
};

