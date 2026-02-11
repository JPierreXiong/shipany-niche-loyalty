import { NextRequest } from 'next/server';

import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { checkMemberLimit } from '@/shared/lib/niche-loyalty-plan-limits';
import { getUuid } from '@/shared/lib/hash';
import { and, eq } from 'drizzle-orm';

// POST /api/niche-loyalty/members/import
// 批量导入会员
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
      members,
    }: {
      storeId?: string;
      members?: Array<{ email: string; name?: string }>;
    } = body || {};

    if (!storeId || !members || !Array.isArray(members)) {
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

    // 检查会员数量限制
    const limitCheck = await checkMemberLimit(user.id, storeId, members.length);

    if (!limitCheck.allowed) {
      return respErr(
        `Member limit exceeded. Current: ${limitCheck.current}, Limit: ${limitCheck.limit}, Trying to add: ${members.length}`,
        429
      );
    }

    // 批量导入会员
    const imported: string[] = [];
    const skipped: string[] = [];
    const errors: Array<{ email: string; error: string }> = [];

    for (const member of members) {
      try {
        // 验证 email 格式
        if (!member.email || !isValidEmail(member.email)) {
          errors.push({ email: member.email || '', error: 'Invalid email format' });
          continue;
        }

        // 检查 email 是否已存在
        const existing = await db()
          .select()
          .from(schema.loyaltyMember)
          .where(
            and(
              eq(schema.loyaltyMember.storeId, storeId),
              eq(schema.loyaltyMember.email, member.email.toLowerCase())
            )
          )
          .limit(1);

        if (existing.length > 0) {
          skipped.push(member.email);
          continue;
        }

        // 插入新会员
        await db().insert(schema.loyaltyMember).values({
          id: getUuid(),
          storeId,
          email: member.email.toLowerCase(),
          name: member.name || null,
          source: 'import',
          status: 'active',
          joinedAt: new Date(),
        });

        imported.push(member.email);
      } catch (e) {
        errors.push({ email: member.email, error: String(e) });
      }
    }

    return respData({
      success: true,
      imported: imported.length,
      skipped: skipped.length,
      errors: errors.length,
      errorDetails: errors,
      details: {
        total: members.length,
        newMembers: imported.length,
        existingMembers: skipped.length,
      },
    });
  } catch (e) {
    console.error('import members error', e);
    return respErr('Failed to import members');
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

















