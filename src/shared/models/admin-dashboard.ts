/**
 * Super Admin Dashboard - 超级管理员仪表板
 * 用于查看所有账号的汇总情况
 */

import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { eq, sql, and, gte, count } from 'drizzle-orm';

export interface AdminDashboardStats {
  // 用户统计
  totalUsers: number;
  activeUsers: number; // 最近30天活跃
  newUsersThisMonth: number;
  
  // 订阅统计
  freeUsers: number;
  baseUsers: number;
  proUsers: number;
  totalRevenue: number; // 总收入
  monthlyRecurringRevenue: number; // MRR
  
  // Niche Loyalty 使用统计
  totalStores: number;
  totalMembers: number;
  totalCampaigns: number;
  totalDiscountCodes: number;
  totalEmailsSent: number;
  
  // 系统健康
  databaseSize: string;
  apiCallsToday: number;
  errorRate: number;
}

export interface UserDetail {
  id: string;
  email: string;
  name: string;
  planType: string;
  createdAt: Date;
  lastSeenAt: Date | null;
  
  // Niche Loyalty 数据
  storeCount: number;
  memberCount: number;
  campaignCount: number;
  emailsSent: number;
  
  // 订阅信息
  subscriptionStatus: string | null;
  subscriptionStartDate: Date | null;
  subscriptionEndDate: Date | null;
  totalSpent: number;
}

/**
 * 获取管理员仪表板统计数据
 */
export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const dbInstance = db();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. 用户统计
  const [totalUsersResult] = await dbInstance
    .select({ count: count() })
    .from(schema.user);
  
  const [activeUsersResult] = await dbInstance
    .select({ count: count() })
    .from(schema.user)
    .where(gte(schema.user.updatedAt, thirtyDaysAgo));
  
  const [newUsersResult] = await dbInstance
    .select({ count: count() })
    .from(schema.user)
    .where(gte(schema.user.createdAt, firstDayOfMonth));

  // 2. 订阅统计
  const [freeUsersResult] = await dbInstance
    .select({ count: count() })
    .from(schema.user)
    .where(eq(schema.user.planType, 'free'));
  
  const [baseUsersResult] = await dbInstance
    .select({ count: count() })
    .from(schema.user)
    .where(eq(schema.user.planType, 'base'));
  
  const [proUsersResult] = await dbInstance
    .select({ count: count() })
    .from(schema.user)
    .where(eq(schema.user.planType, 'pro'));

  // 3. Niche Loyalty 统计
  const [totalStoresResult] = await dbInstance
    .select({ count: count() })
    .from(schema.loyaltyStore);
  
  const [totalMembersResult] = await dbInstance
    .select({ count: count() })
    .from(schema.loyaltyMember);
  
  const [totalCampaignsResult] = await dbInstance
    .select({ count: count() })
    .from(schema.loyaltyCampaign);
  
  const [totalCodesResult] = await dbInstance
    .select({ count: count() })
    .from(schema.loyaltyDiscountCode);

  // 计算收入 (Base: $19.9, Pro: $59.9)
  const baseCount = baseUsersResult?.count || 0;
  const proCount = proUsersResult?.count || 0;
  const monthlyRecurringRevenue = (baseCount * 19.9) + (proCount * 59.9);

  return {
    totalUsers: totalUsersResult?.count || 0,
    activeUsers: activeUsersResult?.count || 0,
    newUsersThisMonth: newUsersResult?.count || 0,
    
    freeUsers: freeUsersResult?.count || 0,
    baseUsers: baseCount,
    proUsers: proCount,
    totalRevenue: monthlyRecurringRevenue * 12, // 年收入估算
    monthlyRecurringRevenue,
    
    totalStores: totalStoresResult?.count || 0,
    totalMembers: totalMembersResult?.count || 0,
    totalCampaigns: totalCampaignsResult?.count || 0,
    totalDiscountCodes: totalCodesResult?.count || 0,
    totalEmailsSent: 0, // TODO: 需要添加邮件发送记录表
    
    databaseSize: 'N/A', // TODO: 查询数据库大小
    apiCallsToday: 0, // TODO: 需要添加API调用日志
    errorRate: 0, // TODO: 需要添加错误日志
  };
}

/**
 * 获取所有用户详细列表
 */
