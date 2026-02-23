import { NextRequest } from 'next/server';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { respData, respErr } from '@/shared/lib/resp';
import { getUuid } from '@/shared/lib/hash';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

// POST /api/webhooks/shopify/orders-updated
// Handle order updates from Shopify (track discount code redemption)
export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature
    const hmac = req.headers.get('x-shopify-hmac-sha256');
    const shop = req.headers.get('x-shopify-shop-domain');
    
    if (!hmac || !shop) {
      return respErr('Missing webhook headers', 400);
    }

    const body = await req.text();
    const order = JSON.parse(body);

    // Get store from database
    const stores = await db()
      .select()
      .from(schema.loyaltyStore)
      .where(eq(schema.loyaltyStore.shopifyDomain, shop))
      .limit(1);

    if (!stores.length) {
      return respErr('Store not found', 404);
    }

    const store = stores[0];

    // Verify HMAC
    const hash = crypto
      .createHmac('sha256', store.shopifyWebhookSecret)
      .update(body, 'utf8')
      .digest('base64');

    if (hash !== hmac) {
      return respErr('Invalid webhook signature', 401);
    }

    // Check if order has discount codes
    const discountCodes = order.discount_codes || [];
    if (discountCodes.length === 0) {
      return respData({ message: 'No discount codes in order' });
    }

    const now = new Date();

    // Check each discount code
    for (const discountCode of discountCodes) {
      const code = discountCode.code;

      // Find matching discount code in our system
      const codes = await db()
        .select()
        .from(schema.loyaltyDiscountCode)
        .where(eq(schema.loyaltyDiscountCode.code, code))
        .limit(1);

      if (codes.length === 0) {
        continue;
      }

      const loyaltyCode = codes[0];

      // Update discount code as redeemed
      await db()
        .update(schema.loyaltyDiscountCode)
        .set({
          isRedeemed: true,
          orderId: order.id.toString(),
          orderName: order.name,
          redeemedAt: now,
          updatedAt: now,
        })
        .where(eq(schema.loyaltyDiscountCode.id, loyaltyCode.id));

      // Create redemption log (privacy-protected, no order details)
      const logId = getUuid();
      const orderAmount = parseFloat(order.total_price) * 100; // Convert to cents

      await db().insert(schema.loyaltyRedeemLog).values({
        id: logId,
        discountCodeId: loyaltyCode.id,
        storeId: store.id,
        shopifyOrderId: order.id.toString(),
        orderAmount: Math.round(orderAmount),
        redeemedAt: now,
        createdAt: now,
      });
    }

    return respData({ message: 'Discount codes tracked' });
  } catch (e) {
    console.error('orders-updated webhook error', e);
    return respErr('Failed to process webhook');
  }
}




