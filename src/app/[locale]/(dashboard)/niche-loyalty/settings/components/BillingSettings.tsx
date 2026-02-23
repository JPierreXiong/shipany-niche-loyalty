/**
 * Billing Settings Component
 * Manage subscription and billing
 */

'use client';

import { Button } from '@/shared/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link } from '@/core/i18n/navigation';

export function BillingSettings() {
  const currentPlan = 'free'; // TODO: Get from user data

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      features: [
        '50 customers',
        'Manual sending',
        'Basic statistics',
        'Glow branding',
      ],
    },
    {
      id: 'base',
      name: 'Base',
      price: '$19.90',
      features: [
        '250 customers',
        'Automation enabled',
        'Remove branding',
        'Shopify integration',
        'Email tracking',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$59.90',
      features: [
        'Unlimited customers',
        'Multiple automations',
        'Custom domain',
        'Priority support',
        'Advanced analytics',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">
          Billing & Plan
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Manage your subscription
        </p>

        <div className="mt-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Current Plan:</span>
            <span className="font-semibold text-gray-900">
              {plans.find((p) => p.id === currentPlan)?.name}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-lg border-2 bg-white p-6 shadow ${
              plan.id === currentPlan
                ? 'border-blue-500'
                : 'border-gray-200'
            }`}
          >
            {plan.id === currentPlan && (
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-blue-600">
                <CheckCircle className="h-4 w-4" />
                Current Plan
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold text-gray-900">
                {plan.price}
              </span>
              {plan.id !== 'free' && (
                <span className="text-gray-600">/month</span>
              )}
            </div>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            {plan.id !== currentPlan && (
              <Link href="/niche-loyalty/pricing">
                <Button className="mt-6 w-full">
                  {plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}




