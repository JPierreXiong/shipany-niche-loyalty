/**
 * StatsCard Component - 统计卡片组件
 * 设计理念: 纸张质感 + 动态数字 + 微交互
 * 
 * Features:
 * - 数字动画效果
 * - 趋势指示器
 * - 悬停效果
 * - 响应式布局
 */

'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface StatsCardProps {
  // 数据
  label: string;
  value: number | string;
  unit?: string;
  
  // 趋势
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  trendLabel?: string;
  
  // 图标
  icon?: LucideIcon;
  iconColor?: string;
  
  // 样式
  className?: string;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatsCard({
  label,
  value,
  unit = '',
  trend,
  trendValue,
  trendLabel,
  icon: Icon,
  iconColor = '#8B9D83',
  className = '',
  animated = true,
  size = 'md',
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;

  // 数字动画
  useEffect(() => {
    if (!animated || typeof value !== 'number') {
      setDisplayValue(numericValue);
      return;
    }

    let start = 0;
    const end = numericValue;
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeProgress;
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value, animated, numericValue]);

  // 趋势图标和颜色
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-400';
  const trendBg = trend === 'up' ? 'bg-green-50' : trend === 'down' ? 'bg-red-50' : 'bg-gray-50';

  // 尺寸配置
  const sizeClasses = {
    sm: {
      container: 'p-4',
      value: 'text-2xl',
      label: 'text-xs',
      icon: 'w-8 h-8',
      trend: 'text-xs',
    },
    md: {
      container: 'p-6',
      value: 'text-3xl',
      label: 'text-sm',
      icon: 'w-10 h-10',
      trend: 'text-sm',
    },
    lg: {
      container: 'p-8',
      value: 'text-4xl',
      label: 'text-base',
      icon: 'w-12 h-12',
      trend: 'text-base',
    },
  };

  return (
    <motion.div
      className={`artisan-card ${sizeClasses[size].container} ${className}`}
      initial={animated ? { opacity: 0, y: 20 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      {/* 顶部 - 图标和标签 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className={`${sizeClasses[size].label} text-stone-500 uppercase tracking-wide font-medium`}>
            {label}
          </p>
        </div>
        
        {Icon && (
          <div 
            className={`${sizeClasses[size].icon} rounded-full flex items-center justify-center`}
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <Icon className="w-1/2 h-1/2" style={{ color: iconColor }} />
          </div>
        )}
      </div>

      {/* 数值 */}
      <div className="mb-2">
        <motion.span 
          className={`${sizeClasses[size].value} font-light text-stone-800 tabular-nums`}
          key={displayValue}
        >
          {typeof value === 'number' 
            ? Math.round(displayValue).toLocaleString()
            : value
          }
        </motion.span>
        {unit && (
          <span className="text-lg text-stone-400 ml-1">
            {unit}
          </span>
        )}
      </div>

      {/* 趋势指示器 */}
      {trend && trendValue && (
        <div className={`inline-flex items-center space-x-1 ${trendBg} px-2 py-1 rounded-full`}>
          <TrendIcon className={`w-3 h-3 ${trendColor}`} />
          <span className={`${sizeClasses[size].trend} font-medium ${trendColor}`}>
            {trendValue}
          </span>
          {trendLabel && (
            <span className={`${sizeClasses[size].trend} text-stone-500`}>
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

/**
 * StatsCardGrid - 统计卡片网格
 */
export interface StatsCardGridProps {
  stats: StatsCardProps[];
  columns?: 2 | 3 | 4;
  gap?: number;
}

export function StatsCardGrid({ 
  stats, 
  columns = 4,
  gap = 6 
}: StatsCardGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-${gap}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatsCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * StatsCardCompact - 紧凑版统计卡片
 */
export function StatsCardCompact({
  label,
  value,
  icon: Icon,
  iconColor = '#8B9D83',
}: Pick<StatsCardProps, 'label' | 'value' | 'icon' | 'iconColor'>) {
  return (
    <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-stone-100">
      {Icon && (
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-stone-500 uppercase tracking-wide truncate">
          {label}
        </p>
        <p className="text-xl font-light text-stone-800 tabular-nums">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
}

/**
 * StatsCardSkeleton - 加载骨架屏
 */
export function StatsCardSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`artisan-card ${sizeClasses[size]} animate-pulse`}>
      <div className="flex items-start justify-between mb-4">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
      </div>
      <div className="h-8 w-24 bg-gray-200 rounded mb-2" />
      <div className="h-6 w-16 bg-gray-200 rounded-full" />
    </div>
  );
}

