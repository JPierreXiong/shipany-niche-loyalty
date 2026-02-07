/**
 * Niche Loyalty Dashboard Layout
 * Uses the same Header and Footer as Landing Page
 */

import { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { getThemeLayout } from '@/core/theme';
import {
  Footer as FooterType,
  Header as HeaderType,
} from '@/shared/types/blocks/landing';

export default async function NicheLoyaltyLayout({
  children,
}: {
  children: ReactNode;
}) {
  // load page data
  const t = await getTranslations('landing');

  // load layout component
  const Layout = await getThemeLayout('landing');

  // header and footer to display (same as landing page)
  const header: HeaderType = t.raw('header');
  const footer: FooterType = t.raw('footer');

  return (
    <Layout header={header} footer={footer}>
      {children}
    </Layout>
  );
}
