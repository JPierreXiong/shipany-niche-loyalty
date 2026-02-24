/**
 * Email Settings Component
 * Configure sender information (compliance required)
 */

'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { toast } from 'sonner';

export function EmailSettings() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    replyToEmail: '',
    customDomain: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/niche-loyalty/email/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Email settings saved!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-lg font-semibold text-gray-900">
        Email Configuration
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Configure sender information (required for compliance)
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <Label htmlFor="senderName">
            Sender Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="senderName"
            value={formData.senderName}
            onChange={(e) =>
              setFormData({ ...formData, senderName: e.target.value })
            }
            placeholder="Your Brand Name"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            This name will appear in the &quot;From&quot; field of emails
          </p>
        </div>

        <div>
          <Label htmlFor="senderEmail">
            Sender Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="senderEmail"
            type="email"
            value={formData.senderEmail}
            onChange={(e) =>
              setFormData({ ...formData, senderEmail: e.target.value })
            }
            placeholder="hello@yourbrand.com"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Must be a verified email address
          </p>
        </div>

        <div>
          <Label htmlFor="replyToEmail">Reply-To Email (optional)</Label>
          <Input
            id="replyToEmail"
            type="email"
            value={formData.replyToEmail}
            onChange={(e) =>
              setFormData({ ...formData, replyToEmail: e.target.value })
            }
            placeholder="support@yourbrand.com"
          />
          <p className="mt-1 text-xs text-gray-500">
            Where customers&apos; replies will be sent
          </p>
        </div>

        <div>
          <Label htmlFor="customDomain">
            Custom Domain (Pro only)
          </Label>
          <Input
            id="customDomain"
            value={formData.customDomain}
            onChange={(e) =>
              setFormData({ ...formData, customDomain: e.target.value })
            }
            placeholder="mail.yourbrand.com"
            disabled
          />
          <p className="mt-1 text-xs text-gray-500">
            Upgrade to Pro to use your own sending domain
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="font-medium text-blue-900">
            📧 Email Compliance Requirements
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-blue-800">
            <li>• Sender name and email are required by law</li>
            <li>• All emails include automatic unsubscribe links</li>
            <li>• We monitor bounce rates to protect your reputation</li>
          </ul>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}











