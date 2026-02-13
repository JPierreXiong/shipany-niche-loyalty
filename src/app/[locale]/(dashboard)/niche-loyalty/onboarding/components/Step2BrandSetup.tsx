/**
 * Step 2: Brand Setup
 * Configure brand identity (logo, colors, sender info)
 */

'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Palette, ArrowRight, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface Step2Props {
  onComplete: (data: any) => void;
  onSkip: () => void;
  data: any;
}

export function Step2BrandSetup({ onComplete, onSkip, data }: Step2Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brandName: '',
    primaryColor: '#000000',
    logoUrl: '',
    senderName: '',
    senderEmail: '',
  });

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const response = await fetch('/api/storage/upload-image', {
        method: 'POST',
        body: uploadData,
      });

      if (response.ok) {
        const result = await response.json();
        setFormData({ ...formData, logoUrl: result.data.url });
        toast.success('Logo uploaded successfully');
      } else {
        toast.error('Failed to upload logo');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  }

  async function handleSubmit() {
    if (!formData.senderName || !formData.senderEmail) {
      toast.error('Sender name and email are required for compliance');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/niche-loyalty/brand/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onComplete({ brandSetup: formData });
      } else {
        toast.error('Failed to save brand settings');
        setLoading(false);
      }
    } catch (error) {
      toast.error('An error occurred');
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg bg-white p-8 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-purple-100 p-4">
          <Palette className="h-8 w-8 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Customize Your Brand
          </h2>
          <p className="mt-1 text-gray-600">
            Make your loyalty cards match your brand identity
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <Label>Logo (optional)</Label>
          <div className="mt-2">
            {formData.logoUrl ? (
              <div className="flex items-center gap-4">
                <img
                  src={formData.logoUrl}
                  alt="Logo"
                  className="h-16 w-16 rounded object-cover"
                />
                <Button
                  variant="outline"
                  onClick={() => setFormData({ ...formData, logoUrl: '' })}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <label
                htmlFor="logo"
                className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-gray-400"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload logo
                  </p>
                </div>
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </label>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="brandName">Brand Name (optional)</Label>
          <Input
            id="brandName"
            value={formData.brandName}
            onChange={(e) =>
              setFormData({ ...formData, brandName: e.target.value })
            }
            placeholder="Your Brand"
          />
        </div>

        <div>
          <Label htmlFor="primaryColor">Brand Color</Label>
          <div className="mt-2 flex gap-3">
            <input
              id="primaryColor"
              type="color"
              value={formData.primaryColor}
              onChange={(e) =>
                setFormData({ ...formData, primaryColor: e.target.value })
              }
              className="h-10 w-20 cursor-pointer rounded border border-gray-300"
            />
            <Input
              value={formData.primaryColor}
              onChange={(e) =>
                setFormData({ ...formData, primaryColor: e.target.value })
              }
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900">
            Email Sender Info (Required)
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Required by law for email compliance
          </p>

          <div className="mt-4 space-y-4">
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
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onSkip}>
            Skip for now
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !formData.senderName || !formData.senderEmail}
          >
            {loading ? 'Saving...' : 'Continue'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}


