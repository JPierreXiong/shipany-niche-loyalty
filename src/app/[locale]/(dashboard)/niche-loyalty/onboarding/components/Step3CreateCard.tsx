/**
 * Step 3: Create First Card
 * Create the first discount card
 */

'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { CreditCard, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Step3Props {
  onComplete: (data: any) => void;
  onSkip: () => void;
  data: any;
}

export function Step3CreateCard({ onComplete, onSkip, data }: Step3Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Welcome 20% OFF',
    discountType: 'percentage',
    discountValue: '20',
    expireDays: '30',
  });

  async function handleSubmit() {
    if (!formData.name || !formData.discountValue) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/niche-loyalty/cards/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          discountValue: parseInt(formData.discountValue),
          expireDays: parseInt(formData.expireDays),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        onComplete({ cardCreated: result.data });
      } else {
        toast.error('Failed to create card');
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
        <div className="rounded-full bg-green-100 p-4">
          <CreditCard className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Create Your First Card
          </h2>
          <p className="mt-1 text-gray-600">
            Design a discount card to reward your customers
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <Label htmlFor="name">
            Card Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Welcome 20% OFF"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            This name is for your reference only
          </p>
        </div>

        <div>
          <Label htmlFor="discountType">Discount Type</Label>
          <Select
            value={formData.discountType}
            onValueChange={(value) =>
              setFormData({ ...formData, discountType: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed_amount">Fixed Amount ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="discountValue">
            Discount Value{' '}
            {formData.discountType === 'percentage' ? '(%)' : '($)'}
            <span className="text-red-500"> *</span>
          </Label>
          <Input
            id="discountValue"
            type="number"
            min="1"
            max={formData.discountType === 'percentage' ? '100' : undefined}
            value={formData.discountValue}
            onChange={(e) =>
              setFormData({ ...formData, discountValue: e.target.value })
            }
            placeholder="20"
            required
          />
        </div>

        <div>
          <Label htmlFor="expireDays">Valid For (Days)</Label>
          <Input
            id="expireDays"
            type="number"
            min="1"
            value={formData.expireDays}
            onChange={(e) =>
              setFormData({ ...formData, expireDays: e.target.value })
            }
            placeholder="30"
          />
          <p className="mt-1 text-sm text-gray-500">
            How long the discount code will be valid
          </p>
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          <h3 className="font-medium text-green-900">Preview</h3>
          <p className="mt-2 text-sm text-green-800">
            Customers will receive: <strong>{formData.name}</strong>
            <br />
            Discount:{' '}
            <strong>
              {formData.discountValue}
              {formData.discountType === 'percentage' ? '%' : '$'} OFF
            </strong>
            <br />
            Valid for: <strong>{formData.expireDays} days</strong>
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onSkip}>
            Skip for now
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !formData.name || !formData.discountValue}
          >
            {loading ? 'Creating...' : 'Create Card'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}





