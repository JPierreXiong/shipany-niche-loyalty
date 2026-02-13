import { NextRequest } from 'next/server';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { eq, desc } from 'drizzle-orm';

// GET /api/niche-loyalty/dashboard/activity
// Get recent activity logs
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

    // Get recent redemptions
    const recentRedemptions = await db()
      .select({
        id: schema.loyaltyRedeemLog.id,
        redeemedAt: schema.loyaltyRedeemLog.redeemedAt,
        email: schema.loyaltyMember.email,
      })
      .from(schema.loyaltyRedeemLog)
      .innerJoin(
        schema.loyaltyDiscountCode,
        eq(schema.loyaltyRedeemLog.discountCodeId, schema.loyaltyDiscountCode.id)
      )
      .innerJoin(
        schema.loyaltyMember,
        eq(schema.loyaltyDiscountCode.memberId, schema.loyaltyMember.id)
      )
      .where(eq(schema.loyaltyRedeemLog.storeId, storeId))
      .orderBy(desc(schema.loyaltyRedeemLog.redeemedAt))
      .limit(10);

    const activities = recentRedemptions.map((r: any) => ({
      id: r.id,
      type: 'redemption',
      message: `${r.email} redeemed a discount code`,
      timestamp: r.redeemedAt.toISOString(),
    }));

    return respData(activities);
  } catch (e) {
    console.error('dashboard activity error', e);
    return respErr('Failed to get activity');
  }
}

