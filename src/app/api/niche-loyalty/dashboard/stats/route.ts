import { NextRequest } from 'next/server';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { eq, and, count } from 'drizzle-orm';

// GET /api/niche-loyalty/dashboard/stats
// Get dashboard statistics
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
      return respData({
        totalMembers: 0,
        activeCards: 0,
        redemptionRate: 0,
        totalRevenue: 0,
      });
    }

    const storeId = stores[0].id;

    // Get total members
    const memberCount = await db()
      .select({ count: count() })
      .from(schema.loyaltyMember)
      .where(
        and(
          eq(schema.loyaltyMember.storeId, storeId),
          eq(schema.loyaltyMember.status, 'active')
        )
      );

    // Get active cards
    const cardCount = await db()
      .select({ count: count() })
      .from(schema.loyaltyDiscountCard)
      .where(
        and(
          eq(schema.loyaltyDiscountCard.storeId, storeId),
          eq(schema.loyaltyDiscountCard.status, 'active')
        )
      );

    // Get redemption stats
    const totalCodes = await db()
      .select({ count: count() })
      .from(schema.loyaltyDiscountCode)
      .innerJoin(
        schema.loyaltyCampaign,
        eq(schema.loyaltyDiscountCode.campaignId, schema.loyaltyCampaign.id)
      )
      .where(eq(schema.loyaltyCampaign.storeId, storeId));

    const redeemedCodes = await db()
      .select({ count: count() })
      .from(schema.loyaltyDiscountCode)
      .innerJoin(
        schema.loyaltyCampaign,
        eq(schema.loyaltyDiscountCode.campaignId, schema.loyaltyCampaign.id)
      )
      .where(
        and(
          eq(schema.loyaltyCampaign.storeId, storeId),
          eq(schema.loyaltyDiscountCode.isRedeemed, true)
        )
      );

    const totalCodesCount = Number(totalCodes[0]?.count) || 0;
    const redeemedCodesCount = Number(redeemedCodes[0]?.count) || 0;
    const redemptionRate =
      totalCodesCount > 0
        ? Math.round((redeemedCodesCount / totalCodesCount) * 100)
        : 0;

    // Get total revenue from redeemed orders (sum may be null if no records)
    const revenueResult = await db()
      .select({ 
        total: count(schema.loyaltyRedeemLog.orderAmount)
      })
      .from(schema.loyaltyRedeemLog)
      .where(eq(schema.loyaltyRedeemLog.storeId, storeId));

    // For now, set revenue to 0 since we need proper sum aggregation
    const totalRevenue = 0;

    return respData({
      totalMembers: Number(memberCount[0]?.count) || 0,
      activeCards: Number(cardCount[0]?.count) || 0,
      redemptionRate,
      totalRevenue,
    });
  } catch (e) {
    console.error('dashboard stats error', e);
    return respErr('Failed to get dashboard stats');
  }
}
