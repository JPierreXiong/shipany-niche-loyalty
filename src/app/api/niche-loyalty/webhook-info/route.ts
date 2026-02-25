import { NextRequest } from 'next/server';
import { requireAuth } from '@/shared/lib/api-auth';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { eq } from 'drizzle-orm';
import { respData, respErr } from '@/shared/lib/resp';

/**
 * GET /api/niche-loyalty/webhook-info
 * 获取当前用户的 Webhook URL 和连接状态
 */
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;

    // 查找用户的店铺配置
    const stores = await db()
      .select()
      .from(schema.loyaltyStore)
      .where(eq(schema.loyaltyStore.userId, user.id))
      .limit(1);

    if (!stores.length) {
      return respErr('Store not found. Please connect your Shopify store first.', 404);
    }

    const store = stores[0];

    // 生成 Webhook URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const webhookUrl = `${baseUrl}/api/webhooks/shopify/orders-paid`;

    return respData({
      webhookUrl,
      shopDomain: store.shopifyDomain || '',
      status: store.shopifyDomain ? 'active' : 'pending',
      webhookRegistered: store.webhookRegistered || false,
    });
  } catch (e) {
    console.error('Get webhook info error:', e);
    return respErr('Failed to get webhook info');
  }
}

