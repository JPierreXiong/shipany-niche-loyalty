/**
 * Niche Loyalty Dashboard - Main Overview Page
 * English version only (translations will be added later)
 */

'use client';

import { DashboardStats } from './components/DashboardStats';
import { QuickActions } from './components/QuickActions';
import { GrowthTip } from './components/GrowthTip';
import { RecentActivity } from './components/RecentActivity';

export default function NicheLoyaltyDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Your loyalty program is growing. Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <DashboardStats />

        {/* Quick Actions */}
        <div className="mt-8">
          <QuickActions />
        </div>

        {/* Growth Tip */}
        <div className="mt-8">
          <GrowthTip />
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
