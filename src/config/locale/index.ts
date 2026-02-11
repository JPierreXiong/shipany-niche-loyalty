export const localeNames: any = {
  en: 'English',
  zh: '中文',
  fr: 'Français',
};

export const locales = ['en', 'zh', 'fr'] as const;

// 直接使用环境变量，避免引用 envConfigs（包含 Node.js API）
// 默认语言为英文 (en)
export const defaultLocale = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en') as typeof locales[number];

export const localePrefix = 'as-needed' as const;

export const localeDetection = true;

export const localeMessagesRootPath = '@/config/locale/messages';

export const localeMessagesPaths = [
  'common',
  'landing',
  'showcases',
  'blog',
  'pricing',
  'about',
  'contact',
  'privacy',
  'settings/sidebar',
  'settings/profile',
  'settings/security',
  'settings/billing',
  'settings/payments',
  'settings/credits',
  'settings/apikeys',
  'admin/sidebar',
  'admin/users',
  'admin/roles',
  'admin/permissions',
  'admin/categories',
  'admin/posts',
  'admin/payments',
  'admin/subscriptions',
  'admin/credits',
  'admin/settings',
  'admin/apikeys',
  'activity/sidebar',
];