export async function getAllUsersDetail(
  page: number = 1,
  pageSize: number = 50,
  planFilter?: string
): Promise<{ users: UserDetail[]; total: number }> {
  const dbInstance = db();
  const offset = (page - 1) * pageSize;

  // 构建查询条件
  const conditions = planFilter 
    ? [eq(schema.user.planType, planFilter)]
    : [];

  // 获取用户列表
  const users = await dbInstance
    .select({
      id: schema.user.id,
      email: schema.user.email,
      name: schema.user.name,
      planType: schema.user.planType,
      createdAt: schema.user.createdAt,
      updatedAt: schema.user.updatedAt,
    })
    .from(schema.user)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(pageSize)
    .offset(offset)
    .orderBy(schema.user.createdAt);

  // 获取总数
  const [totalResult] = await dbInstance
    .select({ count: count() })
    .from(schema.user)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  // 为每个用户获取详细统计
  const usersDetail: UserDetail[] = await Promise.all(
    users.map(async (user) => {
      // 获取店铺数量
      const [storeCount] = await dbInstance
        .select({ count: count() })
        .from(schema.loyaltyStore)
        .where(eq(schema.loyaltyStore.userId, user.id));

      // 获取会员数量
      const [memberCount] = await dbInstance
        .select({ count: count() })
        .from(schema.loyaltyMember)
        .innerJoin(
          schema.loyaltyStore,
          eq(schema.loyaltyMember.storeId, schema.loyaltyStore.id)
        )
        .where(eq(schema.loyaltyStore.userId, user.id));

      // 获取活动数量
      const [campaignCount] = await dbInstance
        .select({ count: count() })
        .from(schema.loyaltyCampaign)
        .innerJoin(
          schema.loyaltyStore,
          eq(schema.loyaltyCampaign.storeId, schema.loyaltyStore.id)
        )
        .where(eq(schema.loyaltyStore.userId, user.id));

      // 获取订阅信息
      const [subscription] = await dbInstance
        .select()
        .from(schema.subscription)
        .where(eq(schema.subscription.userId, user.id))
        .orderBy(schema.subscription.createdAt)
        .limit(1);

      return {
        id: user.id,
        email: user.email,
        name: user.name || 'N/A',
        planType: user.planType || 'free',
        createdAt: user.createdAt,
        lastSeenAt: user.updatedAt,
        
        storeCount: storeCount?.count || 0,
        memberCount: memberCount?.count || 0,
        campaignCount: campaignCount?.count || 0,
        emailsSent: 0, // TODO: 添加邮件发送统计
        
        subscriptionStatus: subscription?.status || null,
        subscriptionStartDate: subscription?.createdAt || null,
        subscriptionEndDate: subscription?.canceledAt || null,
        totalSpent: calculateTotalSpent(user.planType, subscription?.createdAt),
      };
    })
  );

  return {
    users: usersDetail,
    total: totalResult?.count || 0,
  };
}

/**
 * 计算用户总消费
 */
function calculateTotalSpent(planType: string, startDate: Date | null): number {
  if (!startDate || planType === 'free') return 0;
  
  const now = new Date();
  const monthsSubscribed = Math.floor(
    (now.getTime() - startDate.getTime()) / (30 * 24 * 60 * 60 * 1000)
  );
  
  const monthlyPrice = planType === 'pro' ? 59.9 : planType === 'base' ? 19.9 : 0;
  return monthsSubscribed * monthlyPrice;
}

/**
 * 获取用户增长趋势（最近12个月）
 */
export async function getUserGrowthTrend(): Promise<Array<{ month: string; count: number }>> {
  const dbInstance = db();
  const now = new Date();
  const trends: Array<{ month: string; count: number }> = [];

  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    const [result] = await dbInstance
      .select({ count: count() })
      .from(schema.user)
      .where(
        and(
          gte(schema.user.createdAt, monthStart),
          gte(monthEnd, schema.user.createdAt)
        )
      );

    trends.push({
      month: monthStart.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      count: result?.count || 0,
    });
  }

  return trends;
}

/**
 * 获取收入趋势（最近12个月）
 */
export async function getRevenueTrend(): Promise<Array<{ month: string; revenue: number }>> {
  const dbInstance = db();
  const now = new Date();
  const trends: Array<{ month: string; revenue: number }> = [];

  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    // 获取该月的付费用户数
    const [baseUsers] = await dbInstance
      .select({ count: count() })
      .from(schema.user)
      .where(
        and(
          eq(schema.user.planType, 'base'),
          gte(schema.user.createdAt, monthStart),
          gte(monthEnd, schema.user.createdAt)
        )
      );
    
    const [proUsers] = await dbInstance
      .select({ count: count() })
      .from(schema.user)
      .where(
        and(
          eq(schema.user.planType, 'pro'),
          gte(schema.user.createdAt, monthStart),
          gte(monthEnd, schema.user.createdAt)
        )
      );

    const revenue = ((baseUsers?.count || 0) * 19.9) + ((proUsers?.count || 0) * 59.9);

    trends.push({
      month: monthStart.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      revenue,
    });
  }

  return trends;
}

/**
 * 检查是否为超级管理员
 */
export function isSuperAdmin(email: string): boolean {
  const superAdmins = [
    'xiongjp_fr@163.com',
    // 可以添加更多管理员邮箱
  ];
  
  return superAdmins.includes(email.toLowerCase());
}

