import { NextRequest } from 'next/server';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { eq } from 'drizzle-orm';

// GET /api/niche-loyalty/cards/list
// List all discount cards for the user's store
export async function GET(req: NextRequest) {
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
      return respData([]);
    }

    const storeId = stores[0].id;

    // Get all cards
    const cards = await db()
      .select()
      .from(schema.loyaltyDiscountCard)
      .where(eq(schema.loyaltyDiscountCard.storeId, storeId))
      .orderBy(schema.loyaltyDiscountCard.createdAt);

    return respData(
      cards.map((card: any) => ({
        id: card.id,
        name: card.name,
        discountType: card.discountType,
        discountValue: card.discountValue,
        expireDays: card.expireDays,
        status: card.status,
        createdAt: card.createdAt.toISOString(),
      }))
    );
  } catch (e) {
    console.error('list cards error', e);
    return respErr('Failed to list cards');
  }
}

