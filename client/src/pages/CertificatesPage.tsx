import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Certificate } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Award, Download, ShieldCheck, ExternalLink, Calendar } from 'lucide-react';

export const CertificatesPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-certificates'],
    queryFn: () => api.get<Certificate[]>('/me/certificates'),
  });

  if (isLoading) return <LoadingSpinner message="Loading your earned certificates..." />;

  const certificates: Certificate[] = data?.data || [];

  const handleDownload = async (certId: string) => {
    try {
      const response = await fetch(`/api/v1/certificates/${certId}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CertiPro-Certificate-${certId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download PDF:', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
          My Earned Certificates
        </h1>
        <p className="text-xs text-ink-600 mt-1">
          Cryptographically recorded credentials for completed coursework and examinations.
        </p>
      </div>

      {certificates.length === 0 ? (
        <EmptyState
          icon={<Award className="w-8 h-8 text-surface-400" />}
          title="No certificates earned yet"
          description="Complete 100% of required course lessons and pass required assessments to unlock verifiable credentials."
          actionLabel="View Enrolled Courses"
          actionHref="/my-learning"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-surface-100 mb-4">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Credential
                  </span>
                  <Badge variant="success" size="sm">
                    {cert.status.toUpperCase()}
                  </Badge>
                </div>

                <h3 className="font-bold text-lg text-ink-900 leading-snug">
                  {cert.completionSnapshot.courseTitle}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-surface-400">
                  <p>
                    Recipient: <strong className="text-ink-900 font-medium">{cert.completionSnapshot.learnerName}</strong>
                  </p>
                  <p>
                    Instructor: <strong className="text-ink-900 font-medium">{cert.completionSnapshot.instructorName}</strong>
                  </p>
                  <p className="font-mono text-[11px]">
                    ID: {cert.certificateId} • Code: {cert.verificationCode}
                  </p>
                  <p className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3" />
                    Issued on {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                {cert.completionSnapshot.skills?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {cert.completionSnapshot.skills.slice(0, 4).map((s) => (
                      <Badge key={s} variant="neutral" size="sm">
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-surface-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                <Link to={`/certificate/verify/${cert.verificationCode}`} target="_blank">
                  <span className="inline-flex items-center gap-1 text-brand-700 hover:text-brand-800 font-semibold">
                    Public Verification Page <ExternalLink className="w-3 h-3" />
                  </span>
                </Link>

                <div className="flex items-center gap-2">
                  <Link to={`/certificates/${cert.certificateId}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleDownload(cert.certificateId)}
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

