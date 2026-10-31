import React from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ShieldCheck, Award, BookOpen, Code2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About CertiPro' }]} />

      <div className="bg-white rounded-xl border border-surface-200 p-8 sm:p-12 shadow-sm space-y-8">
        <div className="border-b border-surface-100 pb-6 space-y-2">
          <span className="text-xs font-semibold text-accent-700 uppercase tracking-wider">
            Our Educational Mission
          </span>
          <h1 className="text-3xl font-bold text-ink-900 tracking-tight">
            Learn with purpose. Prove your skills.
          </h1>
          <p className="text-xs text-ink-600 leading-relaxed max-w-2xl">
            CertiPro was built to bridge the gap between watching educational content and demonstrating tangible software competencies through structured evaluations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-ink-700 leading-relaxed">
          <div className="p-5 rounded-lg bg-surface-50 border border-surface-200 space-y-2">
            <div className="w-8 h-8 rounded bg-ink-900 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-ink-900">Curated Curricula</h3>
            <p>
              We organize high-caliber educational resources into clear, ordered modules. Learners progress sequentially from foundational theory to modern systems engineering.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-surface-50 border border-surface-200 space-y-2">
            <div className="w-8 h-8 rounded bg-ink-900 text-white flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-ink-900">Hands-on Assessment</h3>
            <p>
              Passive video consumption alone does not foster technical mastery. Every track incorporates theory check examinations and sandbox coding challenges.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-surface-50 border border-surface-200 space-y-2">
            <div className="w-8 h-8 rounded bg-ink-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-ink-900">Cryptographic Verification</h3>
            <p>
              Every certificate issued carries an immutable verification code verifiable through our public registry, protecting credentials from tampering or forgery.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-surface-50 border border-surface-200 space-y-2">
            <div className="w-8 h-8 rounded bg-ink-900 text-white flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-ink-900">Merit-Based Certification</h3>
            <p>
              Certificates cannot be purchased or auto-generated. They require meeting passing scores on quizzes and solving required algorithmic challenges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

