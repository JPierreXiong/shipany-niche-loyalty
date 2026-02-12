/**
 * Quick Color Demo Component
 * 用于 Landing Page 的简化交互 Demo
 * 增加页面停留时间，提升 SEO
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MemberCard } from '@/themes/artisan/components';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const QUICK_COLORS = [
  { name: 'Sage', color: '#8B9D83' },
  { name: 'Terra', color: '#C97064' },
  { name: 'Noir', color: '#1A1A1A' },
  { name: 'Ocean', color: '#4A90A4' },
];

export function QuickColorDemo() {
  const [selectedColor, setSelectedColor] = useState('#8B9D83');
  const [selectedName, setSelectedName] = useState('Sage Studio');

  return (
    <div className="artisan-card p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl artisan-heading mb-2">
          See your brand <span className="artisan-heading-italic">glow</span> in 5 seconds
        </h3>
        <p className="text-stone-600">
          Click a color to see your loyalty card come to life
        </p>
      </div>

      {/* Color Selector */}
      <div className="flex justify-center space-x-4 mb-8">
        {QUICK_COLORS.map((theme) => (
          <button
            key={theme.color}
            onClick={() => {
              setSelectedColor(theme.color);
              setSelectedName(`${theme.name} Studio`);
            }}
            className={`group relative transition-all ${
              selectedColor === theme.color ? 'scale-110' : 'hover:scale-105'
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full border-4 transition-all ${
                selectedColor === theme.color
                  ? 'border-stone-800 shadow-lg'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
              style={{ backgroundColor: theme.color }}
            />
            <p className="text-xs text-stone-600 mt-2 font-medium">
              {theme.name}
            </p>
          </button>
        ))}
      </div>

      {/* Card Preview */}
      <div className="flex justify-center mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedColor}
            initial={{ opacity: 0, scale: 0.9, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 90 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <MemberCard
              brandColor={selectedColor}
              brandName={selectedName}
              memberName="Alex Morgan"
              memberSince="Dec 2025"
              points={240}
              nextRewardPoints={300}
              size="md"
              animated={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/niche-loyalty/demo"
          className="artisan-button-primary inline-flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Try Full Designer</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-xs text-stone-500 mt-3">
          No sign-up required • 100% free
        </p>
      </div>
    </div>
  );
}
















