/**
 * Step 4: Set Automation
 * Create the first automation rule
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
import { Zap, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Step4Props {
  onComplete: (data: any) => void;
  onSkip: () => void;
  data: any;
}

export function Step4SetAutomation({ onComplete, onSkip, data }: Step4Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    triggerType: 'order_paid',
    triggerValue: '',
  });

  async function handleSubmit() {
    if (!data.cardCreated) {
      toast.error('Please create a card first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/niche-loyalty/automations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: data.cardCreated.id,
          triggerType: formData.triggerType,
          triggerValue: formData.triggerValue
            ? parseInt(formData.triggerValue) * 100
            : null,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Automation activated! Your loyalty program is now running.');
        setTimeout(() => {
          onComplete({ automationCreated: result.data });
        }, 1500);
      } else {
        toast.error('Failed to create automation');
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
        <div className="rounded-full bg-orange-100 p-4">
          <Zap className="h-8 w-8 text-orange-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Set Up Automation
          </h2>
          <p className="mt-1 text-gray-600">
            Choose when to automatically send cards to customers
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <Label htmlFor="triggerType">Send When</Label>
          <Select
            value={formData.triggerType}
            onValueChange={(value) =>
              setFormData({ ...formData, triggerType: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order_paid">
                Customer completes an order
              </SelectItem>
              <SelectItem value="customer_created">
                New customer signs up
              </SelectItem>
              <SelectItem value="manual">Manual send only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.triggerType === 'order_paid' && (
          <div>
            <Label htmlFor="triggerValue">
              Minimum Order Amount (optional)
            </Label>
            <Input
              id="triggerValue"
              type="number"
              min="0"
              value={formData.triggerValue}
              onChange={(e) =>
                setFormData({ ...formData, triggerValue: e.target.value })
              }
              placeholder="100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to trigger on any order amount
            </p>
          </div>
        )}

        <div className="rounded-lg bg-orange-50 p-4">
          <h3 className="font-medium text-orange-900">
            🎉 You&apos;re almost done!
          </h3>
          <p className="mt-2 text-sm text-orange-800">
            Once activated, your loyalty program will:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-orange-800">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>
                Automatically send discount cards when{' '}
                {formData.triggerType === 'order_paid'
                  ? 'customers complete orders'
                  : formData.triggerType === 'customer_created'
                  ? 'new customers sign up'
                  : 'you manually trigger it'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>Track redemptions and calculate ROI</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>Increase repeat purchases automatically</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onSkip}>
            Skip for now
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Activating...' : 'Activate Automation'}
            <Check className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

