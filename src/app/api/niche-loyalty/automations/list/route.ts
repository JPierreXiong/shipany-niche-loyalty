import { NextRequest } from 'next/server';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { eq } from 'drizzle-orm';

// GET /api/niche-loyalty/automations/list
// List all automations for the user's store
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

    // Get all automations with card names
    const automations = await db()
      .select({
        id: schema.loyaltyAutomation.id,
        cardName: schema.loyaltyDiscountCard.name,
        triggerType: schema.loyaltyAutomation.triggerType,
        triggerValue: schema.loyaltyAutomation.triggerValue,
        isActive: schema.loyaltyAutomation.isActive,
        createdAt: schema.loyaltyAutomation.createdAt,
      })
      .from(schema.loyaltyAutomation)
      .innerJoin(
        schema.loyaltyDiscountCard,
        eq(schema.loyaltyAutomation.cardId, schema.loyaltyDiscountCard.id)
      )
      .where(eq(schema.loyaltyAutomation.storeId, storeId))
      .orderBy(schema.loyaltyAutomation.createdAt);

    return respData(
      automations.map((automation: any) => ({
        id: automation.id,
        cardName: automation.cardName,
        triggerType: automation.triggerType,
        triggerValue: automation.triggerValue,
        isActive: automation.isActive,
        createdAt: automation.createdAt.toISOString(),
      }))
    );
  } catch (e) {
    console.error('list automations error', e);
    return respErr('Failed to list automations');
  }
}


