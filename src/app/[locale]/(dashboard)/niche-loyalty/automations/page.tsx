/**
 * Automations Page
 * Create and manage automation rules
 */

'use client';

import { useEffect, useState } from 'react';
import { Plus, Power, PowerOff } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { CreateAutomationDialog } from './components/CreateAutomationDialog';
import { toast } from 'sonner';

interface Automation {
  id: string;
  cardName: string;
  triggerType: string;
  triggerValue: number | null;
  isActive: boolean;
  createdAt: string;
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchAutomations();
  }, []);

  async function fetchAutomations() {
    try {
      const response = await fetch('/api/niche-loyalty/automations/list');
      if (response.ok) {
        const data = await response.json();
        setAutomations(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch automations:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleAutomation(id: string, isActive: boolean) {
    try {
      const response = await fetch('/api/niche-loyalty/automations/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !isActive }),
      });

      if (response.ok) {
        toast.success(
          isActive ? 'Automation paused' : 'Automation activated'
        );
        fetchAutomations();
      } else {
        toast.error('Failed to toggle automation');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  }

  const getTriggerLabel = (type: string, value: number | null) => {
    switch (type) {
      case 'order_paid':
        return value ? `Order ≥ $${value / 100}` : 'Any Order';
      case 'customer_created':
        return 'New Customer';
      case 'manual':
        return 'Manual Only';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-gray-200"></div>
            <div className="h-64 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Automations</h1>
            <p className="mt-2 text-gray-600">
              Set up automatic card sending rules
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Automation
          </Button>
        </div>

        {/* Automations List */}
        {automations.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 p-6">
              <Power className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No automations yet
            </h3>
            <p className="mt-2 text-gray-600">
              Create your first automation to send cards automatically
            </p>
            <Button onClick={() => setDialogOpen(true)} className="mt-6">
              Create Your First Automation
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {automations.map((automation) => (
              <div
                key={automation.id}
                className="flex items-center justify-between rounded-lg bg-white p-6 shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {automation.cardName}
                    </h3>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        automation.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {automation.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Trigger: {getTriggerLabel(automation.triggerType, automation.triggerValue)}
                  </p>
                </div>
                <Button
                  variant={automation.isActive ? 'outline' : 'default'}
                  onClick={() =>
                    toggleAutomation(automation.id, automation.isActive)
                  }
                >
                  {automation.isActive ? (
                    <>
                      <PowerOff className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Power className="mr-2 h-4 w-4" />
                      Activate
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateAutomationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}

