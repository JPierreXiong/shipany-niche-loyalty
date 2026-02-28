/**
 * Subscription Status Page
 * 显示用户订阅状态和有效期
 */

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Calendar, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

interface SubscriptionData {
  hasActive: boolean;
  daysRemaining: number;
  expiresAt: string | null;
  isExpired: boolean;
  status: string;
  planName: string;
}

export default function SubscriptionStatusPage() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  async function fetchSubscriptionStatus() {
    try {
      const res = await fetch('/api/debug/payment-status');
      const data = await res.json();
      
      if (data.success) {
        setSubscription(data.data.subscription);
        setUser(data.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription status...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPlanColor = (planName: string) => {
    if (planName === 'Base') return 'bg-blue-500';
    if (planName === 'Pro') return 'bg-purple-500';
    return 'bg-gray-500';
  };

  const getStatusColor = (isExpired: boolean, hasActive: boolean) => {
    if (isExpired) return 'text-red-600';
    if (hasActive) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Subscription Status</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your subscription and billing
          </p>
        </div>

        {/* User Info Card */}
        <Card className="mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
              <p className="mt-1 text-gray-600">{user?.email}</p>
            </div>
            <div className={`rounded-full px-4 py-2 text-white ${getPlanColor(subscription?.planName || 'Free')}`}>
              {subscription?.planName || 'Free'} Plan
            </div>
          </div>
        </Card>

        {/* Subscription Status Card */}
        <Card className="mb-6 p-8">
          <div className="flex items-start gap-4">
            {subscription?.hasActive && !subscription?.isExpired ? (
              <CheckCircle className="h-12 w-12 text-green-600" />
            ) : (
              <AlertCircle className="h-12 w-12 text-red-600" />
            )}
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {subscription?.hasActive && !subscription?.isExpired
                  ? 'Active Subscription'
                  : subscription?.isExpired
                  ? 'Subscription Expired'
                  : 'No Active Subscription'}
              </h2>
              
              {subscription?.hasActive && !subscription?.isExpired && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Days Remaining</p>
                      <p className="text-3xl font-bold text-green-600">
                        {subscription.daysRemaining} days
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Expires On</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatDate(subscription.expiresAt)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{
                          width: `${Math.min((subscription.daysRemaining / 30) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      {subscription.daysRemaining} of 30 days remaining
                    </p>
                  </div>
                </div>
              )}

              {subscription?.isExpired && (
                <div className="mt-4">
                  <p className="text-red-600">
                    Your subscription expired on {formatDate(subscription.expiresAt)}
                  </p>
                  <p className="mt-2 text-gray-600">
                    Please renew your subscription to continue using premium features.
                  </p>
                </div>
              )}

              {!subscription?.hasActive && (
                <div className="mt-4">
                  <p className="text-gray-600">
                    You don't have an active subscription. Upgrade to unlock premium features!
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Plan Details Card */}
        <Card className="mb-6 p-6">
          <h3 className="mb-4 text-xl font-semibold text-gray-900">Plan Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Current Plan</p>
              <p className="text-lg font-semibold text-gray-900">
                {subscription?.planName || 'Free'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`text-lg font-semibold ${getStatusColor(subscription?.isExpired || false, subscription?.hasActive || false)}`}>
                {subscription?.isExpired ? 'Expired' : subscription?.hasActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            {subscription?.planName === 'Base' && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-lg font-semibold text-gray-900">$19.90/month</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Limit</p>
                  <p className="text-lg font-semibold text-gray-900">50 members</p>
                </div>
              </>
            )}
            {subscription?.planName === 'Pro' && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-lg font-semibold text-gray-900">$59.90/month</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Limit</p>
                  <p className="text-lg font-semibold text-gray-900">250 members</p>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {(!subscription?.hasActive || subscription?.isExpired) && (
            <Button
              onClick={() => window.location.href = '/en/niche-loyalty/pricing'}
              size="lg"
              className="flex-1"
            >
              Upgrade Now
            </Button>
          )}
          
          {subscription?.hasActive && !subscription?.isExpired && (
            <Button
              onClick={() => window.location.href = '/en/niche-loyalty/pricing'}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Manage Subscription
            </Button>
          )}
          
          <Button
            onClick={fetchSubscriptionStatus}
            variant="outline"
            size="lg"
          >
            Refresh Status
          </Button>
        </div>

        {/* Info Box */}
        <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <h4 className="mb-2 font-semibold text-blue-900">💡 Subscription Information</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Subscriptions are valid for 30 days from the payment date</li>
            <li>• Your subscription will automatically expire after 30 days</li>
            <li>• You can renew your subscription at any time</li>
            <li>• After expiration, your account will be downgraded to the Free plan</li>
            <li>• All your data will be preserved even after expiration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}





