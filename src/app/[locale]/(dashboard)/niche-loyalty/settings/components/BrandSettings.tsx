/**
 * Brand Settings Component
 * Customize brand identity
 */

'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

export function BrandSettings() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brandName: '',
    primaryColor: '#000000',
    logoUrl: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/niche-loyalty/brand/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Brand settings saved!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/storage/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, logoUrl: data.data.url }));
        toast.success('Logo uploaded successfully');
      } else {
        toast.error('Failed to upload logo');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-lg font-semibold text-gray-900">Brand Identity</h2>
      <p className="mt-2 text-sm text-gray-600">
        Customize your loyalty cards and emails
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <Label htmlFor="logo">Logo</Label>
          <div className="mt-2">
            {formData.logoUrl ? (
              <div className="flex items-center gap-4">
                <img
                  src={formData.logoUrl}
                  alt="Logo"
                  className="h-16 w-16 rounded object-cover"
                />
                <Button
                  type="button"
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
                  <p className="mt-1 text-xs text-gray-500">
                    PNG or JPG, up to 2MB
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
          <Label htmlFor="brandName">Brand Name</Label>
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

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}


