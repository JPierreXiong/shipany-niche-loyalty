import { MetadataRoute } from 'next';
import { envConfigs } from '@/config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = envConfigs.app_url || 'https://www.digitalheirloom.app';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/settings/',
          '/activity/',
          '/niche-loyalty/dashboard/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/settings/',
          '/activity/',
          '/niche-loyalty/dashboard/',
        ],
        crawlDelay: 0,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}


















