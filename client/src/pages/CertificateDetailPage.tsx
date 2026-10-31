import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Certificate } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Download, ExternalLink, ShieldCheck, ArrowLeft } from 'lucide-react';

export const CertificateDetailPage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['certificate-detail', certificateId],
    queryFn: () => api.get<Certificate>(`/certificates/${certificateId}`),
  });

  if (isLoading) return <LoadingSpinner message="Rendering official certificate..." />;

  const cert: Certificate | null = data?.data || null;

  if (!cert) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-ink-900">Certificate Not Found</h2>
        <p className="text-xs text-ink-600">The requested certificate ID could not be located.</p>
        <Link to="/certificates">
          <Button variant="primary">Return to Certificates</Button>
        </Link>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/v1/certificates/${cert.certificateId}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CertiPro-Certificate-${cert.certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download PDF:', e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Breadcrumbs
          items={[
            { label: 'My Learning', href: '/my-learning' },
            { label: 'Certificates', href: '/certificates' },
            { label: cert.certificateId },
          ]}
        />

        <div className="flex items-center gap-2">
          <Link to={`/certificate/verify/${cert.verificationCode}`} target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-3.5 h-3.5" /> Public Verification
            </Button>
          </Link>
          <Button variant="primary" size="sm" onClick={handleDownload}>
            <Download className="w-3.5 h-3.5" /> Download Vector PDF
          </Button>
        </div>
      </div>

      {/* Visual Certificate Card Preview */}
      <div className="bg-[#FAFAFA] border-4 border-ink-900 rounded-lg p-8 sm:p-14 shadow-lg text-center relative overflow-hidden">
        {/* Inner Teal Accent Border */}
        <div className="absolute inset-2 border border-accent-600 pointer-events-none" />

        {/* Header Branding */}
        <div className="space-y-1 mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-widest font-sans uppercase">
            C E R T I P R O
          </h2>
          <span className="text-[11px] font-bold text-accent-700 tracking-wider uppercase block">
            Verified Learning Certificate
          </span>
          <div className="w-24 h-0.5 bg-accent-600 mx-auto mt-2" />
        </div>

        {/* Body Statement */}
        <div className="space-y-4 max-w-2xl mx-auto my-8">
          <p className="text-xs text-surface-400 uppercase tracking-wider">
            This is to certify that
          </p>

          <h3 className="text-2xl sm:text-4xl font-black text-ink-900 underline decoration-surface-300 decoration-1 underline-offset-8">
            {cert.completionSnapshot.learnerName}
          </h3>

          <p className="text-xs text-surface-400 pt-2">
            has successfully completed all requirements, examinations, and coursework for
          </p>

          <h4 className="text-xl sm:text-2xl font-bold text-brand-800">
            {cert.completionSnapshot.courseTitle}
          </h4>

          <p className="text-xs text-surface-400">
            {cert.completionSnapshot.courseCategory} • Study Estimate: {cert.completionSnapshot.estimatedDuration}
          </p>

          {cert.completionSnapshot.skills?.length > 0 && (
            <div className="pt-2 text-[11px] text-ink-700">
              Demonstrated Competencies: {cert.completionSnapshot.skills.join(' • ')}
            </div>
          )}
        </div>

        {/* Footer Details */}
        <div className="mt-12 pt-8 border-t border-surface-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-left max-w-3xl mx-auto">
          <div>
            <span className="text-[10px] text-surface-400 uppercase font-semibold block">
              Issue Date
            </span>
            <span className="font-bold text-ink-900">
              {new Date(cert.issueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="sm:text-center">
            <span className="text-[10px] text-surface-400 uppercase font-semibold block">
              Course Instructor
            </span>
            <span className="font-bold text-ink-900">
              {cert.completionSnapshot.instructorName}
            </span>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] text-surface-400 uppercase font-semibold block">
              Verification Code
            </span>
            <span className="font-mono font-bold text-accent-700">
              {cert.verificationCode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

