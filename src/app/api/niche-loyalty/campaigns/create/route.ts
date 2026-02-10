import { NextRequest } from 'next/server';

import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { checkCampaignLimit, checkEmailLimit } from '@/shared/lib/niche-loyalty-plan-limits';
import { getUuid } from '@/shared/lib/hash';
import { and, eq, inArray } from 'drizzle-orm';
import crypto from 'crypto';

// POST /api/niche-loyalty/campaigns/create
// 创建营销活动
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
      name,
      subject,
      discountType,
      discountValue,
      memberIds,
    }: {
      storeId?: string;
      name?: string;
      subject?: string;
      discountType?: string;
      discountValue?: number;
      memberIds?: string[];
    } = body || {};

    if (!storeId || !name || !discountType || !discountValue || !memberIds || !memberIds.length) {
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

    // 检查活动数量限制
    const campaignLimitCheck = await checkCampaignLimit(user.id, storeId, 1);

    if (!campaignLimitCheck.allowed) {
      return respErr(
        `Campaign limit exceeded. Current: ${campaignLimitCheck.current}, Limit: ${campaignLimitCheck.limit}`,
        429
      );
    }

    // 检查邮件发送限制
    const emailLimitCheck = await checkEmailLimit(user.id, storeId, memberIds.length);

    if (!emailLimitCheck.allowed) {
      return respErr(
        `Email limit exceeded for this month. Current: ${emailLimitCheck.current}, Limit: ${emailLimitCheck.limit}, Trying to send: ${memberIds.length}`,
        429
      );
    }

    // 验证会员是否存在
    const members = await db()
      .select()
      .from(schema.loyaltyMember)
      .where(
        and(
          eq(schema.loyaltyMember.storeId, storeId),
          inArray(schema.loyaltyMember.id, memberIds)
        )
      );

    if (members.length !== memberIds.length) {
      return respErr('Some members not found', 404);
    }

    // 创建活动
    const campaignId = getUuid();
    const now = new Date();

    await db().insert(schema.loyaltyCampaign).values({
      id: campaignId,
      storeId,
      name,
      subject: subject || null,
      discountType: discountType || 'percentage',
      discountValue,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    });

    // 为每个会员生成唯一折扣码
    const codes: Array<{ memberId: string; code: string }> = [];
    for (const memberId of memberIds) {
      const code = await generateUniqueDiscountCode();
      await db().insert(schema.loyaltyDiscountCode).values({
        id: getUuid(),
        campaignId,
        memberId,
        code,
        isRedeemed: false,
        createdAt: now,
        updatedAt: now,
      });
      codes.push({ memberId, code });
    }

    return respData({
      id: campaignId,
      name,
      status: 'draft',
      memberCount: memberIds.length,
      codesGenerated: codes.length,
      codes,
      createdAt: now.toISOString(),
    });
  } catch (e) {
    console.error('create campaign error', e);
    return respErr('Failed to create campaign');
  }
}

/**
 * 生成唯一的折扣码
 */
async function generateUniqueDiscountCode(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const code = `NICHE-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // 检查是否已存在
    const existing = await db()
      .select()
      .from(schema.loyaltyDiscountCode)
      .where(eq(schema.loyaltyDiscountCode.code, code))
      .limit(1);

    if (!existing.length) {
      return code;
    }

    attempts++;
  }

  throw new Error('Failed to generate unique discount code');
}















