import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ink-900 text-surface-200 border-t border-ink-800 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded bg-white text-ink-900 flex items-center justify-center font-bold text-sm tracking-wider">
                CP
              </span>
              <span className="font-bold text-base tracking-tight text-white">CertiPro</span>
            </div>
            <p className="text-surface-300 leading-relaxed text-xs">
              Learn with purpose. Prove your skills. Rigorous curriculum, hands-on coding challenges, and verifiable course certificates.
            </p>
            <div className="flex items-center gap-1.5 text-accent-500 font-medium text-[11px]">
              <ShieldCheck className="w-4 h-4 text-accent-500" />
              <span>Verifiable Cryptographic Credentials</span>
            </div>
          </div>

          {/* Core Categories */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Explore Disciplines
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/courses?category=Artificial+Intelligence" className="hover:text-white transition-colors">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Machine+Learning" className="hover:text-white transition-colors">
                  Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Cloud+Computing" className="hover:text-white transition-colors">
                  Cloud Computing
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Web+Development" className="hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Software+Engineering" className="hover:text-white transition-colors">
                  Software Engineering
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning Platform */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  All Courses Catalog
                </Link>
              </li>
              <li>
                <Link to="/courses?sort=popular" className="hover:text-white transition-colors">
                  Trending Courses
                </Link>
              </li>
              <li>
                <Link to="/certificate/verify/VRF-7D2F8A1E90" className="hover:text-white transition-colors">
                  Certificate Verification
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Our Standards
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Academic Support & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Compliance & Policy
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <span className="text-surface-400">Content Licensing & Fair Use</span>
              </li>
              <li>
                <span className="text-surface-400">Security & Responsible Disclosure</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-surface-400 gap-4">
          <p>© {new Date().getFullYear()} CertiPro Learning Technologies. All rights reserved.</p>
          <p>
            Certificates attest to the completion of structured coursework, assessments, and coding benchmarks.
          </p>
        </div>
      </div>
    </footer>
  );
};

