/**
 * HeroSection Component - Artisan 主题 Hero 区域
 * 设计理念: 暖白色调 + 衬线体标题 + 手机预览 + 氛围光
 * 
 * Features:
 * - 动态背景流变
 * - 衬线体标题（Cormorant Garamond）
 * - 手机容器内的会员卡预览
 * - 氛围光装饰
 * - 响应式布局
 */

'use client';

import { motion } from 'framer-motion';
import { ArrowRight, QrCode, Sparkles, Check } from 'lucide-react';
import { MemberCard } from './MemberCard';

export interface HeroSectionProps {
  // 文案配置
  badge?: string;
  title?: string;
  subtitle?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  disclaimer?: string;
  
  // 功能配置
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  
  // 样式配置
  showPhonePreview?: boolean;
  showFeatures?: boolean;
}

export function HeroSection({
  badge = 'Built for indie makers',
  title = 'Elevate your craft with a loyalty club they\'ll love.',
  subtitle = 'No complex CRM. No plastic cards. Just a beautiful digital home for your most loyal supporters.',
  ctaPrimary = 'Start Free Trial',
  ctaSecondary = 'See Demo',
  disclaimer = 'First 50 members free. No credit card required.',
  onPrimaryClick,
  onSecondaryClick,
  showPhonePreview = true,
  showFeatures = true,
}: HeroSectionProps) {
  
  // 分割标题以支持斜体效果
  const titleParts = title.split('loyalty club');
  
  return (
    <section className="relative min-h-[90vh] bg-[#FDFCFB] overflow-hidden flex flex-col items-center justify-center px-6 pt-20 pb-16">
      {/* 动态背景流变 */}
      <div className="absolute inset-0 artisan-animated-bg" />
      
      {/* 氛围光装饰 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] artisan-ambient-light artisan-ambient-light-orange"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div 
          className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] artisan-ambient-light artisan-ambient-light-sage"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl z-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* 左侧：文案区 */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center space-x-2 bg-white border border-stone-200 px-3 py-1 rounded-full shadow-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-stone-400" />
            <span className="text-xs font-medium text-stone-500 tracking-wide uppercase">
              {badge}
            </span>
          </motion.div>
          
          {/* 标题 - 衬线体 */}
          <h1 className="text-5xl md:text-7xl artisan-heading leading-[1.1] tracking-tight">
            {titleParts[0]}
            <span className="artisan-heading-italic">loyalty club</span>
            {titleParts[1]}
          </h1>
          
          {/* 副标题 */}
          <p className="text-lg text-stone-600 max-w-lg leading-relaxed font-sans artisan-text-pretty">
            {subtitle}
          </p>

          {/* CTA 按钮 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button 
              className="artisan-button-primary group"
              onClick={onPrimaryClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {ctaPrimary}
              <ArrowRight className="ml-2 w-4 h-4 inline-block group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button 
              className="artisan-button-secondary"
              onClick={onSecondaryClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {ctaSecondary}
            </motion.button>
          </div>
          
          {/* Disclaimer */}
          <p className="text-sm text-stone-400">
            {disclaimer}
          </p>

          {/* 特性列表 */}
          {showFeatures && (
            <motion.div 
              className="flex flex-wrap gap-6 pt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {[
                'No setup fees',
                'Cancel anytime',
                'Email support',
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm text-stone-600">{feature}</span>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* 右侧：手机预览 */}
        {showPhonePreview && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* 手机容器 */}
            <div className="relative w-[300px] h-[600px] bg-[#1A1A1A] rounded-[3rem] border-[8px] border-stone-800 shadow-2xl overflow-hidden">
              {/* 刘海 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1A1A1A] rounded-b-2xl z-20" />
              
              {/* 屏幕内容 */}
              <div className="absolute top-0 w-full h-full bg-white p-4 pt-12">
                {/* 会员卡主体 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <MemberCard
                    brandColor="#1A1A1A"
                    brandName="Your Brand"
                    memberName="Sarah Johnson"
                    memberSince="Dec 2025"
                    points={240}
                    nextRewardPoints={300}
                    size="sm"
                    animated={true}
                  />
                </motion.div>

                {/* 动态积分进度 */}
                <motion.div 
                  className="mt-8 px-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex justify-between text-[11px] mb-2 text-stone-500 uppercase tracking-tight">
                    <span>Next Reward: 300 pts</span>
                    <span>80%</span>
                  </div>
                  <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '80%' }}
                      transition={{ duration: 2, delay: 1.2 }}
                      className="h-full bg-green-600" 
                    />
                  </div>
                </motion.div>

                {/* 最近活动 */}
                <motion.div
                  className="mt-8 space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wide">
                    Recent Activity
                  </h4>
                  {[
                    { action: 'Purchase', points: '+20', time: '2 hours ago' },
                    { action: 'Referral', points: '+50', time: 'Yesterday' },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6 + index * 0.1 }}
                    >
                      <div>
                        <p className="text-sm font-medium text-stone-700">{activity.action}</p>
                        <p className="text-xs text-stone-400">{activity.time}</p>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {activity.points}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* 悬浮装饰 - 新会员通知 */}
            <motion.div 
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 hidden md:block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <p className="text-xs font-medium text-stone-600 tracking-tight">
                  New member joined just now!
                </p>
              </div>
            </motion.div>

            {/* 悬浮装饰 - 统计数据 */}
            <motion.div 
              className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 hidden lg:block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-stone-800">98%</p>
                <p className="text-xs text-stone-500">Satisfaction</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* 滚动提示 */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-stone-300 rounded-full flex items-start justify-center p-2"
        >
          <motion.div 
            className="w-1 h-2 bg-stone-400 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

/**
 * HeroSectionSimple - 简化版 Hero（无手机预览）
 */
export function HeroSectionSimple(props: Omit<HeroSectionProps, 'showPhonePreview'>) {
  return <HeroSection {...props} showPhonePreview={false} />;
}

