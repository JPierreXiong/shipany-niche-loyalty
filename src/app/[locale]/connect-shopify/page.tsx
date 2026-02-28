/**
 * SEO Landing Page: Connect Shopify Store
 * Optimized for search engines and conversions
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Store, 
  CheckCircle, 
  Shield, 
  Clock, 
  Zap,
  TrendingUp,
  Users,
  Gift,
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Connect Your Shopify Store to Glow in 2 Minutes | No Coding Required',
  description: 'Integrate your Shopify store with Glow loyalty program. Bank-level security, 5-minute setup, automatic discount cards. Increase repeat purchases by 35%.',
  keywords: [
    'connect shopify store',
    'shopify loyalty integration',
    'shopify discount automation',
    'shopify custom app',
    'loyalty program shopify',
    'shopify rewards',
  ],
  openGraph: {
    title: 'Connect Your Shopify Store to Glow in 2 Minutes',
    description: 'No coding required. Bank-level security. 5-minute setup.',
    type: 'website',
  },
};

export default function ConnectShopifyLandingPage() {
  const benefits = [
    {
      icon: Zap,
      title: 'Automatic Rewards',
      description: 'Send personalized discount cards automatically after each purchase',
    },
    {
      icon: TrendingUp,
      title: 'Increase Repeat Sales',
      description: 'Boost customer retention by 35% with targeted loyalty campaigns',
    },
    {
      icon: Users,
      title: 'Customer Sync',
      description: 'Automatically sync all your Shopify customers in real-time',
    },
    {
      icon: Gift,
      title: 'Unique Discount Codes',
      description: 'Generate one-time-use codes for each customer automatically',
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your API tokens are encrypted with AES-256 encryption',
    },
    {
      icon: Clock,
      title: '2-Minute Setup',
      description: 'No technical knowledge required. Follow our visual guide',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Enter your store URL',
      description: 'Just type in your Shopify domain (e.g., mystore.myshopify.com)',
    },
    {
      number: '2',
      title: 'Follow our visual guide',
      description: 'Step-by-step screenshots show you exactly what to do',
    },
    {
      number: '3',
      title: 'Start sending loyalty cards',
      description: 'Your first campaign can go out in minutes',
    },
  ];

  const faqs = [
    {
      question: 'Do I need to be a Shopify developer?',
      answer: 'No! Our visual guide walks you through every step. If you can copy and paste, you can set this up.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use bank-level AES-256 encryption for all API tokens. Your data is stored in SOC 2 compliant infrastructure.',
    },
    {
      question: 'What Shopify plan do I need?',
      answer: 'Any Shopify plan works! From Basic to Plus, Glow integrates seamlessly with all Shopify stores.',
    },
    {
      question: 'Can I disconnect my store later?',
      answer: 'Yes, you can disconnect anytime from your dashboard. All your data will be safely removed.',
    },
    {
      question: 'How much does it cost?',
      answer: 'Glow offers a free plan to get started. Paid plans start at $29/month with unlimited campaigns.',
    },
    {
      question: 'Will this slow down my store?',
      answer: 'No! Glow runs in the background using webhooks. Your store performance is not affected.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <Store className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="mt-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Connect Your Shopify Store to Glow
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              No Coding Required | Bank-Level Security | 2-Minute Setup
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/niche-loyalty/connect-store"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Connect Your Store Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/niche-loyalty/shopify-demo"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                Watch Demo
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              ✓ Free to start · ✓ No credit card required · ✓ Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Connect Your Store?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to build a successful loyalty program
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <benefit.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How It Works (2 Minutes)
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Three simple steps to start growing your business
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                    {step.number}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-gray-600">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-full bg-gray-300 lg:block" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/niche-loyalty/shopify-demo"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline"
            >
              See detailed walkthrough with screenshots
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center text-white">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Join 1,000+ Shopify Merchants
            </h2>
            <p className="mt-4 text-xl opacity-90">
              Growing their business with Glow loyalty program
            </p>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div>
                <div className="text-5xl font-bold">35%</div>
                <div className="mt-2 text-lg opacity-90">Increase in repeat purchases</div>
              </div>
              <div>
                <div className="text-5xl font-bold">2 min</div>
                <div className="mt-2 text-lg opacity-90">Average setup time</div>
              </div>
              <div>
                <div className="text-5xl font-bold">99.9%</div>
                <div className="mt-2 text-lg opacity-90">Uptime guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="mx-auto h-16 w-16 text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl">
              Security & Privacy
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Your data security is our top priority
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              'Bank-level AES-256 encryption',
              'GDPR compliant',
              'SOC 2 certified infrastructure',
              'No order details stored',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-12 space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <p className="mt-3 text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Ready to Grow Your Business?
          </h2>
          <p className="mt-6 text-xl text-blue-100">
            Connect your Shopify store now and start sending loyalty cards in minutes
          </p>
          <div className="mt-10">
            <Link
              href="/niche-loyalty/connect-store"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-colors hover:bg-gray-100"
            >
              <Store className="h-5 w-5" />
              Connect Your Store Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-100">
            No credit card required · Free to start · Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>© 2024 Glow. All rights reserved.</p>
            <p className="mt-2">
              Need help?{' '}
              <a href="mailto:support@glow.com" className="text-blue-400 hover:underline">
                support@glow.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}















