import '@/config/style/global.css';

import { JetBrains_Mono, Merriweather, Noto_Sans_Mono, Cormorant_Garamond } from 'next/font/google';
import { getLocale, setRequestLocale } from 'next-intl/server';
import NextTopLoader from 'nextjs-toploader';

import { envConfigs } from '@/config';
import { locales } from '@/config/locale';
import { getAdsService } from '@/shared/services/ads';
import { getAffiliateService } from '@/shared/services/affiliate';
import { getAnalyticsService } from '@/shared/services/analytics';
import { getCustomerService } from '@/shared/services/customer_service';

const notoSansMono = Noto_Sans_Mono({
  subsets: ['latin'],
  variable: '--font-sans',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-serif',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

// Artisan Theme - Cormorant Garamond (衬线体标题)
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-artisan-heading',
  display: 'swap',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get locale with fallback to default
  let locale = 'en';
  try {
    locale = await getLocale();
    setRequestLocale(locale);
  } catch (error) {
    // Fallback to default locale if getLocale fails
    console.warn('Failed to get locale, using default:', error);
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true';

  // 环境变量验证（仅在开发环境）
  if (!isProduction) {
    try {
      const { validateEnvVars } = await import('@/shared/lib/env-validation');
      validateEnvVars();
    } catch (error) {
      // 静默失败，不影响应用启动
    }
  }

  // app url
  const appUrl = envConfigs.app_url || '';

  // ads components
  let adsMetaTags = null;
  let adsHeadScripts = null;
  let adsBodyScripts = null;

  // analytics components
  let analyticsMetaTags = null;
  let analyticsHeadScripts = null;
  let analyticsBodyScripts = null;

  // affiliate components
  let affiliateMetaTags = null;
  let affiliateHeadScripts = null;
  let affiliateBodyScripts = null;

  // customer service components
  let customerServiceMetaTags = null;
  let customerServiceHeadScripts = null;
  let customerServiceBodyScripts = null;

  if (isProduction || isDebug) {
    // get ads components
    const adsService = await getAdsService();
    adsMetaTags = adsService.getMetaTags();
    adsHeadScripts = adsService.getHeadScripts();
    adsBodyScripts = adsService.getBodyScripts();

    // get analytics components
    const analyticsService = await getAnalyticsService();
    analyticsMetaTags = analyticsService.getMetaTags();
    analyticsHeadScripts = analyticsService.getHeadScripts();
    analyticsBodyScripts = analyticsService.getBodyScripts();

    // get affiliate components
    const affiliateService = await getAffiliateService();
    affiliateMetaTags = affiliateService.getMetaTags();
    affiliateHeadScripts = affiliateService.getHeadScripts();
    affiliateBodyScripts = affiliateService.getBodyScripts();

    // get customer service components
    const customerService = await getCustomerService();
    customerServiceMetaTags = customerService.getMetaTags();
    customerServiceHeadScripts = customerService.getHeadScripts();
    customerServiceBodyScripts = customerService.getBodyScripts();
  }

  return (
    <html
      lang={locale}
      className={`${notoSansMono.variable} ${merriweather.variable} ${jetbrainsMono.variable} ${cormorantGaramond.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* inject locales */}
        {locales ? (
          <>
            {/* x-default: default language version for users whose language doesn't match any specific version */}
            <link
              rel="alternate"
              hrefLang="x-default"
              href={`${appUrl}`}
            />
            {locales.map((loc) => (
              <link
                key={loc}
                rel="alternate"
                hrefLang={loc}
                href={`${appUrl}${loc === 'en' ? '' : `/${loc}`}`}
              />
            ))}
          </>
        ) : null}

        {/* inject ads meta tags */}
        {adsMetaTags}
        {/* inject ads head scripts */}
        {adsHeadScripts}

        {/* inject analytics meta tags */}
        {analyticsMetaTags}
        {/* inject analytics head scripts */}
        {analyticsHeadScripts}

        {/* inject affiliate meta tags */}
        {affiliateMetaTags}
        {/* inject affiliate head scripts */}
        {affiliateHeadScripts}

        {/* inject customer service meta tags */}
        {customerServiceMetaTags}
        {/* inject customer service head scripts */}
        {customerServiceHeadScripts}
      </head>
      <body suppressHydrationWarning className="overflow-x-hidden">
        <NextTopLoader
          color="#6466F1"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
        />

        {children}

        {/* inject ads body scripts */}
        {adsBodyScripts}

        {/* inject analytics body scripts */}
        {analyticsBodyScripts}

        {/* inject affiliate body scripts */}
        {affiliateBodyScripts}

        {/* inject customer service body scripts */}
        {customerServiceBodyScripts}
      </body>
    </html>
  );
}
