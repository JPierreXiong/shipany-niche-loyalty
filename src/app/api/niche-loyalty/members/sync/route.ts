import { NextRequest } from 'next/server';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { eq } from 'drizzle-orm';

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

    // TODO: Implement Shopify API customer sync
    // For now, return mock data
    return respData({
      synced: 0,
      message: 'Shopify sync will be implemented in Phase 4',
    });
  } catch (e) {
    console.error('sync members error', e);
    return respErr('Failed to sync members');
  }
}

