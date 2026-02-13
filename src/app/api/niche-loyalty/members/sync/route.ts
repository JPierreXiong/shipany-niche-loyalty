import { NextRequest } from 'next/server';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { getUuid } from '@/shared/lib/hash';
import { eq, and } from 'drizzle-orm';
import { createShopifyService } from '@/shared/services/shopify';

// POST /api/niche-loyalty/members/sync
// Sync customers from Shopify
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;

    // Get user's store
    const stores = await db()
      .select()
      .from(schema.loyaltyStore)
      .where(eq(schema.loyaltyStore.userId, user.id))
      .limit(1);

    if (!stores.length) {
      return respErr('Store not found. Please connect your Shopify store first.', 404);
    }

    const store = stores[0];

    // Create Shopify service
    const shopify = createShopifyService(
      store.shopifyDomain,
      store.shopifyAccessToken
    );

    // Get customers from Shopify
    const customers = await shopify.getCustomers(250);

    let syncedCount = 0;
    const now = new Date();

    // Add each customer to loyalty program
    for (const customer of customers) {
      if (!customer.email) continue;

      // Check if customer already exists
      const existing = await db()
        .select()
        .from(schema.loyaltyMember)
        .where(
          and(
            eq(schema.loyaltyMember.storeId, store.id),
            eq(schema.loyaltyMember.email, customer.email.toLowerCase())
          )
        )
        .limit(1);

      if (existing.length > 0) {
        continue;
      }

      // Add new customer
      const memberId = getUuid();
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

      syncedCount++;
    }

    return respData({
      synced: syncedCount,
      total: customers.length,
      message: `Successfully synced ${syncedCount} new customers from Shopify`,
    });
  } catch (e) {
    console.error('sync members error', e);
    return respErr('Failed to sync members from Shopify');
  }
}

