/**
 * Robots.txt Generator
 * 动态生成robots.txt
 */

import { SEO_CONFIG } from '@/shared/config/seo';

export async function GET() {
  const baseUrl = SEO_CONFIG.siteUrl;
  
  const robots = `# Niche Loyalty - Robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /_next/
Disallow: /settings/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}









