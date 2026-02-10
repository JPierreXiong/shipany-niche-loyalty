import { ReactNode } from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { envConfigs } from '@/config';
import { getThemeLayout } from '@/core/theme';
import { LocaleDetector } from '@/shared/blocks/common';
import {
  Footer as FooterType,
  Header as HeaderType,
} from '@/shared/types/blocks/landing';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = envConfigs.app_url || 'https://www.digitalheirloom.app';
  
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: 'Niche Loyalty - Artisan Loyalty Platform',
      template: '%s | Niche Loyalty',
    },
    description: 'Build lasting relationships with your artisan customers through personalized loyalty programs. Perfect for pottery studios, jewelry makers, and craft businesses.',
    keywords: [
      'loyalty program',
      'artisan business',
      'customer retention',
      'pottery studio',
      'jewelry maker',
      'craft business',
      'customer loyalty',
      'small business tools',
      'artisan marketing',
      'customer engagement',
    ],
    authors: [{ name: 'Niche Loyalty Team' }],
    creator: 'Niche Loyalty',
    publisher: 'Niche Loyalty',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: baseUrl,
      title: 'Niche Loyalty - Artisan Loyalty Platform',
      description: 'Build lasting relationships with your artisan customers through personalized loyalty programs.',
      siteName: 'Niche Loyalty',
      images: [
        {
          url: `${baseUrl}/logo.png`,
          width: 1200,
          height: 630,
          alt: 'Niche Loyalty Platform',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Niche Loyalty - Artisan Loyalty Platform',
      description: 'Build lasting relationships with your artisan customers through personalized loyalty programs.',
      images: [`${baseUrl}/logo.png`],
      creator: '@nicheloyalty',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },
    alternates: {
      canonical: baseUrl,
      languages: {
        'en': `${baseUrl}`,
        'zh': `${baseUrl}/zh`,
        'fr': `${baseUrl}/fr`,
      },
    },
  };
}

export default async function LandingLayout({
  children,
}: {
  children: ReactNode;
}) {
  // load page data
  const t = await getTranslations('landing');

  // load layout component
  const Layout = await getThemeLayout('landing');

  // header and footer to display
  const header: HeaderType = t.raw('header');
  const footer: FooterType = t.raw('footer');

  return (
    <Layout header={header} footer={footer}>
      <LocaleDetector />
      {children}
    </Layout>
  );
}
