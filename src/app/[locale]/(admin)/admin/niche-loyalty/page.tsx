import { getTranslations } from 'next-intl/server';

import { PERMISSIONS, requirePermission } from '@/core/rbac';
import { Header, Main, MainHeader } from '@/shared/blocks/dashboard';
import { PanelCard } from '@/shared/blocks/panel';
import { Crumb } from '@/shared/types/blocks/common';

export default async function NicheLoyaltyAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  await requirePermission({
    code: PERMISSIONS.ADMIN_ACCESS,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  const t = await getTranslations('admin');

  const crumbs: Crumb[] = [
    { title: t('sidebar.header.brand.title'), url: '/admin' },
    { title: 'Niche Loyalty', is_active: true },
  ];

  return (
    <>
      <Header crumbs={crumbs} />
      <Main>
        <MainHeader
          title="Niche Loyalty — Shopify Loyalty Plugin"
          description="Connect your Shopify store, see your members, and send simple reactivation campaigns."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PanelCard
            title="1. Connect your Shopify store"
            description="Use your custom app credentials (domain, admin access token, webhook secret) to connect."
            content="下一步我会在这里接一个表单，收集 your-shop.myshopify.com + Access Token + Webhook Secret，并调用 /api/niche-loyalty/connect-store。"
          />

          <PanelCard
            title="2. Overview"
            description="See how many members and campaigns you have, and how many redemptions they generated."
            content="这里会展示：Store 状态 + members 总数 + campaigns 总数 + 已核销折扣码数量（从 loyalty_* 表统计）。"
          />

          <PanelCard
            title="3. Send a simple email campaign"
            description="Pick a campaign and send one clean, high-conversion email via Resend."
            content="后续会在这里加一个按钮，调用 /api/niche-loyalty/send-campaign，用 Resend 群发一封简洁的英文邮件。"
          />
        </div>
      </Main>
    </>
  );
}







