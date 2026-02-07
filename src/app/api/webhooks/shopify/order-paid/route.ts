import crypto from 'crypto';
import { NextRequest } from 'next/server';

import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { respData, respErr } from '@/shared/lib/resp';
import { eq, inArray } from 'drizzle-orm';

// Shopify Webhook: orders/paid
// 通过 X-Shopify-Hmac-Sha256 校验签名，只做折扣码核销
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256');
    const shopDomain = req.headers.get('x-shopify-shop-domain');

    if (!hmacHeader || !shopDomain) {
      return respErr('Missing Shopify headers', 400);
    }

    const normalizedDomain = shopDomain.trim().toLowerCase();

    // 根据店铺域名找到对应的 webhook secret
    const stores = await db()
      .select()
      .from(schema.loyaltyStore)
      .where(eq(schema.loyaltyStore.shopifyDomain, normalizedDomain));

    if (!stores.length) {
      return respErr('Store not registered for Niche Loyalty', 404);
    }

    const secret = stores[0].shopifyWebhookSecret;

    const generatedHmac = crypto
      .createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('base64');

    if (generatedHmac !== hmacHeader) {
      return respErr('Invalid signature', 401);
    }

    const payload = JSON.parse(rawBody);

    const discountCodes: string[] =
      payload.discount_codes?.map((d: any) => d.code).filter(Boolean) ?? [];

    if (!discountCodes.length) {
      return respData({ updated: 0 });
    }

    const orderId = String(payload.id ?? '');
    const orderName = String(payload.name ?? '');

    // 标记相关折扣码为已核销
    const now = new Date();

    await db()
      .update(schema.loyaltyDiscountCode)
      .set({
        isRedeemed: true,
        orderId,
        orderName,
        redeemedAt: now,
      })
      .where(inArray(schema.loyaltyDiscountCode.code, discountCodes));

    return respData({
      updatedCodes: discountCodes,
    });
  } catch (e) {
    console.error('shopify order-paid webhook error', e);
    return respErr('Internal error handling webhook');
  }
}






