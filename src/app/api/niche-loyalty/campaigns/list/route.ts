import { NextRequest } from 'next/server';

import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { and, eq, sql, count } from 'drizzle-orm';

// GET /api/niche-loyalty/campaigns/list
// 获取活动列表
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get('storeId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '20'), 100);
    const status = searchParams.get('status') || 'all';

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

    // 构建查询条件
    const conditions = [eq(schema.loyaltyCampaign.storeId, storeId)];

    if (status !== 'all') {
      conditions.push(eq(schema.loyaltyCampaign.status, status));
    }

    // 查询总数
    const totalResult = await db()
      .select({ count: count() })
      .from(schema.loyaltyCampaign)
      .where(and(...conditions));

    const total = totalResult[0]?.count || 0;

    // 查询活动列表
    const campaigns = await db()
      .select({
        id: schema.loyaltyCampaign.id,
        name: schema.loyaltyCampaign.name,
        subject: schema.loyaltyCampaign.subject,
        status: schema.loyaltyCampaign.status,
        discountType: schema.loyaltyCampaign.discountType,
        discountValue: schema.loyaltyCampaign.discountValue,
        sentAt: schema.loyaltyCampaign.sentAt,
        createdAt: schema.loyaltyCampaign.createdAt,
      })
      .from(schema.loyaltyCampaign)
      .where(and(...conditions))
      .orderBy(sql`${schema.loyaltyCampaign.createdAt} DESC`)
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    // 查询每个活动的统计数据
    const campaignIds = campaigns.map((c: any) => c.id);
    
    if (campaignIds.length === 0) {
      return respData({
        campaigns: [],
        pagination: {
          page,
          pageSize,
          total: 0,
          totalPages: 0,
        },
      });
    }

    const stats = await db()
      .select({
        campaignId: schema.loyaltyDiscountCode.campaignId,
        memberCount: count(),
        sentCount: count(schema.loyaltyDiscountCode.sentAt),
        redeemedCount: count(
          sql`CASE WHEN ${schema.loyaltyDiscountCode.isRedeemed} = true THEN 1 END`
        ),
      })
      .from(schema.loyaltyDiscountCode)
      .where(sql`${schema.loyaltyDiscountCode.campaignId} IN (${sql.join(campaignIds.map((id: string) => sql`${id}`), sql`, `)})`)
      .groupBy(schema.loyaltyDiscountCode.campaignId);

    const statsMap = new Map(stats.map((s: any) => [s.campaignId, s]));

    const campaignsWithStats = campaigns.map((campaign: any) => {
      const campaignStats = statsMap.get(campaign.id) as any;
      const memberCount = campaignStats?.memberCount || 0;
      const sentCount = campaignStats?.sentCount || 0;
      const redeemedCount = campaignStats?.redeemedCount || 0;
      const redemptionRate = sentCount > 0 ? Math.round((redeemedCount / sentCount) * 100) : 0;

      return {
        ...campaign,
        memberCount,
        sentCount,
        redeemedCount,
        redemptionRate,
      };
    });

    return respData({
      campaigns: campaignsWithStats,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (e) {
    console.error('list campaigns error', e);
    return respErr('Failed to list campaigns');
  }
}



