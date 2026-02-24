/**
 * Sitemap Generator
 * 动态生成sitemap.xml
 */

import { SEO_CONFIG } from '@/shared/config/seo';

export async function GET() {
  const baseUrl = SEO_CONFIG.siteUrl;
  
  const staticPages = [
    { url: '', priority: 1.0, changefreq: 'daily' },
    { url: '/pricing', priority: 0.9, changefreq: 'weekly' },
    { url: '/features', priority: 0.8, changefreq: 'weekly' },
    { url: '/about', priority: 0.7, changefreq: 'monthly' },
    { url: '/contact', priority: 0.7, changefreq: 'monthly' },
    { url: '/blog', priority: 0.8, changefreq: 'daily' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}















