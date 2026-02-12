import { NextRequest } from 'next/server';

import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { and, eq } from 'drizzle-orm';

// DELETE /api/niche-loyalty/members/remove
// 删除会员
export async function DELETE(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;

    const body = await req.json();
    const {
      storeId,
      memberId,
    }: {
      storeId?: string;
      memberId?: string;
    } = body || {};

    if (!storeId || !memberId) {
      return respErr('Missing required fields', 400);
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

    // 检查会员是否存在
    const members = await db()
      .select()
      .from(schema.loyaltyMember)
      .where(
        and(
          eq(schema.loyaltyMember.id, memberId),
          eq(schema.loyaltyMember.storeId, storeId)
        )
      )
      .limit(1);

    if (!members.length) {
      return respErr('Member not found', 404);
    }

    // 软删除：更新状态为 inactive
    await db()
      .update(schema.loyaltyMember)
      .set({
        status: 'inactive',
        updatedAt: new Date(),
      })
      .where(eq(schema.loyaltyMember.id, memberId));

    return respData({
      success: true,
      message: 'Member removed successfully',
    });
  } catch (e) {
    console.error('remove member error', e);
    return respErr('Failed to remove member');
  }
}




















