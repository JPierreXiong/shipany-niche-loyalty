/**
 * Artisan Theme Demo Page
 * 展示所有 Artisan 主题组件
 */

'use client';

import { 
  MemberCard, 
  MemberCardGrid,
  HeroSection, 
  MagicLinkForm,
  MagicLinkFormInline,
  StatsCard,
  StatsCardGrid,
  StatsCardCompact,
} from '@/themes/artisan/components';
import { Users, TrendingUp, Heart, ShoppingBag, Mail, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function ArtisanDemoPage() {
  const [email, setEmail] = useState('');

  const handleMagicLinkSubmit = async (email: string) => {
    console.log('Magic link sent to:', email);
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <div className="theme-artisan min-h-screen">
      {/* Hero Section */}
      <HeroSection
        badge="Artisan Theme Demo"
        title="Elevate your craft with a loyalty club they'll love."
        subtitle="No complex CRM. No plastic cards. Just a beautiful digital home for your most loyal supporters."
        ctaPrimary="Start Free Trial"
        ctaSecondary="See Demo"
        onPrimaryClick={() => console.log('Primary clicked')}
        onSecondaryClick={() => console.log('Secondary clicked')}
        showPhonePreview={true}
        showFeatures={true}
      />

      {/* Stats Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl artisan-heading mb-4">
              Trusted by <span className="artisan-heading-italic">artisans</span> worldwide
            </h2>
            <p className="text-stone-600 text-lg">
              Real metrics from real businesses
            </p>
          </div>

          <StatsCardGrid
            columns={4}
            stats={[
              {
                label: 'Active Members',
                value: 1250,
                icon: Users,
                iconColor: '#8B9D83',
                trend: 'up',
                trendValue: '+12%',
                trendLabel: 'this month',
              },
              {
                label: 'Redemption Rate',
                value: '98%',
                icon: TrendingUp,
                iconColor: '#6B8E23',
                trend: 'up',
                trendValue: '+5%',
                trendLabel: 'vs last month',
              },
              {
                label: 'Satisfaction',
                value: '4.9',
                unit: '/5',
                icon: Heart,
                iconColor: '#C97064',
                trend: 'neutral',
              },
              {
                label: 'Total Orders',
                value: 3420,
                icon: ShoppingBag,
                iconColor: '#D4A574',
                trend: 'up',
                trendValue: '+18%',
                trendLabel: 'this quarter',
              },
            ]}
          />
        </div>
      </section>

      {/* Member Cards Section */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl artisan-heading mb-4">
              Beautiful <span className="artisan-heading-italic">member cards</span>
            </h2>
            <p className="text-stone-600 text-lg">
              Apple Wallet-inspired design with your brand colors
            </p>
          </div>

          <MemberCardGrid
            columns={3}
            cards={[
              {
                brandColor: '#8B9D83',
                brandName: 'Sage Studio',
                memberName: 'Sarah Johnson',
                memberEmail: 'sarah@example.com',
                memberSince: 'Dec 2025',
                points: 240,
                nextRewardPoints: 300,
                size: 'md',
              },
              {
                brandColor: '#C97064',
                brandName: 'Terra Ceramics',
                memberName: 'Michael Chen',
                memberEmail: 'michael@example.com',
                memberSince: 'Jan 2026',
                points: 180,
                nextRewardPoints: 250,
                size: 'md',
              },
              {
                brandColor: '#1A1A1A',
                brandName: 'Noir Atelier',
                memberName: 'Emma Wilson',
                memberEmail: 'emma@example.com',
                memberSince: 'Nov 2025',
                points: 420,
                nextRewardPoints: 500,
                size: 'md',
              },
            ]}
          />
        </div>
      </section>

      {/* Magic Link Forms Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl artisan-heading mb-4">
              <span className="artisan-heading-italic">Passwordless</span> authentication
            </h2>
            <p className="text-stone-600 text-lg">
              Magic link login for a seamless experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Default Variant */}
            <div>
              <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4 text-center">
                Default
              </h3>
              <MagicLinkForm
                title="Join the club"
                subtitle="Enter your email"
                variant="default"
                showIcon={true}
                onSubmit={handleMagicLinkSubmit}
              />
            </div>

            {/* Minimal Variant */}
            <div>
              <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4 text-center">
                Minimal
              </h3>
              <MagicLinkForm
                title="Get Started"
                subtitle="No password needed"
                variant="minimal"
                showIcon={false}
                onSubmit={handleMagicLinkSubmit}
              />
            </div>

            {/* Card Variant */}
            <div>
              <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4 text-center">
                Card
              </h3>
              <MagicLinkForm
                title="Sign In"
                subtitle="We'll email you a link"
                variant="card"
                showIcon={true}
                onSubmit={handleMagicLinkSubmit}
              />
            </div>
          </div>

          {/* Inline Variant */}
          <div className="mt-16 text-center">
            <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4">
              Inline (for Hero sections)
            </h3>
            <div className="flex justify-center">
              <MagicLinkFormInline
                placeholder="your@email.com"
                buttonText="Get Started"
                onSubmit={handleMagicLinkSubmit}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Compact Stats Section */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl artisan-heading mb-4">
              Compact <span className="artisan-heading-italic">stats cards</span>
            </h2>
            <p className="text-stone-600 text-lg">
              Perfect for dashboards and sidebars
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <StatsCardCompact
              label="New Members"
              value={42}
              icon={Users}
              iconColor="#8B9D83"
            />
            <StatsCardCompact
              label="Emails Sent"
              value={1250}
              icon={Mail}
              iconColor="#6B8E23"
            />
            <StatsCardCompact
              label="Engagement"
              value="94%"
              icon={Heart}
              iconColor="#C97064"
            />
            <StatsCardCompact
              label="Rewards Given"
              value={89}
              icon={Sparkles}
              iconColor="#D4A574"
            />
          </div>
        </div>
      </section>

      {/* UI Elements Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl artisan-heading mb-4">
              UI <span className="artisan-heading-italic">elements</span>
            </h2>
            <p className="text-stone-600 text-lg">
              Buttons, inputs, and cards
            </p>
          </div>

          <div className="space-y-12">
            {/* Buttons */}
            <div>
              <h3 className="text-xl font-medium mb-4 text-stone-700">Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <button className="artisan-button-primary">
                  Primary Button
                </button>
                <button className="artisan-button-secondary">
                  Secondary Button
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <h3 className="text-xl font-medium mb-4 text-stone-700">Inputs</h3>
              <div className="space-y-4 max-w-md">
                <input
                  type="email"
                  className="artisan-input w-full"
                  placeholder="your@email.com"
                />
                <input
                  type="text"
                  className="artisan-input w-full"
                  placeholder="Your name"
                />
              </div>
            </div>

            {/* Cards */}
            <div>
              <h3 className="text-xl font-medium mb-4 text-stone-700">Cards</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="artisan-card p-6">
                  <h4 className="text-lg font-medium mb-2">Paper Card</h4>
                  <p className="text-stone-600">
                    Subtle shadow with paper texture feel
                  </p>
                </div>
                <div className="artisan-glass-card p-6">
                  <h4 className="text-lg font-medium mb-2">Glass Card</h4>
                  <p className="text-stone-600">
                    Frosted glass effect with backdrop blur
                  </p>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="text-xl font-medium mb-4 text-stone-700">Typography</h3>
              <div className="space-y-4">
                <h1 className="text-5xl artisan-heading">
                  Heading with <span className="artisan-heading-italic">italic</span>
                </h1>
                <p className="text-lg text-stone-600">
                  Body text using Geist font family for optimal readability
                </p>
                <p className="text-sm text-stone-400 font-mono">
                  Monospace text for code and technical content
                </p>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h3 className="text-xl font-medium mb-4 text-stone-700">Badges</h3>
              <div className="flex flex-wrap gap-3">
                <span className="artisan-badge">New</span>
                <span className="artisan-badge">Featured</span>
                <span className="artisan-badge">Limited</span>
                <span className="artisan-badge">Popular</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 bg-stone-900 text-white">
        <div className="container text-center">
          <h2 className="text-4xl artisan-heading mb-4">
            Ready to <span className="artisan-heading-italic">elevate</span> your brand?
          </h2>
          <p className="text-stone-400 text-lg mb-8 max-w-2xl mx-auto">
            Start building your loyalty program with the Artisan theme today
          </p>
          <button className="artisan-button-primary">
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
}






