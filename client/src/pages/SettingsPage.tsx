import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export const SettingsPage: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [interests, setInterests] = useState(user?.learningInterests?.join(', ') || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  // Account deletion
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);

    try {
      setProfileLoading(true);
      const splitInterests = interests
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);

      await api.patch('/me/profile', {
        name,
        bio,
        learningInterests: splitInterests,
      });

      await refreshUser();
      setProfileSuccess(true);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);

    if (newPassword !== confirmNewPassword) {
      setPwError('New passwords do not match.');
      return;
    }

    try {
      setPwLoading(true);
      await api.patch('/me/password', {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      setPwSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPwError(err.message || 'Failed to change password.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/me/account');
      await logout();
      navigate('/');
    } catch (err: any) {
      alert(err.message || 'Failed to deactivate account.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Profile', href: '/profile' },
          { label: 'Account Settings' },
        ]}
      />

      <div className="space-y-2 border-b border-surface-200 pb-4">
        <h1 className="text-2xl font-bold text-ink-900 tracking-tight">Account Settings</h1>
        <p className="text-xs text-ink-600">Manage your profile information, password, and preferences</p>
      </div>

      {/* Profile Information Form */}
      <div className="bg-white rounded-xl border border-surface-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-ink-900">Personal Information</h2>

        {profileSuccess && <Alert type="success">Profile updated successfully.</Alert>}
        {profileError && <Alert type="error">{profileError}</Alert>}

        <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
          <Input
            label="Full Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email Address (Login Identifier)"
            value={user?.email || ''}
            disabled
            helperText="Email cannot be changed directly for credential integrity."
          />

          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1.5">
              Academic Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-surface-300 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-ink-800"
              placeholder="Tell others about your background, goals, or specialties..."
            />
          </div>

          <Input
            label="Learning Interests (comma-separated)"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g. Web Development, Cloud Computing, Machine Learning"
          />

          <Button type="submit" variant="primary" size="sm" loading={profileLoading}>
            Save Profile Changes
          </Button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-white rounded-xl border border-surface-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-ink-900">Security & Password</h2>

        {pwSuccess && <Alert type="success">Your password has been changed successfully.</Alert>}
        {pwError && <Alert type="error">{pwError}</Alert>}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <Input
            label="New Password (min 8 characters)"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="sm" loading={pwLoading}>
            Update Password
          </Button>
        </form>
      </div>

      {/* Danger Zone: Account Deactivation */}
      <div className="bg-red-50/60 rounded-xl border border-red-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-red-900">Danger Zone: Deactivate Account</h2>
        <p className="text-xs text-red-700 leading-relaxed max-w-xl">
          Deactivating your account removes personal identifying records in accordance with our Privacy Policy. Existing verified certificates remain verifiable under hashed identifiers.
        </p>

        {deleteConfirm ? (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-red-900">Are you absolutely sure you want to deactivate your account?</p>
            <div className="flex gap-2">
              <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
                Yes, Deactivate My Account
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(true)}>
            Request Account Deactivation
          </Button>
        )}
      </div>
    </div>
  );
};

