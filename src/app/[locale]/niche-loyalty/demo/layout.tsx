import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Loyalty Card Demo | Design Your Artisan Brand Club | Glow',
  description: 'Experience the simplest loyalty tool for artisans. Customize your Apple Wallet style membership card in real-time. No sign-up required. Free forever for your first 50 members.',
  keywords: [
    'free loyalty card designer',
    'Shopify loyalty program simulator',
    'artisan membership card preview',
    'digital loyalty card maker',
    'Apple Wallet loyalty card',
    'loyalty program demo',
    'membership card designer',
    'free loyalty app',
    'Shopify rewards app',
    'artisan loyalty program',
  ],
  openGraph: {
    title: 'Try Glow Demo - Design Your Loyalty Card in 5 Seconds',
    description: 'Interactive demo: customize colors, upload logo, preview on mobile. No sign-up required.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Glow',
    images: [
      {
        url: '/imgs/demo-preview.png',
        width: 1200,
        height: 630,
        alt: 'Glow Loyalty Card Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Try Glow Demo - Free Loyalty Card Designer',
    description: 'Design your perfect loyalty card in 5 seconds. No sign-up required.',
    images: ['/imgs/demo-preview.png'],
  },
  alternates: {
    canonical: '/niche-loyalty/demo',
    languages: {
      'en': '/en/niche-loyalty/demo',
      'zh': '/zh/niche-loyalty/demo',
      'fr': '/fr/niche-loyalty/demo',
    },
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
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Glow Loyalty Card Designer',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              ratingCount: '127',
            },
          }),
        }}
      />
      {children}
    </>
  );
}


