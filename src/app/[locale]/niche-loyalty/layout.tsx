import { Metadata } from 'next';
import { envConfigs } from '@/config';

const baseUrl = envConfigs.app_url || 'https://www.digitalheirloom.app';

export const metadata: Metadata = {
  title: 'Glow - Aesthetic Loyalty for Artisan Shopify Stores',
  description: 'Create beautiful, digital membership cards that your customers will actually want to keep. Setup in 5 minutes. Perfect for pottery studios, jewelry makers, and craft businesses.',
  keywords: [
    'loyalty program',
    'Shopify loyalty',
    'artisan business',
    'membership cards',
    'Apple Wallet',
    'customer retention',
    'pottery studio loyalty',
    'jewelry maker rewards',
    'craft business tools',
    'digital membership',
    'customer engagement',
  ],
  authors: [{ name: 'Glow Team' }],
  openGraph: {
    title: 'Glow - Aesthetic Loyalty for Artisan Shopify Stores',
    description: 'Most loyalty apps feel like a chore. Glow feels like a gift. Create beautiful loyalty programs in 5 minutes.',
    type: 'website',
    url: `${baseUrl}/niche-loyalty`,
    siteName: 'Glow',
    images: [
      {
        url: `${baseUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Glow - Artisan Loyalty Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glow - Aesthetic Loyalty for Artisan Shopify Stores',
    description: 'Create beautiful, digital membership cards in 5 minutes.',
    images: [`${baseUrl}/logo.png`],
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
  alternates: {
    canonical: `${baseUrl}/niche-loyalty`,
  },
};

export default function NicheLoyaltyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
