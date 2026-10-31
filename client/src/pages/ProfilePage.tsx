import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  User as UserIcon,
  Calendar,
  BookOpen,
  Award,
  CheckCircle2,
  Settings as SettingsIcon,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['learner-profile'],
    queryFn: () => api.get('/me/profile'),
  });

  const { data: activityData } = useQuery({
    queryKey: ['learner-activity'],
    queryFn: () => api.get('/me/activity'),
  });

  if (profileLoading) return <LoadingSpinner message="Loading your learner profile..." />;

  const profile = profileData?.data || user;
  const stats = profile?.stats || { enrolledCount: 0, completedCount: 0, certificatesCount: 0 };
  const activities = activityData?.data || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-xl border border-surface-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-ink-900 text-white font-bold text-xl flex items-center justify-center">
            {profile?.name
              ?.split(' ')
              .map((n: string) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-ink-900">{profile?.name}</h1>
              <Badge variant="teal">{profile?.role?.toUpperCase()}</Badge>
            </div>
            <p className="text-xs text-surface-400 mt-0.5">{profile?.email}</p>
            {profile?.createdAt && (
              <p className="text-[11px] text-surface-400 flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </p>
            )}
          </div>
        </div>

        <Link to="/settings">
          <Button variant="outline" size="sm">
            <SettingsIcon className="w-3.5 h-3.5" /> Edit Profile & Settings
          </Button>
        </Link>
      </div>

      {/* Bio and Interests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl border border-surface-200 p-6 space-y-4">
          <h3 className="font-bold text-sm text-ink-900">About Learner</h3>
          <p className="text-xs text-ink-700 leading-relaxed whitespace-pre-line">
            {profile?.bio || 'No personal bio added yet. Visit settings to add an academic introduction.'}
          </p>

          <div className="pt-4 border-t border-surface-100">
            <h4 className="text-xs font-semibold text-ink-900 mb-2">Learning Interests</h4>
            {profile?.learningInterests && profile.learningInterests.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {profile.learningInterests.map((interest: string) => (
                  <Badge key={interest} variant="neutral" size="sm">
                    {interest}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-surface-400">No learning interests selected.</p>
            )}
          </div>
        </div>

        {/* Real Stats Metrics */}
        <div className="md:col-span-1 bg-white rounded-xl border border-surface-200 p-6 space-y-4">
          <h3 className="font-bold text-sm text-ink-900">Learning Records</h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded bg-surface-50 border border-surface-100">
              <span className="flex items-center gap-2 text-ink-700">
                <BookOpen className="w-4 h-4 text-brand-700" /> Enrolled Courses
              </span>
              <span className="font-mono font-bold text-ink-900">{stats.enrolledCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-surface-50 border border-surface-100">
              <span className="flex items-center gap-2 text-ink-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Completed
              </span>
              <span className="font-mono font-bold text-emerald-700">{stats.completedCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-surface-50 border border-surface-100">
              <span className="flex items-center gap-2 text-ink-700">
                <Award className="w-4 h-4 text-accent-700" /> Certificates
              </span>
              <span className="font-mono font-bold text-accent-700">{stats.certificatesCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl border border-surface-200 p-6 space-y-4">
        <h3 className="font-bold text-sm text-ink-900">Recent Milestones</h3>
        {activities.length === 0 ? (
          <p className="text-xs text-surface-400">No milestones recorded yet.</p>
        ) : (
          <div className="divide-y divide-surface-100">
            {activities.map((act: any) => (
              <div key={act._id} className="py-3 flex items-start justify-between text-xs gap-4">
                <div>
                  <p className="font-semibold text-ink-900">{act.title}</p>
                  <span className="text-[10px] text-surface-400">
                    {new Date(act.timestamp).toLocaleDateString()} at{' '}
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <Badge variant="teal" size="sm">
                  {act.eventType}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

