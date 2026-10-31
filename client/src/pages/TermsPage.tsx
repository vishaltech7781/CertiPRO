import React from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Terms of Service' }]} />

      <div className="bg-white rounded-xl border border-surface-200 p-8 sm:p-12 shadow-sm space-y-6 text-xs text-ink-700 leading-relaxed">
        <div className="border-b border-surface-100 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-surface-400 text-xs mt-1">Effective Date: October 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            1. Acceptance of Terms
          </h2>
          <p>
            By creating an account, accessing courses, or using services provided by CertiPro ("Platform", "we", "us"), you agree to abide by these Terms of Service. If you do not agree to these terms, you must discontinue use of the platform immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            2. User Accounts and Security
          </h2>
          <p>
            When registering an account, you must provide accurate and verifiable information. You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            3. Educational Content & Third-Party Lecture Embedding
          </h2>
          <p>
            CertiPro curates structured learning pathways that may include publicly accessible educational lectures embedded from third-party services, including YouTube. CertiPro does not claim proprietary ownership over third-party materials and complies strictly with YouTube Terms of Service and applicable fair use standards. Third-party video availability is subject to change at the original author's discretion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            4. Academic Integrity & Assessments
          </h2>
          <p>
            CertiPro provides theory quizzes and coding challenges designed to measure technical competency. You agree to complete all assessments through your own individual effort without unauthorized external interference, automated scraping, or exploit injection. Submissions violating integrity guidelines may result in assessment invalidation or account suspension.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            5. Certificates & Verification Disclaimers
          </h2>
          <p>
            CertiPro issues verifiable course completion certificates exclusively to learners who satisfy all recorded curriculum requirements, passing scores on theory assessments, and accepted benchmarks on coding challenges. Certificates attest to coursework completion on our platform and do not constitute formal university degrees, government accreditations, or occupational licenses.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            6. Code Execution & Security
          </h2>
          <p>
            Coding challenges are evaluated in sandboxed or deterministic server environments with strict execution limits, memory caps, and prohibited system calls. Any attempt to exploit, bypass sandboxing, probe internal networks, or trigger denial of service attacks will lead to immediate account termination and reporting.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            7. Limitation of Liability
          </h2>
          <p>
            CertiPro is provided on an "as-is" and "as-available" basis without warranties of any kind, whether express or implied. To the fullest extent permitted by law, CertiPro shall not be liable for any indirect, incidental, or consequential damages resulting from platform use.
          </p>
        </section>
      </div>
    </div>
  );
};

