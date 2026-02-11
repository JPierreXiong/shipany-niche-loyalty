/**
 * SEO Configuration for Niche Loyalty
 * SEO优化配置 - 不改变shipany结构
 */

export const SEO_CONFIG = {
  // 网站基本信息
  siteName: 'Niche Loyalty',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://nicheloyalty.com',
  defaultLocale: 'en',
  
  // 默认SEO元数据
  defaultTitle: 'Niche Loyalty - Shopify Loyalty Program for Niche Stores',
  defaultDescription: 'Build customer loyalty for your niche Shopify store. Easy setup, powerful rewards, and automated campaigns to grow your business.',
  
  // 关键词
  keywords: [
    'shopify loyalty program',
    'customer rewards',
    'niche store loyalty',
    'shopify rewards app',
    'customer retention',
    'loyalty points',
    'discount codes',
    'email marketing',
  ],
  
  // Open Graph
  ogImage: '/images/og-image.jpg',
  twitterCard: 'summary_large_image',
  twitterSite: '@nicheloyalty',
  
  // 结构化数据
  organization: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Niche Loyalty',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },
};

/**
 * 生成页面SEO元数据
 */
export function generatePageSEO(params: {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  noindex?: boolean;
  canonical?: string;
}) {
  const {
    title,
    description,
    keywords,
    ogImage,
    noindex = false,
    canonical,
  } = params;

  const fullTitle = title 
    ? `${title} | ${SEO_CONFIG.siteName}`
    : SEO_CONFIG.defaultTitle;

  return {
    title: fullTitle,
    description: description || SEO_CONFIG.defaultDescription,
    keywords: keywords?.join(', ') || SEO_CONFIG.keywords.join(', '),
    openGraph: {
      title: fullTitle,
      description: description || SEO_CONFIG.defaultDescription,
      url: canonical || SEO_CONFIG.siteUrl,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: ogImage || SEO_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: SEO_CONFIG.defaultLocale,
      type: 'website',
    },
    twitter: {
      card: SEO_CONFIG.twitterCard,
      site: SEO_CONFIG.twitterSite,
      title: fullTitle,
      description: description || SEO_CONFIG.defaultDescription,
      images: [ogImage || SEO_CONFIG.ogImage],
    },
    robots: noindex ? 'noindex,nofollow' : 'index,follow',
    ...(canonical && { canonical }),
  };
}

/**
 * 生成结构化数据
 */
export function generateStructuredData(type: 'organization' | 'breadcrumb' | 'faq', data?: any) {
  switch (type) {
    case 'organization':
      return SEO_CONFIG.organization;
      
    case 'breadcrumb':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${SEO_CONFIG.siteUrl}${item.url}`,
        })),
      };
      
    case 'faq':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.questions.map((q: any) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer,
          },
        })),
      };
      
    default:
      return null;
  }
}

/**
 * SEO友好的URL生成
 */
export function generateSEOUrl(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 页面特定的SEO配置
 */
export const PAGE_SEO = {
  home: {
    title: 'Shopify Loyalty Program for Niche Stores',
    description: 'Build customer loyalty with automated rewards, discount codes, and email campaigns. Perfect for niche Shopify stores.',
    keywords: ['shopify loyalty', 'customer rewards', 'niche store'],
  },
  
  pricing: {
    title: 'Pricing Plans - Free & Pro',
    description: 'Start free with 50 members. Upgrade to Base (500 members) or Pro (unlimited) as you grow.',
    keywords: ['loyalty program pricing', 'shopify app pricing', 'rewards program cost'],
  },
  
  features: {
    title: 'Features - Loyalty Program Tools',
    description: 'Member management, automated campaigns, discount codes, email marketing, and Shopify integration.',
    keywords: ['loyalty features', 'rewards program features', 'customer retention tools'],
  },
  
  dashboard: {
    title: 'Dashboard',
    description: 'Manage your loyalty program, view analytics, and engage with your customers.',
    noindex: true,
  },
};

