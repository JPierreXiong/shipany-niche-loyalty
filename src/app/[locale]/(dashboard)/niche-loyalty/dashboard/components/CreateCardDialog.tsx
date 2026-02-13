/**
 * Create Card Dialog
 * Allows users to create discount cards
 */

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
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
import { toast } from 'sonner';

interface CreateCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCardDialog({
  open,
  onOpenChange,
}: CreateCardDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    discountType: 'percentage',
    discountValue: '',
    expireDays: '30',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        toast.success('Card created successfully!');
        onOpenChange(false);
        setFormData({
          name: '',
          discountType: 'percentage',
          discountValue: '',
          expireDays: '30',
        });
        window.location.reload();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create card');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Discount Card</DialogTitle>
          <DialogDescription>
            Design a new discount card for your customers
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Card Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Welcome 20% OFF"
              required
            />
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
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="discountValue">
              Discount Value{' '}
              {formData.discountType === 'percentage' ? '(%)' : '($)'}
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
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Card'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

