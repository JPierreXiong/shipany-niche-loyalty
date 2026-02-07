import { NextRequest } from 'next/server';

import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { and, eq, like, count, sql } from 'drizzle-orm';

// GET /api/niche-loyalty/members/list
// 获取会员列表
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
    const status = searchParams.get('status') || 'active';
    const search = searchParams.get('search') || '';

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
    const conditions = [eq(schema.loyaltyMember.storeId, storeId)];

    if (status !== 'all') {
      conditions.push(eq(schema.loyaltyMember.status, status));
    }

    if (search) {
      conditions.push(
        sql`(${schema.loyaltyMember.email} ILIKE ${`%${search}%`} OR ${schema.loyaltyMember.name} ILIKE ${`%${search}%`})`
      );
    }

    // 查询总数
    const totalResult = await db()
      .select({ count: count() })
      .from(schema.loyaltyMember)
      .where(and(...conditions));

    const total = totalResult[0]?.count || 0;

    // 查询会员列表
    const members = await db()
      .select({
        id: schema.loyaltyMember.id,
        email: schema.loyaltyMember.email,
        name: schema.loyaltyMember.name,
        status: schema.loyaltyMember.status,
        source: schema.loyaltyMember.source,
        joinedAt: schema.loyaltyMember.joinedAt,
        lastActiveAt: schema.loyaltyMember.lastActiveAt,
      })
      .from(schema.loyaltyMember)
      .where(and(...conditions))
      .orderBy(sql`${schema.loyaltyMember.joinedAt} DESC`)
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    // 查询每个会员的活动和核销统计
    const memberIds = members.map((m: any) => m.id);
    const stats = await db()
      .select({
        memberId: schema.loyaltyDiscountCode.memberId,
        campaignCount: count(sql`DISTINCT ${schema.loyaltyDiscountCode.campaignId}`),
        redeemedCount: count(
          sql`CASE WHEN ${schema.loyaltyDiscountCode.isRedeemed} = true THEN 1 END`
        ),
      })
      .from(schema.loyaltyDiscountCode)
      .where(sql`${schema.loyaltyDiscountCode.memberId} IN (${sql.join(memberIds.map((id: string) => sql`${id}`), sql`, `)})`)
      .groupBy(schema.loyaltyDiscountCode.memberId);

    const statsMap = new Map(stats.map((s: any) => [s.memberId, s]));

    const membersWithStats = members.map((member: any) => {
      const memberStats = statsMap.get(member.id) as any;
      return {
        ...member,
        campaignCount: memberStats?.campaignCount || 0,
        redeemedCount: memberStats?.redeemedCount || 0,
      };
    });

    return respData({
      members: membersWithStats,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (e) {
    console.error('list members error', e);
    return respErr('Failed to list members');
  }
}



