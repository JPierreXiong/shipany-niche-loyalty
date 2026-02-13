/**
 * Create Automation Dialog
 * Allows users to create automation rules
 */

'use client';

import { useState, useEffect } from 'react';
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

interface CreateAutomationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Card {
  id: string;
  name: string;
}

export function CreateAutomationDialog({
  open,
  onOpenChange,
}: CreateAutomationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [formData, setFormData] = useState({
    cardId: '',
    triggerType: 'order_paid',
    triggerValue: '',
  });

  useEffect(() => {
    if (open) {
      fetchCards();
    }
  }, [open]);

  async function fetchCards() {
    try {
      const response = await fetch('/api/niche-loyalty/cards/list');
      if (response.ok) {
        const data = await response.json();
        setCards(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/niche-loyalty/automations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          triggerValue: formData.triggerValue
            ? parseInt(formData.triggerValue) * 100
            : null,
        }),
      });

      if (response.ok) {
        toast.success('Automation created successfully!');
        onOpenChange(false);
        setFormData({
          cardId: '',
          triggerType: 'order_paid',
          triggerValue: '',
        });
        window.location.reload();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create automation');
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
          <DialogTitle>Create Automation</DialogTitle>
          <DialogDescription>
            Set up automatic card sending rules
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cardId">Select Card</Label>
            <Select
              value={formData.cardId}
              onValueChange={(value) =>
                setFormData({ ...formData, cardId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a discount card" />
              </SelectTrigger>
              <SelectContent>
                {cards.map((card) => (
                  <SelectItem key={card.id} value={card.id}>
                    {card.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
              <p className="mt-1 text-xs text-gray-500">
                Leave empty to trigger on any order amount
              </p>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.cardId}>
              {loading ? 'Creating...' : 'Create Automation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

