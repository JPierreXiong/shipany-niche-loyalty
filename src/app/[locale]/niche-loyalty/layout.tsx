import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Glow - Aesthetic Loyalty for Artisan Shopify Stores',
  description: 'Create beautiful, digital membership cards that your customers will actually want to keep. Setup in 5 minutes.',
  keywords: ['loyalty program', 'Shopify', 'artisan', 'membership cards', 'Apple Wallet'],
  openGraph: {
    title: 'Glow - Aesthetic Loyalty for Artisan Shopify Stores',
    description: 'Most loyalty apps feel like a chore. Glow feels like a gift.',
    type: 'website',
  },
};

export default function NicheLoyaltyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
