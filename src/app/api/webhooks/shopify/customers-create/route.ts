import { NextRequest } from 'next/server';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { respData, respErr } from '@/shared/lib/resp';
import { getUuid } from '@/shared/lib/hash';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

// POST /api/webhooks/shopify/customers-create
// Handle new customer creation from Shopify
export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature
    const hmac = req.headers.get('x-shopify-hmac-sha256');
    const shop = req.headers.get('x-shopify-shop-domain');
    
    if (!hmac || !shop) {
      return respErr('Missing webhook headers', 400);
    }

    const body = await req.text();
    const customer = JSON.parse(body);

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

    // Check if customer already exists
    const existingMembers = await db()
      .select()
      .from(schema.loyaltyMember)
      .where(
        and(
          eq(schema.loyaltyMember.storeId, store.id),
          eq(schema.loyaltyMember.email, customer.email.toLowerCase())
        )
      )
      .limit(1);

    if (existingMembers.length > 0) {
      return respData({ message: 'Customer already exists' });
    }

    // Add customer to loyalty program
    const memberId = getUuid();
    const now = new Date();

    await db().insert(schema.loyaltyMember).values({
      id: memberId,
      storeId: store.id,
      email: customer.email.toLowerCase(),
      name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || null,
      source: 'shopify_sync',
      status: 'active',
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // Check for automations triggered by customer creation
    const automations = await db()
      .select()
      .from(schema.loyaltyAutomation)
      .where(
        and(
          eq(schema.loyaltyAutomation.storeId, store.id),
          eq(schema.loyaltyAutomation.triggerType, 'customer_created'),
          eq(schema.loyaltyAutomation.isActive, true)
        )
      );

    // Create send tasks for each automation
    for (const automation of automations) {
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

    return respData({ message: 'Customer added to loyalty program' });
  } catch (e) {
    console.error('customers-create webhook error', e);
    return respErr('Failed to process webhook');
  }
}












