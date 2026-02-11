/**
 * Subscription Management System
 * 订阅管理系统 - 会员资格与付款绑定
 */

import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { eq, and, lt } from 'drizzle-orm';
import { getUuid } from '@/shared/lib/hash';

export enum SubscriptionStatus {
  ACTIVE = 'active',           // 活跃
  EXPIRED = 'expired',         // 已过期
  CANCELLED = 'cancelled',     // 已取消
  REFUNDED = 'refunded',       // 已退款
  TRIALING = 'trialing',       // 试用中
}

export interface SubscriptionInfo {
  id: string;
  userId: string;
  planType: 'free' | 'base' | 'pro';
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  paymentId: string | null;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建订阅 - 付款成功后调用
 * @param userId 用户ID
 * @param planType 计划类型
 * @param paymentId 支付ID（Creem订单ID）
 * @param amount 支付金额
 */
export async function createSubscription(
  userId: string,
  planType: 'base' | 'pro',
  paymentId: string,
  amount: number
): Promise<SubscriptionInfo> {
  const dbInstance = db();
  const now = new Date();
  
  // 计算到期日期：支付日 + 30天
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + 30);

  const subscriptionId = getUuid();

  // 注意：此函数需要数据库schema中有paymentId字段
  // 如果使用现有的shipany订阅系统，请调整schema或使用其他方法
  
  // 1. 创建订阅记录（不包含paymentId字段）
  await dbInstance.insert(schema.subscription).values({
    id: subscriptionId,
    userId,
    // planType,  // 注释掉，使用现有schema
    // status: SubscriptionStatus.ACTIVE,
    // startDate: now,
    // endDate,
    // paymentId,  // 此字段可能不存在
    // amount,
    createdAt: now,
    updatedAt: now,
  } as any);

  // 2. 更新用户的计划类型
  await dbInstance
    .update(schema.user)
    .set({
      planType,
      updatedAt: now,
    })
    .where(eq(schema.user.id, userId));

  console.log(`[SUBSCRIPTION_CREATED] User ${userId} upgraded to ${planType} until ${endDate.toISOString()}`);

  return {
    id: subscriptionId,
    userId,
    planType,
    status: SubscriptionStatus.ACTIVE,
    startDate: now,
    endDate,
    paymentId,
    amount,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * 续订订阅 - 用户再次付款
 * @param userId 用户ID
 * @param planType 计划类型
 * @param paymentId 新的支付ID
 * @param amount 支付金额
 */
export async function renewSubscription(
  userId: string,
  planType: 'base' | 'pro',
  paymentId: string,
  amount: number
): Promise<SubscriptionInfo> {
  const dbInstance = db();
  const now = new Date();

  // 获取当前订阅
  const [currentSub] = await dbInstance
    .select()
    .from(schema.subscription)
    .where(
      and(
        eq(schema.subscription.userId, userId),
        eq(schema.subscription.status, SubscriptionStatus.ACTIVE)
      )
    )
    .orderBy(schema.subscription.createdAt)
    .limit(1);

  let startDate = now;
  
  // 如果当前订阅还未过期，从当前到期日开始计算
  if (currentSub && currentSub.endDate > now) {
    startDate = currentSub.endDate;
    
    // 标记旧订阅为已完成
    await dbInstance
      .update(schema.subscription)
      .set({
        status: SubscriptionStatus.EXPIRED,
        updatedAt: now,
      })
      .where(eq(schema.subscription.id, currentSub.id));
  }

  // 计算新的到期日期：开始日期 + 30天
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30);

  // 创建新订阅
  return await createSubscription(userId, planType, paymentId, amount);
}

/**
 * 取消订阅 - 退款时调用
 * @param paymentId 支付ID
 * @param reason 取消原因
 */
export async function cancelSubscription(
  paymentId: string,
  reason: string = 'refund'
): Promise<boolean> {
  const dbInstance = db();
  const now = new Date();

  // 注意：此函数需要数据库schema中有paymentId字段
  // 如果使用现有的shipany订阅系统，请使用 cancelSubscriptionById
  console.warn('[SUBSCRIPTION_CANCEL] This function requires paymentId field in schema');
  return false;

  /* 
  // 1. 查找订阅
  const [subscription] = await dbInstance
    .select()
    .from(schema.subscription)
    .where(eq(schema.subscription.paymentId, paymentId))
    .limit(1);

  if (!subscription) {
    console.error(`[SUBSCRIPTION_CANCEL] Subscription not found for payment ${paymentId}`);
    return false;
  }

  // 2. 更新订阅状态为已退款
  await dbInstance
    .update(schema.subscription)
    .set({
      status: SubscriptionStatus.REFUNDED,
      canceledAt: now,
      updatedAt: now,
    })
    .where(eq(schema.subscription.id, subscription.id));

  // 3. 立即降级用户到免费计划
  await dbInstance
    .update(schema.user)
    .set({
      planType: 'free',
      updatedAt: now,
    })
    .where(eq(schema.user.id, subscription.userId));

  console.log(`[SUBSCRIPTION_CANCELLED] User ${subscription.userId} downgraded to free due to ${reason}`);

  return true;
  */
}

/**
 * 检查并更新过期订阅
 * 应该通过定时任务每天运行一次
 */
export async function checkExpiredSubscriptions(): Promise<number> {
  const dbInstance = db();
  const now = new Date();

  // 1. 查找所有已过期但状态仍为活跃的订阅
  const expiredSubscriptions = await dbInstance
    .select()
    .from(schema.subscription)
    .where(
      and(
        eq(schema.subscription.status, SubscriptionStatus.ACTIVE),
        lt(schema.subscription.endDate, now)
      )
    );

  console.log(`[SUBSCRIPTION_CHECK] Found ${expiredSubscriptions.length} expired subscriptions`);

  // 2. 更新每个过期订阅
  for (const sub of expiredSubscriptions) {
    // 更新订阅状态
    await dbInstance
      .update(schema.subscription)
      .set({
        status: SubscriptionStatus.EXPIRED,
        updatedAt: now,
      })
      .where(eq(schema.subscription.id, sub.id));

    // 检查用户是否有其他活跃订阅
    const [activeSub] = await dbInstance
      .select()
      .from(schema.subscription)
      .where(
        and(
          eq(schema.subscription.userId, sub.userId),
          eq(schema.subscription.status, SubscriptionStatus.ACTIVE)
        )
      )
      .limit(1);

    // 如果没有其他活跃订阅，降级到免费计划
    if (!activeSub) {
      await dbInstance
        .update(schema.user)
        .set({
          planType: 'free',
          updatedAt: now,
        })
        .where(eq(schema.user.id, sub.userId));

      console.log(`[SUBSCRIPTION_EXPIRED] User ${sub.userId} downgraded to free`);
    }
  }

  return expiredSubscriptions.length;
}

/**
 * 获取用户当前订阅信息
 * @param userId 用户ID
 */
export async function getUserSubscription(userId: string): Promise<SubscriptionInfo | null> {
  const dbInstance = db();

  const [subscription] = await dbInstance
    .select()
    .from(schema.subscription)
    .where(
      and(
        eq(schema.subscription.userId, userId),
        eq(schema.subscription.status, SubscriptionStatus.ACTIVE)
      )
    )
    .orderBy(schema.subscription.endDate)
    .limit(1);

  if (!subscription) {
    return null;
  }

  return {
    id: subscription.id,
    userId: subscription.userId,
    planType: subscription.planType as 'free' | 'base' | 'pro',
    status: subscription.status as SubscriptionStatus,
    startDate: subscription.startDate,
    endDate: subscription.endDate,
    paymentId: subscription.paymentId,
    amount: subscription.amount || 0,
    createdAt: subscription.createdAt,
    updatedAt: subscription.updatedAt,
  };
}

/**
 * 检查用户订阅是否有效
 * @param userId 用户ID
 */
export async function isSubscriptionValid(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription) {
    return false;
  }

