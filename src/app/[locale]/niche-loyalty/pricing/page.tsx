/**
 * Glow Pricing Page
 * Aesthetic loyalty program pricing for artisan Shopify stores
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function GlowPricingPage() {
  return (
    <div className="theme-artisan min-h-screen bg-[#FDFCFB]">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <Link href="/niche-loyalty" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-800 to-stone-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl artisan-heading">Glow</h1>
                <p className="text-xs text-stone-500">Aesthetic Loyalty</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/niche-loyalty/dashboard" className="artisan-button-secondary">
                Dashboard
              </Link>
              <Link href="/sign-in" className="artisan-button-primary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="container max-w-5xl">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl artisan-heading mb-4"
            >
              Simple, <span className="artisan-heading-italic">honest</span> pricing
            </motion.h2>
            <p className="text-stone-600 text-lg">
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Maker',
                price: 'Free',
                description: 'Perfect for getting started',
                features: [
                  'Up to 50 members',
                  'Basic member cards',
                  'Email campaigns',
                  'Community support',
                ],
                cta: 'Start Free Forever',
                ctaLink: '/sign-up',
                highlighted: false,
              },
              {
                name: 'Studio',
                price: '$19.9',
                period: '/month',
                description: 'For growing businesses',
                features: [
                  'Up to 500 members',
                  'Custom branding',
                  'Advanced analytics',
                  'Priority support',
                  'API access',
                  'Apple Wallet integration',
                ],
                cta: 'Try Studio Free',
                ctaLink: 'https://www.creem.io/test/payment/prod_5bo10kkVzObfuZIjUglgI0',
                highlighted: true,
              },
              {
                name: 'Atelier',
                price: '$59.9',
                period: '/month',
                description: 'For established brands',
                features: [
                  'Unlimited members',
                  'White-label option',
                  'Dedicated support',
                  'Custom integrations',
                  'SLA guarantee',
                  'Multi-store management',
                ],
                cta: 'Contact Sales',
                ctaLink: 'https://www.creem.io/test/payment/prod_1lQWMwrdWZFzo6AgpVcCc7',
                highlighted: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`artisan-card p-8 ${
                  plan.highlighted 
                    ? 'ring-2 ring-stone-800 shadow-2xl scale-105' 
                    : ''
                }`}
              >
                {plan.highlighted && (
                  <span className="artisan-badge mb-4">Most Popular</span>
                )}
                <h3 className="text-2xl font-medium text-stone-800 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-light text-stone-800">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-stone-500">{plan.period}</span>
                  )}
                </div>
                <p className="text-stone-600 mb-6">
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-stone-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.ctaLink}
                  target={plan.ctaLink.startsWith('http') ? '_blank' : '_self'}
                  rel={plan.ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={
                    plan.highlighted 
                      ? 'artisan-button-primary w-full block text-center' 
                      : 'artisan-button-secondary w-full block text-center'
                  }
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h3 className="text-2xl artisan-heading text-center mb-8">
              Frequently Asked Questions
            </h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  q: 'Can I switch plans anytime?',
                  a: 'Yes! Upgrade or downgrade your plan at any time. Changes take effect immediately.',
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards through our secure payment partner Creem.',
                },
                {
                  q: 'Is there a setup fee?',
                  a: 'No setup fees. Start with our free Maker plan and upgrade when you\'re ready.',
                },
                {
                  q: 'Do you offer refunds?',
                  a: 'Yes, we offer a 14-day money-back guarantee on all paid plans.',
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="artisan-card p-6"
                >
                  <h4 className="font-medium text-stone-800 mb-2">{faq.q}</h4>
                  <p className="text-stone-600 text-sm">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-stone-900 text-white">
        <div className="container text-center max-w-2xl">
          <h2 className="text-4xl artisan-heading mb-4">
            Ready to make your brand <span className="artisan-heading-italic">glow</span>?
          </h2>
          <p className="text-stone-400 text-lg mb-8">
            Join hundreds of artisan brands creating loyalty programs that feel like gifts
          </p>
          <Link href="/sign-up" className="artisan-button-primary inline-block">
            Start Free Forever
          </Link>
          <p className="text-sm text-stone-500 mt-4">
            Free forever for your first 50 members • No credit card • Setup in 5 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-stone-950 text-stone-400 border-t border-stone-800">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Glow</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-sm">
              © 2025 Glow. Made with ❤️ for artisans.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


