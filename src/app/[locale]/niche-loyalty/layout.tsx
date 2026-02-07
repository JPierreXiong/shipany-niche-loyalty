import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Glow - Aesthetic Loyalty Program for Shopify Artisans',
  description: 'Give your brand the glow it deserves. Create beautiful, digital membership cards that your customers will actually want to keep. Setup in 5 minutes.',
  keywords: [
    'aesthetic loyalty program',
    'Shopify loyalty app',
    'artisan rewards',
    'digital membership cards',
    'Apple Wallet loyalty',
    'minimalist rewards app',
    'handmade shop loyalty',
    'indie maker tools',
    'Smile.io alternative',
    'Yotpo alternative',
  ],
  openGraph: {
    title: 'Glow - Aesthetic Loyalty for Artisan Brands',
    description: 'Most loyalty apps feel like a chore. Glow feels like a gift.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Glow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glow - Give your brand the glow it deserves',
    description: 'Beautiful loyalty cards for artisan Shopify stores. Setup in 5 minutes.',
  },
};

export default function NicheLoyaltyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


