import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Download,
  Calendar,
  Award,
  Search,
  ExternalLink,
} from 'lucide-react';

export const VerifyCertificatePage: React.FC = () => {
  const { verificationCode } = useParams<{ verificationCode: string }>();
  const navigate = useNavigate();
  const [inputCode, setInputCode] = useState(verificationCode || '');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['verify-certificate', verificationCode],
    queryFn: () => api.get(`/certificates/verify/${verificationCode}`),
    enabled: !!verificationCode,
    retry: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      navigate(`/certificate/verify/${encodeURIComponent(inputCode.trim())}`);
    }
  };

  const certData = data?.data;
  const isValid = data?.isValid;

  const handleDownload = async () => {
    if (!certData?.certificateId) return;
    try {
      const response = await fetch(`/api/v1/certificates/${certData.certificateId}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CertiPro-Certificate-${certData.certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download PDF:', e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>Cryptographic Credential Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
          Verify Authentic Certificate
        </h1>
        <p className="text-xs text-ink-600 leading-relaxed">
          Verify the authenticity and curriculum benchmarks of certificates issued by CertiPro.
        </p>

        {/* Verification Code Input */}
        <form onSubmit={handleSearch} className="flex gap-2 pt-2">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="e.g. VRF-7D2F8A1E90"
            className="flex-1 bg-white border border-surface-300 rounded-md px-3.5 py-2 text-xs font-mono text-ink-900 focus:outline-none focus:border-ink-800"
          />
          <Button type="submit" variant="primary" size="md">
            <Search className="w-4 h-4" /> Verify
          </Button>
        </form>
      </div>

      {/* Verification State Render */}
      {isLoading ? (
        <LoadingSpinner message="Checking credential registry..." />
      ) : isError || !isValid ? (
        verificationCode ? (
          <div className="bg-white rounded-lg border border-red-200 p-8 text-center max-w-md mx-auto space-y-3 shadow-sm">
            <XCircle className="w-10 h-10 text-red-600 mx-auto" />
            <h3 className="font-bold text-base text-ink-900">Certificate Not Found</h3>
            <p className="text-xs text-surface-400 leading-relaxed">
              No active certificate record matches verification code <span className="font-mono text-ink-800">{verificationCode}</span>. Please verify the code on your certificate document.
            </p>
          </div>
        ) : null
      ) : certData ? (
        <div className="bg-white rounded-xl border border-surface-200 overflow-hidden shadow-sm">
          {/* Top Verification Status Bar */}
          <div className="bg-emerald-50 border-b border-emerald-200 p-4 px-6 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-sm text-emerald-950">
                Official CertiPro Verified Credential
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-800 font-semibold">
              Status: Valid & Recorded
            </span>
          </div>

          {/* Certificate Snapshot Card */}
          <div className="p-6 sm:p-10 space-y-6">
            <div className="border-b border-surface-100 pb-6 space-y-2">
              <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
                Certified Recipient
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight">
                {certData.learnerName}
              </h2>
              <p className="text-xs text-ink-600">
                Has met all academic coursework requirements, passed required examinations, and completed:
              </p>
              <h3 className="text-lg sm:text-xl font-bold text-brand-700 pt-1">
                {certData.courseTitle}
              </h3>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-surface-50 p-3 rounded border border-surface-100">
                <span className="text-surface-400 text-[10px] uppercase font-semibold block">
                  Category
                </span>
                <span className="font-medium text-ink-900">{certData.courseCategory}</span>
              </div>
              <div className="bg-surface-50 p-3 rounded border border-surface-100">
                <span className="text-surface-400 text-[10px] uppercase font-semibold block">
                  Issue Date
                </span>
                <span className="font-medium text-ink-900">
                  {new Date(certData.issueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="bg-surface-50 p-3 rounded border border-surface-100">
                <span className="text-surface-400 text-[10px] uppercase font-semibold block">
                  Certificate ID
                </span>
                <span className="font-mono font-bold text-ink-900">{certData.certificateId}</span>
              </div>
              <div className="bg-surface-50 p-3 rounded border border-surface-100">
                <span className="text-surface-400 text-[10px] uppercase font-semibold block">
                  Verification Code
                </span>
                <span className="font-mono font-bold text-teal-700">{certData.verificationCode}</span>
              </div>
            </div>

            {/* Competencies Verified */}
            {certData.skills && certData.skills.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider block">
                  Demonstrated Competencies & Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {certData.skills.map((skill: string) => (
                    <Badge key={skill} variant="neutral" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Faculty / Instructor */}
            <div className="pt-4 border-t border-surface-100 flex items-center justify-between flex-wrap gap-4 text-xs">
              <div>
                <span className="text-surface-400 text-[11px]">Academic Instructor: </span>
                <span className="font-bold text-ink-900">{certData.instructorName}</span>
              </div>

              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-3.5 h-3.5 mr-1" /> Download PDF Certificate
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

