import { NextRequest } from 'next/server';

import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { and, eq, count, sql } from 'drizzle-orm';

// GET /api/niche-loyalty/campaigns/stats
// 获取活动统计
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId');

    if (!campaignId) {
      return respErr('Missing campaignId', 400);
    }

    // 查询活动信息
    const campaigns = await db()
      .select()
      .from(schema.loyaltyCampaign)
      .innerJoin(
        schema.loyaltyStore,
        eq(schema.loyaltyStore.id, schema.loyaltyCampaign.storeId)
      )
      .where(
        and(
          eq(schema.loyaltyCampaign.id, campaignId),
          eq(schema.loyaltyStore.userId, user.id)
        )
      )
      .limit(1);

    if (!campaigns.length) {
      return respErr('Campaign not found', 404);
    }

    const campaign = campaigns[0].loyalty_campaign;

    // 查询折扣码统计
    const codeStats = await db()
      .select({
        memberCount: count(),
        codesSent: count(schema.loyaltyDiscountCode.sentAt),
        codesRedeemed: count(
          sql`CASE WHEN ${schema.loyaltyDiscountCode.isRedeemed} = true THEN 1 END`
        ),
      })
      .from(schema.loyaltyDiscountCode)
      .where(eq(schema.loyaltyDiscountCode.campaignId, campaignId));

    const stats = codeStats[0];
    const memberCount = stats?.memberCount || 0;
    const codesSent = stats?.codesSent || 0;
    const codesRedeemed = stats?.codesRedeemed || 0;
    const redemptionRate = codesSent > 0 ? Math.round((codesRedeemed / codesSent) * 100) : 0;

    // 查询每日统计（最近7天）
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyStats = await db()
      .select({
        date: sql<string>`DATE(${schema.loyaltyDiscountCode.sentAt})`,
        sent: count(schema.loyaltyDiscountCode.sentAt),
        redeemed: count(
          sql`CASE WHEN ${schema.loyaltyDiscountCode.isRedeemed} = true THEN 1 END`
        ),
      })
      .from(schema.loyaltyDiscountCode)
      .where(
        and(
          eq(schema.loyaltyDiscountCode.campaignId, campaignId),
          sql`${schema.loyaltyDiscountCode.sentAt} >= ${sevenDaysAgo}`
        )
      )
      .groupBy(sql`DATE(${schema.loyaltyDiscountCode.sentAt})`)
      .orderBy(sql`DATE(${schema.loyaltyDiscountCode.sentAt}) ASC`);

    return respData({
      campaignId,
      name: campaign.name,
      status: campaign.status,
      stats: {
        memberCount,
        codesSent,
        codesRedeemed,
        redemptionRate,
        totalOrders: codesRedeemed, // 假设每个核销对应一个订单
      },
      timeline: dailyStats,
    });
  } catch (e) {
    console.error('get campaign stats error', e);
    return respErr('Failed to get campaign stats');
  }
}














