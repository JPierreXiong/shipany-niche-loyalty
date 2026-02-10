/**
 * Glow Demo Page - Interactive Loyalty Card Designer
 * SEO optimized for "free loyalty card designer" and related keywords
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MemberCard } from '@/themes/artisan/components';
import { 
  Palette, 
  Upload, 
  Sparkles, 
  Download,
  Share2,
  ArrowRight,
  Check,
  Smartphone,
} from 'lucide-react';
import Link from 'next/link';

// 预设主题
const PRESET_THEMES = [
  { name: 'Sage Studio', color: '#8B9D83', description: 'Earthy & Calm' },
  { name: 'Terra Ceramics', color: '#C97064', description: 'Warm & Inviting' },
  { name: 'Noir Atelier', color: '#1A1A1A', description: 'Bold & Modern' },
  { name: 'Ocean Breeze', color: '#4A90A4', description: 'Fresh & Clean' },
  { name: 'Golden Hour', color: '#D4A574', description: 'Elegant & Luxe' },
  { name: 'Lavender Fields', color: '#9B7EBD', description: 'Soft & Dreamy' },
];

export default function GlowDemoPage() {
  // 状态管理
  const [brandName, setBrandName] = useState('Your Brand');
  const [brandColor, setBrandColor] = useState('#8B9D83');
  const [memberName, setMemberName] = useState('Alex Morgan');
  const [points, setPoints] = useState(240);
  const [showSuccess, setShowSuccess] = useState(false);

  // 处理颜色选择
  const handleColorSelect = (color: string, name: string) => {
    setBrandColor(color);
    setBrandName(name);
  };

  // 处理保存
  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/niche-loyalty" className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-stone-800" />
              <span className="text-xl font-medium text-stone-800">Glow</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/niche-loyalty/pricing"
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                Pricing
              </Link>
              <Link 
                href="/sign-up"
                className="artisan-button-primary text-sm px-6 py-2"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-6 bg-gradient-to-b from-white to-stone-50">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="artisan-badge mb-4">Free Interactive Demo</span>
            <h1 className="text-5xl md:text-6xl artisan-heading mb-6">
              See your brand <span className="artisan-heading-italic">glow</span> in 5 seconds
            </h1>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-8">
              Design your perfect loyalty card. No sign-up required. Just pick your colors and watch the magic happen.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-stone-500">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>No sign-up</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>100% free</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Demo Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left: Configuration Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Brand Name */}
              <div className="artisan-card p-6">
                <label className="block text-sm font-medium text-stone-700 mb-3">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all"
                  placeholder="Your Brand Name"
                />
                <p className="text-xs text-stone-500 mt-2">
                  This will appear on your loyalty cards
                </p>
              </div>

              {/* Color Picker */}
              <div className="artisan-card p-6">
                <label className="block text-sm font-medium text-stone-700 mb-4">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Choose Your Brand Color
                </label>
                
                {/* Preset Themes */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {PRESET_THEMES.map((theme) => (
                    <button
                      key={theme.color}
                      onClick={() => handleColorSelect(theme.color, theme.name)}
                      className={`group relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                        brandColor === theme.color 
                          ? 'border-stone-800 shadow-lg' 
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div 
                        className="w-full h-12 rounded-md mb-2"
                        style={{ backgroundColor: theme.color }}
                      />
                      <p className="text-xs font-medium text-stone-800">{theme.name}</p>
                      <p className="text-[10px] text-stone-500">{theme.description}</p>
                      {brandColor === theme.color && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-stone-800 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Color */}
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-16 h-16 rounded-lg border-2 border-stone-200 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-700">Custom Color</p>
                    <p className="text-xs text-stone-500 font-mono">{brandColor}</p>
                  </div>
                </div>
              </div>

              {/* Member Details */}
              <div className="artisan-card p-6">
                <label className="block text-sm font-medium text-stone-700 mb-3">
                  Member Name (Preview)
                </label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all mb-4"
                  placeholder="Member Name"
                />

                <label className="block text-sm font-medium text-stone-700 mb-3">
                  Points Balance
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-2xl font-light text-stone-800 w-16 text-right">
                    {points}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-2">
                  Slide to see how points display on the card
                </p>
              </div>

              {/* Logo Upload (Coming Soon) */}
              <div className="artisan-card p-6 bg-stone-50 border-dashed">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-stone-700">
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload Logo
                  </label>
                  <span className="text-xs text-stone-500 bg-white px-2 py-1 rounded">
                    Pro Feature
                  </span>
                </div>
                <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm text-stone-500">
                    Available in Studio & Atelier plans
                  </p>
                </div>
              </div>

            </motion.div>

            {/* Right: Live Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:sticky lg:top-24"
            >
              <div className="artisan-card p-8 bg-gradient-to-br from-white to-stone-50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-stone-800">
                    <Smartphone className="w-5 h-5 inline mr-2" />
                    Live Preview
                  </h3>
                  <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    Real-time
                  </span>
                </div>

                {/* Card Preview */}
                <div className="flex justify-center mb-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${brandColor}-${brandName}-${points}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MemberCard
                        brandColor={brandColor}
                        brandName={brandName}
                        memberName={memberName}
                        memberSince="Dec 2025"
                        points={points}
                        nextRewardPoints={300}
                        size="lg"
                        animated={true}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  {[
                    'Apple Wallet compatible',
                    'Real-time points updates',
                    'QR code for easy scanning',
                    'Beautiful gradient design',
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-2 text-sm text-stone-600"
                    >
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleSave}
                    className="artisan-button-primary w-full flex items-center justify-center space-x-2"
                  >
                    <span>Save & Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button className="artisan-button-secondary flex items-center justify-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button className="artisan-button-secondary flex items-center justify-center space-x-2">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <p className="text-sm text-green-800 flex items-center">
                        <Check className="w-4 h-4 mr-2" />
                        Design saved! Create your account to launch your club.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 text-center text-sm text-stone-500">
                <p>✨ Join 500+ artisan brands using Glow</p>
                <p className="mt-1">⭐ 4.9/5 rating • Setup in 5 minutes</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl artisan-heading mb-4">
              Why artisans <span className="artisan-heading-italic">love</span> Glow
            </h2>
            <p className="text-lg text-stone-600">
              The loyalty app that matches your craft
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Setup in 5 Minutes',
                description: 'No 20-page manual. No developer needed. Just beautiful loyalty cards that work from day one.',
                stat: '5 min',
              },
              {
                title: '98% Redemption Rate',
                description: 'Your customers actually use their rewards. Because Glow makes it effortless.',
                stat: '98%',
              },
              {
                title: 'Free Forever Plan',
                description: 'First 50 members completely free. No credit card. No tricks. Just start.',
                stat: '$0',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="artisan-card p-8 text-center"
              >
                <div className="text-5xl font-light text-stone-800 mb-4">
                  {feature.stat}
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

      {/* Final CTA */}
      <section className="py-20 px-6 bg-stone-900 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl artisan-heading">
              Ready to launch your <span className="artisan-heading-italic">loyalty club</span>?
            </h2>
            <p className="text-xl text-stone-400">
              First 50 members free. No credit card. Setup in 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/sign-up"
                className="artisan-button-primary px-8 py-4 text-lg"
              >
                Start Free Forever
              </Link>
              <Link 
                href="/niche-loyalty/pricing"
                className="text-white hover:text-stone-300 transition-colors flex items-center space-x-2"
              >
                <span>View Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-sm text-stone-500">
              No credit card • No setup fees • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-stone-950 text-stone-400 border-t border-stone-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Glow</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
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







