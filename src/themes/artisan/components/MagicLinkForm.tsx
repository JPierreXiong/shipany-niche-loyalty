/**
 * MagicLinkForm Component - 无密码登录表单
 * 设计理念: 极简输入 + 一键登录 + 优雅反馈
 * 
 * Features:
 * - 下划线式输入框
 * - Email 验证
 * - 加载状态
 * - 成功/错误反馈
 * - 移动端触感反馈
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useState, FormEvent } from 'react';

export interface MagicLinkFormProps {
  // 文案配置
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  
  // 回调函数
  onSubmit?: (email: string) => Promise<void>;
  onSuccess?: (email: string) => void;
  onError?: (error: string) => void;
  
  // 样式配置
  className?: string;
  variant?: 'default' | 'minimal' | 'card';
  showIcon?: boolean;
}

export function MagicLinkForm({
  title = 'Join the club',
  subtitle = 'Enter your email to receive a magic link',
  placeholder = 'your@email.com',
  buttonText = 'Send Magic Link',
  successMessage = 'Check your email! We sent you a magic link.',
  onSubmit,
  onSuccess,
  onError,
  className = '',
  variant = 'default',
  showIcon = true,
}: MagicLinkFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Email 验证
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // 触感反馈（移动端）
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  // 表单提交
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // 验证 Email
    if (!email) {
      setError('Please enter your email');
      triggerHaptic();
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      triggerHaptic();
      return;
    }

    setIsLoading(true);

    try {
      // 调用提交回调
      if (onSubmit) {
        await onSubmit(email);
      } else {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      setIsSuccess(true);
      triggerHaptic();
      
      if (onSuccess) {
        onSuccess(email);
      }

      // 3秒后重置表单
      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      triggerHaptic();
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 变体样式
  const containerClasses = {
    default: 'space-y-6',
    minimal: 'space-y-4',
    card: 'artisan-card p-8 space-y-6',
  };

  return (
    <motion.div
      className={`${containerClasses[variant]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 标题区域 */}
      {(title || subtitle) && (
        <div className="text-center space-y-2">
          {showIcon && (
            <motion.div
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-stone-100 to-stone-50 mb-4"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="w-6 h-6 text-stone-600" />
            </motion.div>
          )}
          
          {title && (
            <h3 className="text-2xl md:text-3xl artisan-heading">
              {title}
            </h3>
          )}
          
          {subtitle && (
            <p className="text-stone-600 text-sm md:text-base">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email 输入框 */}
        <div className="relative">
          <div className="relative">
            <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading || isSuccess}
              className="artisan-input w-full pl-8 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="email"
              autoFocus
            />
          </div>

          {/* 错误提示 */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center space-x-2 mt-2 text-red-600 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 提交按钮 */}
        <motion.button
          type="submit"
          disabled={isLoading || isSuccess}
          className="artisan-button-primary w-full relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={!isLoading && !isSuccess ? { scale: 1.02 } : undefined}
          whileTap={!isLoading && !isSuccess ? { scale: 0.98 } : undefined}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span className="ml-2">Sending...</span>
              </motion.span>
            ) : isSuccess ? (
              <motion.span
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <Check className="w-5 h-5 mr-2" />
                Sent!
              </motion.span>
            ) : (
              <motion.span
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                {buttonText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </form>

      {/* 成功消息 */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="artisan-glass-card p-4 text-center"
          >
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <Check className="w-5 h-5" />
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 隐私提示 */}
      <p className="text-xs text-center text-stone-400">
        We'll never share your email. Unsubscribe anytime.
      </p>
    </motion.div>
  );
}

/**
 * MagicLinkFormInline - 内联版本（适合 Hero 区域）
 */
export function MagicLinkFormInline({
  onSubmit,
  placeholder = 'Enter your email',
  buttonText = 'Get Started',
}: Pick<MagicLinkFormProps, 'onSubmit' | 'placeholder' | 'buttonText'>) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(email);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        className="flex-1 px-4 py-3 rounded-full border border-stone-200 focus:border-stone-400 focus:outline-none transition-colors"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="artisan-button-primary px-6 whitespace-nowrap"
      >
        {isLoading ? 'Sending...' : buttonText}
      </button>
    </form>
  );
}

