import { NextRequest } from 'next/server';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { getUuid } from '@/shared/lib/hash';
import { eq, and } from 'drizzle-orm';

// POST /api/niche-loyalty/cards/create
// Create a new discount card
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;

    const body = await req.json();
    const {
      name,
      discountType,
      discountValue,
      expireDays,
    }: {
      name?: string;
      discountType?: string;
      discountValue?: number;
      expireDays?: number;
    } = body || {};

    if (!name || !discountType || !discountValue) {
      return respErr('Missing required fields', 400);
    }

    // Get user's store
    const stores = await db()
      .select()
      .from(schema.loyaltyStore)
      .where(eq(schema.loyaltyStore.userId, user.id))
      .limit(1);

    if (!stores.length) {
      return respErr('Store not found. Please connect your Shopify store first.', 404);
    }

    const storeId = stores[0].id;

    // Create card
    const cardId = getUuid();
    const now = new Date();

    await db().insert(schema.loyaltyDiscountCard).values({
      id: cardId,
      storeId,
      name,
      discountType,
      discountValue,
      expireDays: expireDays || 30,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    return respData({
      id: cardId,
      name,
      discountType,
      discountValue,
      expireDays: expireDays || 30,
      status: 'active',
      createdAt: now.toISOString(),
    });
  } catch (e) {
    console.error('create card error', e);
    return respErr('Failed to create card');
  }
}

