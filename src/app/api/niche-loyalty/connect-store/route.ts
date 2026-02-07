import { NextRequest } from 'next/server';

import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { getUuid } from '@/shared/lib/hash';
import { and, eq } from 'drizzle-orm';

// POST /api/niche-loyalty/connect-store
// 仅保存自建 Shopify App 的关键信息，不主动改 ShipAny 结构
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const session = { user: authResult.user };

    const body = await req.json();
    const {
      shopifyDomain,
      adminAccessToken,
      webhookSecret,
      storeName,
    }: {
      shopifyDomain?: string;
      adminAccessToken?: string;
      webhookSecret?: string;
      storeName?: string;
    } = body || {};

    if (!shopifyDomain || !adminAccessToken || !webhookSecret) {
      return respErr('Missing required fields', 400);
    }

    const normalizedDomain = shopifyDomain.trim().toLowerCase();

    const storeId = getUuid();

    // 如果当前用户已绑定过该域名，则更新；否则插入
    const existing = await db()
      .select()
      .from(schema.loyaltyStore)
      .where(
        and(
          eq(schema.loyaltyStore.userId, session.user.id),
          eq(schema.loyaltyStore.shopifyDomain, normalizedDomain)
        )
      );

    if (existing.length > 0) {
      await db()
        .update(schema.loyaltyStore)
        .set({
          name: storeName ?? existing[0].name,
          shopifyAccessToken: adminAccessToken,
          shopifyWebhookSecret: webhookSecret,
          status: 'active',
        })
        .where(eq(schema.loyaltyStore.id, existing[0].id));

      return respData({
        id: existing[0].id,
        shopifyDomain: normalizedDomain,
        name: storeName ?? existing[0].name,
        status: 'active',
        updated: true,
      });
    }

    await db()
      .insert(schema.loyaltyStore)
      .values({
        id: storeId,
        userId: session.user.id,
        name: storeName,
        shopifyDomain: normalizedDomain,
        shopifyAccessToken: adminAccessToken,
        shopifyWebhookSecret: webhookSecret,
        status: 'active',
      });

    return respData({
      id: storeId,
      shopifyDomain: normalizedDomain,
      name: storeName,
      status: 'active',
      updated: false,
    });
  } catch (e) {
    console.error('connect-store error', e);
    return respErr('Failed to connect Shopify store');
  }
}






