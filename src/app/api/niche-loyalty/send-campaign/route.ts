import { NextRequest } from 'next/server';

import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { getEmailService } from '@/shared/services/email';
import { and, eq } from 'drizzle-orm';

// POST /api/niche-loyalty/send-campaign
// 简化版：给选中的会员发送一次性折扣码邮件（Email 群发）
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const session = { user: authResult.user };

    const body = await req.json();
    const {
      storeId,
      campaignId,
      subject,
      html,
    }: {
      storeId?: string;
      campaignId?: string;
      subject?: string;
      html?: string;
    } = body || {};

    if (!storeId || !campaignId || !subject || !html) {
      return respErr('Missing required fields', 400);
    }

    // 校验店铺归属当前用户
    const store = await db()
      .select()
      .from(schema.loyaltyStore)
      .where(
        and(
          eq(schema.loyaltyStore.id, storeId),
          eq(schema.loyaltyStore.userId, session.user.id)
        )
      )
      .limit(1);

    if (!store.length) {
      return respErr('Store not found', 404);
    }

    // 查询当前活动下所有折扣码 + 会员
    const rows = await db()
      .select({
        email: schema.loyaltyMember.email,
        code: schema.loyaltyDiscountCode.code,
      })
      .from(schema.loyaltyDiscountCode)
      .innerJoin(
        schema.loyaltyMember,
        eq(schema.loyaltyMember.id, schema.loyaltyDiscountCode.memberId)
      )
      .where(eq(schema.loyaltyDiscountCode.campaignId, campaignId));

    if (!rows.length) {
      return respErr('No members for this campaign', 400);
    }

    const emailService = await getEmailService();

    const to = rows.map((r: { email: string; code: string }) => r.email);

    // 简化：一封群发邮件，不做个性化模板替换
    const result = await emailService.sendEmail({
      to,
      subject,
      html,
    });

    return respData({
      provider: result.provider,
      success: result.success,
      sent: to.length,
    });
  } catch (e) {
    console.error('send-campaign error', e);
    return respErr('Failed to send campaign emails');
  }
}






