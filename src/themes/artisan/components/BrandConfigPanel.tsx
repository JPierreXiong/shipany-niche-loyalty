/**
 * BrandConfigPanel - 品牌配置面板（实时预览）
 * 设计理念: 所见即所得 (WYSIWYG)
 * 
 * Features:
 * - 实时品牌色预览
 * - Logo 上传和裁剪
 * - 颜色提取（从 Logo）
 * - 即时反馈动画
 */

'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Palette, Check, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useNicheLoyaltyStore } from '@/shared/stores/niche-loyalty-store';
import { MemberCard } from '@/themes/artisan/components';

// 预设品牌色
const PRESET_COLORS = [
  { name: 'Charcoal', value: '#1A1A1A' },
  { name: 'Sage', value: '#8B9D83' },
  { name: 'Terracotta', value: '#C97064' },
  { name: 'Clay', value: '#D4A574' },
  { name: 'Olive', value: '#6B8E23' },
  { name: 'Navy', value: '#2C3E50' },
  { name: 'Burgundy', value: '#800020' },
  { name: 'Forest', value: '#228B22' },
];

export function BrandConfigPanel() {
  const { brandConfig, updateBrandColor, updateBrandName, updateLogoUrl } = useNicheLoyaltyStore();
  const [isUploading, setIsUploading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState(brandConfig.brandColor);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理品牌名称变化
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateBrandName(e.target.value);
  };

  // 处理颜色选择
  const handleColorSelect = (color: string) => {
    updateBrandColor(color);
    setCustomColor(color);
  };

  // 处理自定义颜色
  const handleCustomColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    updateBrandColor(color);
  };

  // 处理 Logo 上传
  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // 验证文件大小 (最大 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    setIsUploading(true);

    try {
      // 创建预览 URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        updateLogoUrl(imageUrl);
        
        // TODO: 这里可以集成颜色提取库（如 colorthief）
        // extractDominantColor(imageUrl).then(color => {
        //   updateBrandColor(color);
        // });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };

  // 移除 Logo
  const handleRemoveLogo = () => {
    updateLogoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* 左侧：配置表单 */}
      <div className="space-y-8">
        {/* 品牌名称 */}
        <div className="artisan-card p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-stone-400" />
            <h3 className="text-lg font-medium text-stone-800">Brand Identity</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">
              Brand Name
            </label>
            <input
              type="text"
              value={brandConfig.brandName}
              onChange={handleNameChange}
              placeholder="Your Brand"
              className="artisan-input w-full text-lg"
              maxLength={30}
            />
            <p className="text-xs text-stone-400 mt-1">
              {brandConfig.brandName.length}/30 characters
            </p>
          </div>
        </div>

        {/* Logo 上传 */}
        <div className="artisan-card p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <ImageIcon className="w-5 h-5 text-stone-400" />
            <h3 className="text-lg font-medium text-stone-800">Logo</h3>
          </div>

          {brandConfig.logoUrl ? (
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-stone-200"
              >
                <img
                  src={brandConfig.logoUrl}
                  alt="Brand Logo"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full h-32 border-2 border-dashed border-stone-300 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:border-stone-400 hover:bg-stone-50 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-stone-400 border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-stone-400" />
                  <span className="text-sm text-stone-600">Upload Logo</span>
                  <span className="text-xs text-stone-400">PNG, JPG up to 2MB</span>
                </>
              )}
            </motion.button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>

        {/* 品牌色选择 */}
        <div className="artisan-card p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-stone-400" />
              <h3 className="text-lg font-medium text-stone-800">Brand Color</h3>
            </div>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="text-sm text-stone-600 hover:text-stone-800 transition-colors"
            >
              {showColorPicker ? 'Hide' : 'Custom'}
            </button>
          </div>

          {/* 预设颜色 */}
          <div className="grid grid-cols-4 gap-3">
            {PRESET_COLORS.map((color) => (
              <motion.button
                key={color.value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleColorSelect(color.value)}
                className="relative w-full aspect-square rounded-xl shadow-md transition-all"
                style={{ backgroundColor: color.value }}
              >
                <AnimatePresence>
                  {brandConfig.brandColor === color.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-stone-800" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="sr-only">{color.name}</span>
              </motion.button>
            ))}
          </div>

          {/* 自定义颜色选择器 */}
          <AnimatePresence>
            {showColorPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={customColor}
                    onChange={handleCustomColorChange}
                    className="w-16 h-16 rounded-xl cursor-pointer border-2 border-stone-200"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^#[0-9A-F]{6}$/i.test(value)) {
                          handleColorSelect(value);
                        }
                        setCustomColor(value);
                      }}
                      placeholder="#1A1A1A"
                      className="artisan-input w-full font-mono"
                      maxLength={7}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 右侧：实时预览 */}
      <div className="space-y-6">
        <div className="sticky top-6">
          <div className="artisan-glass-card p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-stone-800">Live Preview</h3>
              <span className="artisan-badge">Real-time</span>
            </div>

            <p className="text-sm text-stone-600 mb-6">
              See how your member card looks with your brand identity
            </p>

            {/* 会员卡预览 */}
            <motion.div
              key={`${brandConfig.brandColor}-${brandConfig.brandName}-${brandConfig.logoUrl}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <MemberCard
                brandColor={brandConfig.brandColor}
                brandName={brandConfig.brandName}
                logoUrl={brandConfig.logoUrl || undefined}
                memberName="Sarah Johnson"
                memberEmail="sarah@example.com"
                memberSince="Dec 2025"
                points={240}
                nextRewardPoints={300}
                size="md"
                animated={true}
              />
            </motion.div>

            {/* 提示信息 */}
            <div className="mt-6 p-4 bg-stone-50 rounded-xl">
              <p className="text-xs text-stone-600 leading-relaxed">
                💡 <strong>Pro Tip:</strong> Choose a color that reflects your brand's personality. 
                Earthy tones work great for artisan brands.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



























