import { MetadataRoute } from 'next';
import { envConfigs } from '@/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = envConfigs.app_url || 'https://www.digitalheirloom.app';
  const locales = ['en', 'zh', 'fr'];
  
  // Core marketing pages
  const routes = [
    '',
    '/pricing',
    '/about',
    '/contact',
    '/blog',
    '/privacy-policy',
    '/terms-of-service',
    '/disclaimer',
  ];

  // Programmatic SEO: Artisan-specific landing pages
  // These capture long-tail keywords like "loyalty tool for pottery studios"
  const artisanNiches = [
    'pottery',
    'jewelry',
    'leather-craft',
    'woodworking',
    'ceramics',
    'textile',
    'glassblowing',
    'metalwork',
  ];

  // Known blog posts (add more as you create them)
  const blogPosts = [
    'how-decryption-works',
    // Add more blog post slugs here as you create them
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for each locale and route combination
  locales.forEach((locale) => {
    routes.forEach((route) => {
      const url = locale === 'en' 
        ? `${baseUrl}${route}` 
        : `${baseUrl}/${locale}${route}`;
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route === '/blog' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route === '/pricing' ? 0.9 : 0.8,
      });
    });

    // Add programmatic SEO pages for artisan niches
    artisanNiches.forEach((niche) => {
      const nicheUrl = locale === 'en'
        ? `${baseUrl}/for/${niche}`
        : `${baseUrl}/${locale}/for/${niche}`;
      
      sitemapEntries.push({
        url: nicheUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7, // Good priority for niche landing pages
      });
    });

    // Add blog posts for each locale
    blogPosts.forEach((postSlug) => {
      const blogUrl = locale === 'en'
        ? `${baseUrl}/blog/${postSlug}`
        : `${baseUrl}/${locale}/blog/${postSlug}`;
      
      sitemapEntries.push({
        url: blogUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9, // High priority for blog posts
      });
    });
  });

  // Add ads.txt entry (optional, but helps with some crawlers)
  sitemapEntries.push({
    url: `${baseUrl}/ads.txt`,
    lastModified: new Date(),
    priority: 0.1,
    changeFrequency: 'monthly',
  });

  return sitemapEntries;
}
