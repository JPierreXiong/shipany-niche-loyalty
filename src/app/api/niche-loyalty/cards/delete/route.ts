import { NextRequest } from 'next/server';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { eq, and } from 'drizzle-orm';

// POST /api/niche-loyalty/cards/delete
// Delete a discount card
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;

    const body = await req.json();
    const { id }: { id?: string } = body || {};

    if (!id) {
      return respErr('Missing card ID', 400);
    }

    // Get user's store
    const stores = await db()
      .select()
      .from(schema.loyaltyStore)
      .where(eq(schema.loyaltyStore.userId, user.id))
      .limit(1);

    if (!stores.length) {
      return respErr('Store not found', 404);
    }

    const storeId = stores[0].id;

    // Verify card belongs to user's store
    const cards = await db()
      .select()
      .from(schema.loyaltyDiscountCard)
      .where(
        and(
          eq(schema.loyaltyDiscountCard.id, id),
          eq(schema.loyaltyDiscountCard.storeId, storeId)
        )
      )
      .limit(1);

    if (!cards.length) {
      return respErr('Card not found', 404);
    }

    // Delete card
    await db()
      .delete(schema.loyaltyDiscountCard)
      .where(eq(schema.loyaltyDiscountCard.id, id));

    return respData({ success: true });
  } catch (e) {
    console.error('delete card error', e);
    return respErr('Failed to delete card');
  }
}




