import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Niche Loyalty - Artisan Loyalty Platform',
    short_name: 'Niche Loyalty',
    description: 'Build lasting relationships with your artisan customers through personalized loyalty programs',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#6466F1',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}