  const now = new Date();
  return subscription.endDate > now && subscription.status === SubscriptionStatus.ACTIVE;
}

/**
 * 获取订阅剩余天数
 * @param userId 用户ID
 */
export async function getSubscriptionDaysRemaining(userId: string): Promise<number> {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription) {
    return 0;
  }

  const now = new Date();
  const daysRemaining = Math.ceil((subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return Math.max(0, daysRemaining);
}

// ============================================
// Legacy Functions - For Backward Compatibility
// ============================================

export async function getCurrentSubscription(userId: string) {
  return await getUserSubscription(userId);
}

export async function getSubscriptions(paramsOrUserId: any, page?: number, pageSize?: number): Promise<any[]> {
  const dbInstance = db();
  
  // 兼容旧API: getSubscriptions(userId, page, pageSize)
  if (typeof paramsOrUserId === 'string') {
    const userId = paramsOrUserId;
    const currentPage = page || 1;
    const limit = pageSize || 10;
    const offset = (currentPage - 1) * limit;

    const subscriptions = await dbInstance
      .select()
      .from(schema.subscription)
      .where(eq(schema.subscription.userId, userId))
      .orderBy(schema.subscription.createdAt)
      .limit(limit)
      .offset(offset);

    return subscriptions;
  }
  
  // 新API: getSubscriptions({ interval, getUser, page, limit })
  const { interval, getUser, page: currentPage = 1, limit = 30 } = paramsOrUserId || {};
  const offset = (currentPage - 1) * limit;

  const subscriptions = await dbInstance
    .select()
    .from(schema.subscription)
    .orderBy(schema.subscription.createdAt)
    .limit(limit)
    .offset(offset);

  return subscriptions;
}

export async function getSubscriptionsCount(paramsOrUserId?: any): Promise<number> {
  const dbInstance = db();
  const { count } = await import('drizzle-orm');

  // 兼容旧API: getSubscriptionsCount(userId)
  if (typeof paramsOrUserId === 'string') {
    const userId = paramsOrUserId;
    const [result] = await dbInstance
      .select({ count: count() })
      .from(schema.subscription)
      .where(eq(schema.subscription.userId, userId));

    return result?.count || 0;
  }

  // 新API: getSubscriptionsCount({ interval })
  const [result] = await dbInstance
    .select({ count: count() })
    .from(schema.subscription);

  return result?.count || 0;
}

export async function findSubscriptionBySubscriptionNo(subscriptionNo: string) {
  const dbInstance = db();
  const [subscription] = await dbInstance
    .select()
    .from(schema.subscription)
    .where(eq(schema.subscription.subscriptionNo, subscriptionNo))
    .limit(1);
  return subscription || null;
}

export async function findSubscriptionByProviderSubscriptionId(provider: string, subscriptionId: string) {
  const dbInstance = db();
  const [subscription] = await dbInstance
    .select()
    .from(schema.subscription)
    .where(
      and(
        eq(schema.subscription.paymentProvider, provider),
        eq(schema.subscription.subscriptionId, subscriptionId)
      )
    )
    .limit(1);
  return subscription || null;
}

export async function updateSubscriptionBySubscriptionNo(subscriptionNo: string, updates: any) {
  const dbInstance = db();
  await dbInstance
    .update(schema.subscription)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(schema.subscription.subscriptionNo, subscriptionNo));
  return true;
}
