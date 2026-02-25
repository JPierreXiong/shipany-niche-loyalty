import { CheckCircle, ArrowRight, CreditCard, Calendar } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { getUserInfo } from '@/shared/models/user';

export default async function PaymentSuccessPage() {
  const user = await getUserInfo();
  if (!user) {
    redirect('/sign-in');
  }

  const t = await getTranslations('payment.success');
  const subscription = await getCurrentSubscription(user.id);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="w-full max-w-2xl">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-green-100 p-6">
            <CheckCircle className="h-20 w-20 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('description')}
          </p>
        </div>

        {/* Subscription Details Card */}
        {subscription && (
          <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              {t('subscription_details')}
            </h2>
            
            <div className="space-y-4">
              {/* Plan Name */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-600">{t('plan')}</span>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {subscription.planName || 'Premium'}
                </span>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-gray-600">{t('amount')}</span>
                <span className="text-xl font-semibold text-gray-900">
                  ${(subscription.amount || 0) / 100} / {subscription.interval}
                </span>
              </div>

              {/* Billing Period */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-600">{t('next_billing')}</span>
                </div>
                <span className="font-medium text-gray-900">
                  {subscription.currentPeriodEnd
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                    : '-'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* What's Next Section */}
        <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            {t('whats_next.title')}
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="text-gray-700">{t('whats_next.step1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="text-gray-700">{t('whats_next.step2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="text-gray-700">{t('whats_next.step3')}</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="flex-1">
            <Link href="/niche-loyalty/dashboard">
              {t('go_to_dashboard')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1">
            <Link href="/settings/billing">
              {t('view_billing')}
            </Link>
          </Button>
        </div>

        {/* Support Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {t('need_help')}{' '}
            <Link href="/contact" className="text-blue-600 hover:underline">
              {t('contact_support')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


