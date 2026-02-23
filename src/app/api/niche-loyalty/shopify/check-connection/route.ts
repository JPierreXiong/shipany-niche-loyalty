import { NextRequest } from 'next/server';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/niche-loyalty/shopify/check-connection
// Check if user has connected a Shopify store
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;

    // Check if user has any active stores
    const stores = await db()
      .select()
      .from(schema.loyaltyStore)
      .where(eq(schema.loyaltyStore.userId, user.id))
      .limit(1);

    return respData({
      connected: stores.length > 0,
      storeCount: stores.length,
      store: stores.length > 0 ? {
        id: stores[0].id,
        name: stores[0].name,
        domain: stores[0].shopifyDomain,
        status: stores[0].status,
      } : null,
    });
  } catch (e) {
    console.error('check connection error', e);
    return respErr('Failed to check connection');
  }
}




