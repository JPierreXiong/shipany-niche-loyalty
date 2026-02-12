import { NextRequest } from 'next/server';

import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { getAllLimits } from '@/shared/lib/niche-loyalty-plan-limits';
import { and, eq, count, sql } from 'drizzle-orm';

// GET /api/niche-loyalty/dashboard/stats
// 获取 Dashboard 统计数据
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return respErr('Missing storeId', 400);
    }

    // 验证店铺归属
    const stores = await db()
      .select()
      .from(schema.loyaltyStore)
      .where(
        and(
          eq(schema.loyaltyStore.id, storeId),
          eq(schema.loyaltyStore.userId, user.id)
        )
      )
      .limit(1);

    if (!stores.length) {
      return respErr('Store not found', 404);
    }

    const store = stores[0];

    // 查询会员统计
    const memberStats = await db()
      .select({
        total: count(),
        active: count(sql`CASE WHEN ${schema.loyaltyMember.status} = 'active' THEN 1 END`),
        inactive: count(sql`CASE WHEN ${schema.loyaltyMember.status} = 'inactive' THEN 1 END`),
      })
      .from(schema.loyaltyMember)
      .where(eq(schema.loyaltyMember.storeId, storeId));

    const memberCount = memberStats[0]?.total || 0;
    const activeMembers = memberStats[0]?.active || 0;
    const inactiveMembers = memberStats[0]?.inactive || 0;

    // 查询活动统计
    const campaignStats = await db()
      .select({
        total: count(),
        draft: count(sql`CASE WHEN ${schema.loyaltyCampaign.status} = 'draft' THEN 1 END`),
        sent: count(sql`CASE WHEN ${schema.loyaltyCampaign.status} = 'sent' THEN 1 END`),
      })
      .from(schema.loyaltyCampaign)
      .where(eq(schema.loyaltyCampaign.storeId, storeId));

    const campaignCount = campaignStats[0]?.total || 0;

    // 查询折扣码统计
    const codeStats = await db()
      .select({
        totalSent: count(schema.loyaltyDiscountCode.sentAt),
        totalRedeemed: count(
          sql`CASE WHEN ${schema.loyaltyDiscountCode.isRedeemed} = true THEN 1 END`
        ),
      })
      .from(schema.loyaltyDiscountCode)
      .innerJoin(
        schema.loyaltyCampaign,
        eq(schema.loyaltyCampaign.id, schema.loyaltyDiscountCode.campaignId)
      )
      .where(eq(schema.loyaltyCampaign.storeId, storeId));

    const totalCodesSent = codeStats[0]?.totalSent || 0;
    const totalCodesRedeemed = codeStats[0]?.totalRedeemed || 0;
    const overallRedemptionRate =
      totalCodesSent > 0 ? Math.round((totalCodesRedeemed / totalCodesSent) * 100) : 0;

    // 查询最近活动
    const recentCampaigns = await db()
      .select({
        id: schema.loyaltyCampaign.id,
        name: schema.loyaltyCampaign.name,
        sentAt: schema.loyaltyCampaign.sentAt,
        status: schema.loyaltyCampaign.status,
      })
      .from(schema.loyaltyCampaign)
      .where(eq(schema.loyaltyCampaign.storeId, storeId))
      .orderBy(sql`${schema.loyaltyCampaign.createdAt} DESC`)
      .limit(5);

    // 获取计划限制
    const limits = await getAllLimits(user.id, storeId);

    return respData({
      store: {
        id: store.id,
        name: store.name,
        status: store.status,
      },
      stats: {
        memberCount,
        campaignCount,
        totalCodesSent,
        totalCodesRedeemed,
        overallRedemptionRate,
        activeMembers,
        inactiveMembers,
      },
      recentCampaigns,
      plan: {
        type: user.planType || 'free',
        memberLimit: limits.members.limit,
        memberUsage: limits.members.current,
        campaignLimit: limits.campaigns.limit,
        campaignUsage: limits.campaigns.current,
        emailLimit: limits.emails.limit,
        emailUsage: limits.emails.current,
      },
    });
  } catch (e) {
    console.error('get dashboard stats error', e);
    return respErr('Failed to get dashboard stats');
  }
}





















