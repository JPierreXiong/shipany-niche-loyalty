import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { Landing } from '@/shared/types/blocks/landing';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // load page data
  const t = await getTranslations('landing');

  // build page params
  const page: Landing = {
    hero: {
      ...t.raw('hero'),
      image: undefined,
      image_invert: undefined,
      show_avatars: false,
    },
    // 只保留 Niche Loyalty 相关内容
    logos: undefined,
    introduce: t.raw('introduce'),
    benefits: t.raw('benefits'),
    usage: t.raw('usage'),
    features: t.raw('features'),
    stats: t.raw('stats'),
    
    // 移除 Digital Heirloom 内容
    'how-it-works': undefined,
    'zero-knowledge-security': undefined,
    'technical-architecture': undefined,
    
    testimonials: undefined,
    subscribe: t.raw('subscribe'),
    faq: t.raw('faq'),
    cta: t.raw('cta'),
  };

  // load page component
  const Page = await getThemePage('landing');

  return <Page locale={locale} page={page} />;
}
