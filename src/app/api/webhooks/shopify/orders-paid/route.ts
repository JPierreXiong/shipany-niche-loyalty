import { NextRequest } from 'next/server';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { respData, respErr } from '@/shared/lib/resp';
import { getUuid } from '@/shared/lib/hash';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

// POST /api/webhooks/shopify/orders-paid
// Handle order payment completion from Shopify
// This is the core "Loop" - tracking discount code redemptions
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
      .createHmac('sha256', store.shopifyWebhookSecret || '')
      .update(body, 'utf8')
      .digest('base64');

    if (hash !== hmac) {
      return respErr('Invalid webhook signature', 401);
    }

    // THE CORE LOOP: Track discount code redemptions
    const discountCodes = order.discount_codes || order.discount_applications || [];
    const now = new Date();
    const orderAmount = Math.round(parseFloat(order.total_price || 0) * 100); // Convert to cents

    if (discountCodes.length === 0) {
      return respData({ message: 'No discount codes in order' });
    }

    // Process each discount code used in the order
    for (const discountItem of discountCodes) {
      const codeUsed = discountItem.code || discountItem.title;
      
      if (!codeUsed) continue;

      // Find member by discount code
      const members = await db()
        .select()
        .from(schema.loyaltyMember)
        .where(
          and(
            eq(schema.loyaltyMember.storeId, store.id),
            eq(schema.loyaltyMember.discountCode, codeUsed)
          )
        )
        .limit(1);

      if (members.length === 0) {
        console.log(`Discount code ${codeUsed} not found in loyalty members`);
        continue;
      }

      const member = members[0];

      // Check if already redeemed
      const existingLog = await db()
        .select()
        .from(schema.loyaltyRedeemLog)
        .where(
          and(
            eq(schema.loyaltyRedeemLog.storeId, store.id),
            eq(schema.loyaltyRedeemLog.shopifyOrderId, order.id.toString())
          )
        )
        .limit(1);

      if (existingLog.length > 0) {
        console.log(`Order ${order.id} already processed`);
        continue;
      }

      // Find the discount code record
      const discountCodeRecords = await db()
        .select()
        .from(schema.loyaltyDiscountCode)
        .where(
          and(
            eq(schema.loyaltyDiscountCode.memberId, member.id),
            eq(schema.loyaltyDiscountCode.code, codeUsed)
          )
        )
        .limit(1);

      // Record redemption in transaction
      await db().transaction(async (tx: any) => {
        // Update discount code as redeemed
        if (discountCodeRecords.length > 0) {
          await tx
            .update(schema.loyaltyDiscountCode)
            .set({
              isRedeemed: true,
              redeemedAt: now,
              updatedAt: now,
            })
            .where(eq(schema.loyaltyDiscountCode.id, discountCodeRecords[0].id));
        }

        // Create redemption log
        await tx.insert(schema.loyaltyRedeemLog).values({
          id: getUuid(),
          storeId: store.id,
          discountCodeId: discountCodeRecords.length > 0 ? discountCodeRecords[0].id : null,
          shopifyOrderId: order.id.toString(),
          orderAmount: orderAmount,
          redeemedAt: now,
          createdAt: now,
          updatedAt: now,
        });
      });

      console.log(`Successfully recorded redemption for code ${codeUsed}`);
    }

    return respData({ 
      message: 'Discount codes processed', 
      codesProcessed: discountCodes.length 
    });
  } catch (e) {
    console.error('orders-paid webhook error', e);
    return respErr('Failed to process webhook');
  }
}











