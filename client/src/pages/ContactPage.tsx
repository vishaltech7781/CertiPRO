import React, { useState } from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Mail, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSent(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact & Support' }]} />

      <div className="bg-white rounded-xl border border-surface-200 p-8 sm:p-12 shadow-sm space-y-8">
        <div className="border-b border-surface-100 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
            Academic Support & Contact
          </h1>
          <p className="text-xs text-ink-600 mt-1">
            Questions regarding curricula, certificate verification, or platform access? Reach our academic support team.
          </p>
        </div>

        {sent ? (
          <Alert type="success" title="Message Received">
            Thank you for reaching out. An academic coordinator will review your inquiry and respond to <span className="font-semibold">{email}</span> within 24 business hours.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-1.5">
                Inquiry or Issue Description
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
                className="w-full rounded-md border border-surface-300 p-3 text-xs text-ink-900 focus:outline-none focus:border-ink-800 focus:ring-1 focus:ring-ink-800"
                placeholder="Describe your inquiry or question..."
              />
            </div>
            <Button type="submit" variant="primary" size="md">
              Send Inquiry
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

