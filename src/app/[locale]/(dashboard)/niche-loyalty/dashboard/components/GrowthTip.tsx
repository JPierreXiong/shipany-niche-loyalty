/**
 * Growth Tip Component
 * Displays helpful tips to improve loyalty program performance
 */

'use client';

import { Lightbulb } from 'lucide-react';
import { Link } from '@/core/i18n/navigation';

export function GrowthTip() {
  return (
    <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-amber-100 p-3">
          <Lightbulb className="h-6 w-6 text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">Growth Tip</h3>
          <p className="mt-2 text-gray-700">
            Members who receive a welcome email within 24 hours are 3x more
            likely to make a repeat purchase. Set up your first campaign to
            boost engagement!
          </p>
          <Link
            href="/niche-loyalty/dashboard/automations"
            className="mt-4 inline-flex items-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
          >
            Create Welcome Campaign →
          </Link>
        </div>
      </div>
    </div>
  );
}


