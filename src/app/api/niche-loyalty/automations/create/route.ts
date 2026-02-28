import { NextRequest } from 'next/server';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { getUuid } from '@/shared/lib/hash';
import { eq, and } from 'drizzle-orm';

// POST /api/niche-loyalty/automations/create
// Create a new automation rule
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;

    const body = await req.json();
    const {
      cardId,
      triggerType,
      triggerValue,
    }: {
      cardId?: string;
      triggerType?: string;
      triggerValue?: number | null;
    } = body || {};

    if (!cardId || !triggerType) {
      return respErr('Missing required fields', 400);
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
          eq(schema.loyaltyDiscountCard.id, cardId),
          eq(schema.loyaltyDiscountCard.storeId, storeId)
        )
      )
      .limit(1);

    if (!cards.length) {
      return respErr('Card not found', 404);
    }

    // Create automation
    const automationId = getUuid();
    const now = new Date();

    await db().insert(schema.loyaltyAutomation).values({
      id: automationId,
      cardId,
      storeId,
      triggerType,
      triggerValue: triggerValue || null,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return respData({
      id: automationId,
      cardId,
      triggerType,
      triggerValue,
      isActive: true,
      createdAt: now.toISOString(),
    });
  } catch (e) {
    console.error('create automation error', e);
    return respErr('Failed to create automation');
  }
}
















