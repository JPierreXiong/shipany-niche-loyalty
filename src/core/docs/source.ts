// Mock source for docs - docs system is disabled
import { createElement } from 'react';
import type { I18nConfig } from 'fumadocs-core/i18n';
import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';

export const i18n: I18nConfig = {
  defaultLanguage: 'en',
  languages: ['en', 'zh', 'fr'],
};

const iconHelper = (icon: string | undefined) => {
  if (!icon) {
    return;
  }
  if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
};

// Mock source object
const mockSource = {
  files: [],
};

// Docs source (mocked)
export const docsSource = loader({
  baseUrl: '/docs',
  source: mockSource as any,
  i18n,
  icon: iconHelper,
});

// Pages source (mocked)
export const pagesSource = loader({
  baseUrl: '/',
  source: mockSource as any,
  i18n,
  icon: iconHelper,
});

// Posts source (mocked)
export const postsSource = loader({
  baseUrl: '/blog',
  source: mockSource as any,
  i18n,
  icon: iconHelper,
});

// Keep backward compatibility
export const source = docsSource;
