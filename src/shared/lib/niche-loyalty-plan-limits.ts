/**
 * Niche Loyalty 计划限制检查逻辑
 * 用于检查用户是否超出计划限制
 */

import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { eq, and, count, gte } from 'drizzle-orm';
import {
  NICHE_LOYALTY_PLANS,
  PlanType,
  PlanConfig,
} from '@/shared/config/niche-loyalty-plans';

/**
 * 限制检查结果
 */
export interface LimitCheckResult {
  allowed: boolean;
  current: number;
  limit: number;
  remaining: number;
  message?: string;
}

/**
 * 获取用户的计划类型
 */
export async function getUserPlanType(userId: string): Promise<PlanType> {
  const users = await db()
    .select()
    .from(schema.user)
    .where(eq(schema.user.id, userId))
    .limit(1);

  if (!users.length) {
    return 'free';
  }

  const planType = users[0].planType as PlanType | null;
  return planType || 'free';
}

/**
 * 获取用户的计划配置
 */
export async function getUserPlanConfig(userId: string): Promise<PlanConfig> {
  const planType = await getUserPlanType(userId);
  return NICHE_LOYALTY_PLANS[planType];
}

/**
 * 检查会员数量限制
 */
export async function checkMemberLimit(
  userId: string,
  storeId: string,
  additionalMembers: number = 1
): Promise<LimitCheckResult> {
  const plan = await getUserPlanConfig(userId);

  // 查询当前活跃会员数量
  const result = await db()
    .select({ count: count() })
    .from(schema.loyaltyMember)
    .where(
      and(
        eq(schema.loyaltyMember.storeId, storeId),
        eq(schema.loyaltyMember.status, 'active')
      )
    );

  const current = result[0]?.count || 0;
  const limit = plan.limits.memberLimit;
  const remaining = limit - current;
  const allowed = current + additionalMembers <= limit;

  return {
    allowed,
    current,
    limit,
    remaining,
    message: allowed
      ? undefined
      : `Member limit exceeded. Current: ${current}, Limit: ${limit}, Trying to add: ${additionalMembers}`,
  };
}

/**
 * 检查活动数量限制
 */
export async function checkCampaignLimit(
  userId: string,
  storeId: string,
  additionalCampaigns: number = 1
): Promise<LimitCheckResult> {
  const plan = await getUserPlanConfig(userId);

  // 查询当前活动数量（不包括已完成的）
  const result = await db()
    .select({ count: count() })
    .from(schema.loyaltyCampaign)
    .where(eq(schema.loyaltyCampaign.storeId, storeId));

  const current = result[0]?.count || 0;
  const limit = plan.limits.campaignLimit;
  const remaining = limit - current;
  const allowed = current + additionalCampaigns <= limit;

  return {
    allowed,
    current,
    limit,
    remaining,
    message: allowed
      ? undefined
      : `Campaign limit exceeded. Current: ${current}, Limit: ${limit}`,
  };
}

/**
 * 检查邮件发送限制（按月统计）
 */
export async function checkEmailLimit(
  userId: string,
  storeId: string,
  additionalEmails: number = 1
): Promise<LimitCheckResult> {
  const plan = await getUserPlanConfig(userId);

  // 获取本月第一天
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 查询本月发送的邮件数量
  const result = await db()
    .select({ count: count() })
    .from(schema.loyaltyDiscountCode)
    .innerJoin(
      schema.loyaltyCampaign,
      eq(schema.loyaltyCampaign.id, schema.loyaltyDiscountCode.campaignId)
    )
    .where(
      and(
        eq(schema.loyaltyCampaign.storeId, storeId),
        gte(schema.loyaltyDiscountCode.sentAt, firstDayOfMonth)
      )
    );

  const current = result[0]?.count || 0;
  const limit = plan.limits.emailLimit;
  const remaining = limit - current;
  const allowed = current + additionalEmails <= limit;

  return {
    allowed,
    current,
    limit,
    remaining,
    message: allowed
      ? undefined
      : `Email limit exceeded for this month. Current: ${current}, Limit: ${limit}, Trying to send: ${additionalEmails}`,
  };
}

/**
 * 检查功能是否可用
 */
export async function checkFeatureAccess(
  userId: string,
  feature: keyof typeof NICHE_LOYALTY_PLANS.free.features
): Promise<boolean> {
  const plan = await getUserPlanConfig(userId);
  return plan.features[feature] as boolean;
}

/**
 * 获取所有限制状态（用于 Dashboard）
 */
export async function getAllLimits(userId: string, storeId: string) {
  const [memberLimit, campaignLimit, emailLimit] = await Promise.all([
    checkMemberLimit(userId, storeId, 0),
    checkCampaignLimit(userId, storeId, 0),
    checkEmailLimit(userId, storeId, 0),
  ]);

  return {
    members: memberLimit,
    campaigns: campaignLimit,
    emails: emailLimit,
  };
}























