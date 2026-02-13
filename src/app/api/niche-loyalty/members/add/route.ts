import { NextRequest } from 'next/server';

import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { checkMemberLimit } from '@/shared/lib/niche-loyalty-plan-limits';
import { getUuid } from '@/shared/lib/hash';
import { and, eq } from 'drizzle-orm';

// POST /api/niche-loyalty/members/add
// 添加单个会员
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;

    const body = await req.json();
    const {
      storeId,
      email,
      name,
    }: {
      storeId?: string;
      email?: string;
      name?: string;
    } = body || {};

    if (!storeId || !email) {
      return respErr('Missing required fields', 400);
    }

    // 验证 email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return respErr('Invalid email format', 400);
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

    // 检查会员数量限制
    const limitCheck = await checkMemberLimit(user.id, storeId, 1);

    if (!limitCheck.allowed) {
      return respErr(
        `Member limit exceeded. Current: ${limitCheck.current}, Limit: ${limitCheck.limit}`,
        429
      );
    }

    // 检查 email 是否已存在
    const existing = await db()
      .select()
      .from(schema.loyaltyMember)
      .where(
        and(
          eq(schema.loyaltyMember.storeId, storeId),
          eq(schema.loyaltyMember.email, email.toLowerCase())
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return respErr('Member with this email already exists', 409);
    }

    // 插入新会员
    const memberId = getUuid();
    const now = new Date();

    await db().insert(schema.loyaltyMember).values({
      id: memberId,
      storeId,
      email: email.toLowerCase(),
      name: name || null,
      source: 'manual',
      status: 'active',
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    return respData({
      id: memberId,
      email: email.toLowerCase(),
      name: name || null,
      status: 'active',
      source: 'manual',
      joinedAt: now.toISOString(),
    });
  } catch (e) {
    console.error('add member error', e);
    return respErr('Failed to add member');
  }
}
























