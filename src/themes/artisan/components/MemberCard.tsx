/**
 * MemberCard Component - Apple Wallet 风格会员卡
 * 设计理念: 磨砂玻璃 + 动态背景色 + 手工质感
 * 
 * Features:
 * - 动态品牌色背景
 * - 磨砂玻璃效果
 * - QR 码集成
 * - 积分动画效果
 * - 悬停交互
 */

'use client';

import { motion } from 'framer-motion';
import { QrCode, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface MemberCardProps {
  // 品牌配置
  brandColor?: string;
  brandName?: string;
  logoUrl?: string;
  
  // 会员信息
  memberName: string;
  memberEmail?: string;
  memberSince?: string;
  
  // 积分信息
  points: number;
  nextRewardPoints?: number;
  
  // QR 码
  qrCodeUrl?: string;
  
  // 样式配置
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showQR?: boolean;
  animated?: boolean;
}

export function MemberCard({
  brandColor = '#1A1A1A',
  brandName = 'Your Brand',
  logoUrl,
  memberName,
  memberEmail,
  memberSince,
  points = 0,
  nextRewardPoints,
  qrCodeUrl,
  className = '',
  size = 'md',
  showQR = true,
  animated = true,
}: MemberCardProps) {
  const [displayPoints, setDisplayPoints] = useState(0);

  // 积分动画效果 - 机械计数器
  useEffect(() => {
    if (!animated) {
      setDisplayPoints(points);
      return;
    }

    let start = displayPoints;
    const end = points;
    const duration = 1000; // 1秒
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // 使用 easeOutCubic 缓动函数
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeProgress);
      
      setDisplayPoints(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [points, animated]);

  // 计算进度百分比
  const progressPercentage = nextRewardPoints 
    ? Math.min((points / nextRewardPoints) * 100, 100)
    : 0;

  // 尺寸配置
  const sizeClasses = {
    sm: 'w-64 h-40',
    md: 'w-80 h-48',
    lg: 'w-96 h-56',
  };

  const textSizeClasses = {
    sm: {
      title: 'text-base',
      subtitle: 'text-[8px]',
      points: 'text-2xl',
      label: 'text-[8px]',
    },
    md: {
      title: 'text-xl',
      subtitle: 'text-[10px]',
      points: 'text-3xl',
      label: 'text-[10px]',
    },
    lg: {
      title: 'text-2xl',
      subtitle: 'text-xs',
      points: 'text-4xl',
      label: 'text-xs',
    },
  };

  return (
    <motion.div
      whileHover={animated ? { y: -5, scale: 1.02 } : undefined}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative ${sizeClasses[size]} rounded-2xl p-6 text-white overflow-hidden ${className}`}
      style={{ 
        backgroundColor: brandColor,
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* 磨砂玻璃装饰层 - 营造深度感 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/3 rounded-full blur-3xl -ml-10 -mb-10" />
      
      {/* 顶部区域 - Logo 和标识 */}
      <div className="relative z-10 flex justify-between items-start mb-8">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={brandName}
              className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-lg"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-white/80" />
            </div>
          )}
        </div>

        {/* 会员标识 */}
        <span 
          className={`${textSizeClasses[size].subtitle} tracking-[0.2em] opacity-50 uppercase font-light`}
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Member Pass
        </span>
      </div>

      {/* 会员信息区域 */}
      <div className="relative z-10 space-y-1 mb-8">
        <motion.h3 
          className={`${textSizeClasses[size].title} font-serif italic tracking-tight`}
          initial={animated ? { opacity: 0, x: -10 } : undefined}
          animate={animated ? { opacity: 1, x: 0 } : undefined}
          transition={{ delay: 0.2 }}
        >
          {memberName}
        </motion.h3>
        
        {memberEmail && (
          <p className={`${textSizeClasses[size].subtitle} opacity-40 tracking-wide`}>
            {memberEmail}
          </p>
        )}
        
        {memberSince && (
          <p className={`${textSizeClasses[size].subtitle} opacity-40 uppercase tracking-widest`}>
            Member since {memberSince}
          </p>
        )}
      </div>

      {/* 底部区域 - 积分和 QR 码 */}
      <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-4">
        {/* 积分显示 */}
        <div>
          <motion.p 
            className={`${textSizeClasses[size].points} font-light tabular-nums`}
            key={displayPoints}
          >
            {displayPoints.toLocaleString()}
          </motion.p>
          <p className={`${textSizeClasses[size].label} opacity-50 uppercase tracking-widest`}>
            Points
          </p>
        </div>

        {/* QR 码 */}
        {showQR && (
          <motion.div 
            className="p-2 bg-white rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="QR Code"
                className="w-10 h-10"
              />
            ) : (
              <QrCode className="text-black w-10 h-10" />
            )}
          </motion.div>
        )}
      </div>

      {/* 微光效果 - 增加高级感 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

/**
 * MemberCardPreview - 带进度条的完整预览版本
 */
export interface MemberCardPreviewProps extends MemberCardProps {
  showProgress?: boolean;
}

export function MemberCardPreview({
  showProgress = true,
  ...cardProps
}: MemberCardPreviewProps) {
  const progressPercentage = cardProps.nextRewardPoints 
    ? Math.min((cardProps.points / cardProps.nextRewardPoints) * 100, 100)
    : 0;

  return (
    <div className="space-y-6">
      <MemberCard {...cardProps} />
      
      {/* 进度条 */}
      {showProgress && cardProps.nextRewardPoints && (
        <motion.div 
          className="px-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between text-[11px] mb-2 text-gray-500 uppercase tracking-tight">
            <span>Next Reward: {cardProps.nextRewardPoints} pts</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-green-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * MemberCardSkeleton - 加载骨架屏
 */
export function MemberCardSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-64 h-40',
    md: 'w-80 h-48',
    lg: 'w-96 h-56',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-gray-200 animate-pulse`}>
      <div className="p-6 h-full flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="w-10 h-10 rounded-full bg-gray-300" />
          <div className="w-20 h-3 bg-gray-300 rounded" />
        </div>
        
        <div className="space-y-2">
          <div className="w-32 h-6 bg-gray-300 rounded" />
          <div className="w-24 h-3 bg-gray-300 rounded" />
        </div>
        
        <div className="flex justify-between items-end border-t border-gray-300 pt-4">
          <div className="space-y-1">
            <div className="w-16 h-8 bg-gray-300 rounded" />
            <div className="w-12 h-2 bg-gray-300 rounded" />
          </div>
          <div className="w-10 h-10 bg-gray-300 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * MemberCardGrid - 卡片网格布局
 */
export interface MemberCardGridProps {
  cards: MemberCardProps[];
  columns?: 1 | 2 | 3 | 4;
  gap?: number;
}

export function MemberCardGrid({ 
  cards, 
  columns = 3,
  gap = 6 
}: MemberCardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-${gap}`}>
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MemberCard {...card} />
        </motion.div>
      ))}
    </div>
  );
}

