/**
 * Glow - Aesthetic Loyalty for Artisan Shopify Stores
 * Landing Page with SEO optimization
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HeroSection, 
  StatsCardGrid,
  MagicLinkForm,
  MemberCard,
} from '@/themes/artisan/components';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  Mail,
  Sparkles,
  Check,
  Zap,
  Palette,
} from 'lucide-react';

export default function GlowLandingPage() {
  // Structured Data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Glow',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free for first 50 members',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '127',
    },
    description: 'Create beautiful, digital membership cards that your customers will actually want to keep. Setup in 5 minutes.',
  };
  const handleMagicLinkSubmit = async (email: string) => {
    console.log('Magic link sent to:', email);
    // TODO: 集成真实的 Magic Link API
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="theme-artisan">
        {/* Hero Section */}
      <HeroSection
        badge="For Artisan Shopify Stores"
        title="Give your brand the glow it deserves."
        subtitle="Most loyalty apps feel like a chore. Glow feels like a gift. Create beautiful, digital membership cards that your customers will actually want to keep."
        ctaPrimary="Launch your club for free"
        ctaSecondary="See how it works"
        onPrimaryClick={() => window.scrollTo({ top: document.getElementById('signup')?.offsetTop || 0, behavior: 'smooth' })}
        onSecondaryClick={() => window.scrollTo({ top: document.getElementById('demo')?.offsetTop || 0, behavior: 'smooth' })}
        showPhonePreview={true}
        showFeatures={true}
      />

      {/* Social Proof */}
      <section className="py-16 px-6 bg-white border-y border-stone-200">
        <div className="container">
          <p className="text-center text-sm text-stone-500 uppercase tracking-widest mb-8">
            Trusted by artisans worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40">
            {['Ceramic Studio', 'Leather Craft', 'Woodwork Co', 'Textile Arts', 'Metal Smith'].map((brand) => (
              <div key={brand} className="text-xl font-serif text-stone-800">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - COMMENTED OUT: Waiting for real customer data */}
      {/* 
      <section className="py-20 px-6 bg-stone-50">
        <div className="container">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl artisan-heading mb-4"
            >
              Why aesthetic loyalty <span className="artisan-heading-italic">matters</span>
            </motion.h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              High-end artisans need loyalty programs that match their craft
            </p>
          </div>

          <StatsCardGrid
            columns={4}
            stats={[
              {
                label: 'Average Member Growth',
                value: '12%',
                icon: Users,
                iconColor: '#8B9D83',
                trend: 'up',
                trendValue: 'per month',
              },
              {
                label: 'Redemption Rate',
                value: '98%',
                icon: TrendingUp,
                iconColor: '#6B8E23',
                trend: 'up',
                trendValue: 'industry leading',
              },
              {
                label: 'Customer Satisfaction',
                value: '4.9',
                unit: '/5',
                icon: Heart,
                iconColor: '#C97064',
              },
              {
                label: 'Setup Time',
                value: '5',
                unit: 'min',
                icon: Zap,
                iconColor: '#D4A574',
              },
            ]}
          />
        </div>
      </section>
      */}

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl artisan-heading mb-4"
            >
              The <span className="artisan-heading-italic">anti-complexity</span> loyalty app
            </motion.h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              Them: 20-page setup manual. Glow: 5 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Palette,
                title: 'Your Brand, Your Way',
                description: 'Customize colors, upload your logo, and create member cards that feel uniquely yours. Because your craft is personal. Your rewards should be too.',
                color: '#8B9D83',
              },
              {
                icon: Mail,
                title: 'Apple Wallet Ready',
                description: 'Your brand, right in their pocket. Beautiful digital cards that live alongside their credit cards and boarding passes.',
                color: '#C97064',
              },
              {
                icon: Sparkles,
                title: 'Setup in 5 Minutes',
                description: 'No 20-page manual. No developer needed. Just beautiful loyalty cards that work from day one.',
                color: '#D4A574',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="artisan-card p-8 hover:shadow-xl transition-shadow"
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-medium text-stone-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section - COMMENTED OUT: Waiting for real customer data to showcase */}
      {/* 
      <section id="demo" className="py-20 px-6 bg-stone-50">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl artisan-heading mb-4"
            >
              Your brand, <span className="artisan-heading-italic">right in their pocket</span>
            </motion.h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              Apple Wallet loyalty cards that your customers will actually want to keep
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                brandColor: '#8B9D83',
                brandName: 'Sage Studio',
                memberName: 'Sarah Johnson',
              },
              {
                brandColor: '#C97064',
                brandName: 'Terra Ceramics',
                memberName: 'Michael Chen',
              },
              {
                brandColor: '#1A1A1A',
                brandName: 'Noir Atelier',
                memberName: 'Emma Wilson',
              },
            ].map((card, index) => (
              <motion.div
                key={card.brandName}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <MemberCard
                  brandColor={card.brandColor}
                  brandName={card.brandName}
                  memberName={card.memberName}
                  memberSince="Dec 2025"
                  points={240}
                  nextRewardPoints={300}
                  size="md"
                  animated={true}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container max-w-5xl">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
                ],
                cta: 'Try Studio Free',
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
                ],
                cta: 'Contact Sales',
                highlighted: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
                <button 
                  className={
                    plan.highlighted 
                      ? 'artisan-button-primary w-full' 
                      : 'artisan-button-secondary w-full'
                  }
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="signup" className="py-20 px-6 bg-stone-900 text-white">
        <div className="container max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl artisan-heading">
              Ready to make your brand <span className="artisan-heading-italic">glow</span>?
            </h2>
            <p className="text-stone-400 text-lg">
              Join hundreds of artisan brands creating loyalty programs that feel like gifts
            </p>

            <div className="max-w-md mx-auto">
              <MagicLinkForm
                title="Launch your club for free"
                subtitle="First 50 members free • No credit card"
                variant="card"
                onSubmit={handleMagicLinkSubmit}
              />
            </div>

            <p className="text-sm text-stone-500">
              Free forever for your first 50 members • No credit card • Setup in 5 minutes
            </p>
          </motion.div>
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
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm">
              © 2025 Glow. Made with ❤️ for artisans.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
