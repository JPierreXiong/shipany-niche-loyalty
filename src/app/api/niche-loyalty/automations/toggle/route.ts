import { NextRequest } from 'next/server';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { eq, and } from 'drizzle-orm';

// POST /api/niche-loyalty/automations/toggle
// Toggle automation active status
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;

    const body = await req.json();
    const { id, isActive }: { id?: string; isActive?: boolean } = body || {};

    if (!id || typeof isActive !== 'boolean') {
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

    // Update automation
    await db()
      .update(schema.loyaltyAutomation)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.loyaltyAutomation.id, id),
          eq(schema.loyaltyAutomation.storeId, storeId)
        )
      );

    return respData({ success: true, isActive });
  } catch (e) {
    console.error('toggle automation error', e);
    return respErr('Failed to toggle automation');
  }
}

