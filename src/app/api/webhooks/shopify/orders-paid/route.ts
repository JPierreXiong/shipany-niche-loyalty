import { NextRequest } from 'next/server';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { respData, respErr } from '@/shared/lib/resp';
import { getUuid } from '@/shared/lib/hash';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

// POST /api/webhooks/shopify/orders-paid
// Handle order payment completion from Shopify
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

    const customerEmail = order.email || order.customer?.email;
    if (!customerEmail) {
      return respData({ message: 'No customer email in order' });
    }

    // Get or create customer
    let members = await db()
      .select()
      .from(schema.loyaltyMember)
      .where(
        and(
          eq(schema.loyaltyMember.storeId, store.id),
          eq(schema.loyaltyMember.email, customerEmail.toLowerCase())
        )
      )
      .limit(1);

    let memberId: string;
    const now = new Date();

    if (members.length === 0) {
      // Create new member
      memberId = getUuid();
      await db().insert(schema.loyaltyMember).values({
        id: memberId,
        storeId: store.id,
        email: customerEmail.toLowerCase(),
        name: order.customer
          ? `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim() || null
          : null,
        source: 'shopify_sync',
        status: 'active',
        joinedAt: now,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      memberId = members[0].id;
    }

    // Check for automations triggered by order payment
    const orderAmount = parseFloat(order.total_price) * 100; // Convert to cents

    const automations = await db()
      .select()
      .from(schema.loyaltyAutomation)
      .where(
        and(
          eq(schema.loyaltyAutomation.storeId, store.id),
          eq(schema.loyaltyAutomation.triggerType, 'order_paid'),
          eq(schema.loyaltyAutomation.isActive, true)
        )
      );

    // Create send tasks for matching automations
    for (const automation of automations) {
      // Check minimum order amount if specified
      if (automation.triggerValue && orderAmount < automation.triggerValue) {
        continue;
      }

      const taskId = getUuid();
      await db().insert(schema.loyaltySendTask).values({
        id: taskId,
        automationId: automation.id,
        customerId: memberId,
        storeId: store.id,
        status: 'pending',
        scheduledAt: now,
        createdAt: now,
        updatedAt: now,
      });
    }

    return respData({ message: 'Order processed for loyalty program' });
  } catch (e) {
    console.error('orders-paid webhook error', e);
    return respErr('Failed to process webhook');
  }
}

