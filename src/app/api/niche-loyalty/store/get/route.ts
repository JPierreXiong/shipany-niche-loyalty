import { NextRequest } from 'next/server';

import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { and, eq, sql } from 'drizzle-orm';

// GET /api/niche-loyalty/store/get
// 获取店铺信息
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;

    // 查询用户的店铺
    const stores = await db()
      .select()
      .from(schema.loyaltyStore)
      .where(eq(schema.loyaltyStore.userId, user.id))
      .limit(1);

    if (!stores.length) {
      return respData({
        connected: false,
        store: null,
      });
    }

    const store = stores[0];

    // 查询会员数量
    const memberCountResult = await db()
      .select({ count: sql<number>`COUNT(*)` })
      .from(schema.loyaltyMember)
      .where(
        and(
          eq(schema.loyaltyMember.storeId, store.id),
          eq(schema.loyaltyMember.status, 'active')
        )
      );

    const memberCount = memberCountResult[0]?.count || 0;

    // 查询活动数量
    const campaignCountResult = await db()
      .select({ count: sql<number>`COUNT(*)` })
      .from(schema.loyaltyCampaign)
      .where(eq(schema.loyaltyCampaign.storeId, store.id));

    const campaignCount = campaignCountResult[0]?.count || 0;

    return respData({
      connected: true,
      store: {
        id: store.id,
        name: store.name,
        shopifyDomain: store.shopifyDomain,
        shopifyClientId: store.shopifyClientId, // Include Client ID (safe to expose)
        status: store.status,
        memberCount,
        campaignCount,
        createdAt: store.createdAt.toISOString(),
      },
    });
  } catch (e) {
    console.error('get store error', e);
    return respErr('Failed to get store');
  }
}



