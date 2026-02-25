/**
 * Shopify Custom App Demo Page
 * Interactive tutorial showing how to create a Custom App
 */

'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { 
  Store, 
  CheckCircle, 
  ExternalLink,
  Play,
  ArrowRight,
  Shield,
  Zap,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ShopifyDemoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Open Shopify Admin',
      description: 'Navigate to your Shopify admin panel',
      image: '/demo/shopify-admin.png',
      action: 'Open Shopify Admin',
      url: 'https://admin.shopify.com/settings/apps/development',
    },
    {
      title: 'Create Custom App',
      description: 'Click "Create an app" and name it "Glow Loyalty"',
      image: '/demo/create-app.png',
      action: 'Next Step',
    },
    {
      title: 'Configure Permissions',
      description: 'Enable these 3 permissions: read_customers, read_orders, write_price_rules',
      image: '/demo/permissions.png',
      action: 'Next Step',
    },
    {
      title: 'Get API Token',
      description: 'Install the app and reveal your Admin API Access Token',
      image: '/demo/api-token.png',
      action: 'Connect Now',
      url: '/niche-loyalty/connect-store',
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Automatic Rewards',
      description: 'Send discount cards automatically after each purchase',
    },
    {
      icon: Users,
      title: 'Customer Sync',
      description: 'Automatically sync your Shopify customers',
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your tokens are encrypted with AES-256',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="h-20" />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Store className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="mt-6 text-4xl font-bold text-gray-900">
            How to Connect Your Shopify Store
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Follow this interactive demo to set up your Custom App in 2 minutes
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="rounded-lg bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <benefit.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Demo */}
        <div className="mt-12 rounded-lg bg-white p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Step {currentStep + 1} of {steps.length}
            </h2>
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-12 rounded-full ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900">
              {steps[currentStep].title}
            </h3>
            <p className="mt-2 text-gray-600">
              {steps[currentStep].description}
            </p>

            {/* Demo Image Placeholder */}
            <div className="mt-6 overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
              <div className="flex aspect-video items-center justify-center">
                <div className="text-center">
                  <Play className="mx-auto h-16 w-16 text-gray-400" />
                  <p className="mt-4 text-sm text-gray-500">
                    Screenshot: {steps[currentStep].title}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    (Demo image will be added here)
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={() => {
                    if (steps[currentStep].url && !steps[currentStep].url.startsWith('/')) {
                      window.open(steps[currentStep].url, '_blank');
                    }
                    setCurrentStep(currentStep + 1);
                  }}
                >
                  {steps[currentStep].action}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => router.push(steps[currentStep].url || '/niche-loyalty/connect-store')}
                >
                  {steps[currentStep].action}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="mt-12 rounded-lg bg-blue-50 p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Quick Start Checklist
          </h2>
          <div className="mt-6 space-y-4">
            {[
              'Open Shopify Admin → Settings → Apps → Develop apps',
              'Create a new app named "Glow Loyalty"',
              'Configure Admin API scopes: read_customers, read_orders, write_price_rules',
              'Install the app and copy your Admin API Access Token',
              'Paste the token in Glow to complete the connection',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button
              onClick={() => router.push('/niche-loyalty/connect-store')}
              size="lg"
              className="w-full sm:w-auto"
            >
              <Store className="mr-2 h-5 w-5" />
              Start Connecting Your Store
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">
                Why do I need to create a Custom App?
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Custom Apps allow you to connect Glow directly to your store without going through the Shopify App Store. This gives you more control and faster setup.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">
                Is my API token secure?
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Yes! Your token is encrypted with AES-256 (bank-level encryption) and stored securely in our database. We never share or expose your credentials.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">
                What permissions does Glow need?
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                We only ask for 3 permissions: read_customers (to know who to send cards to), read_orders (to trigger rewards), and write_price_rules (to create discount codes).
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">
                Can I disconnect my store later?
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Absolutely! You can disconnect your store anytime from the Settings page. Your data will be safely deleted.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Need help? Contact us at{' '}
            <a href="mailto:support@glow.com" className="text-blue-600 hover:underline">
              support@glow.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}











