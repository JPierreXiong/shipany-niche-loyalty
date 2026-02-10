/**
 * Niche Loyalty 计划配置
 * 定义 Free、Base、Pro 三个计划的限制和功能
 */

export const NICHE_LOYALTY_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: {
      maxMembers: 50,
      maxCampaigns: 1,
      maxEmailsPerMonth: 50,
      emailSupport: false,
      analytics: false,
      advancedTargeting: false,
    },
    limits: {
      memberLimit: 50,
      campaignLimit: 1,
      emailLimit: 50,
    },
  },
  base: {
    name: 'Base',
    price: 19.9,
    currency: 'USD',
    interval: 'month',
    creemProductId: 'prod_5bo10kkVzObfuZIjUglgI0',
    features: {
      maxMembers: 50,
      maxCampaigns: 10,
      maxEmailsPerMonth: 500,
      emailSupport: true,
      analytics: true,
      advancedTargeting: false,
    },
    limits: {
      memberLimit: 50,
      campaignLimit: 10,
      emailLimit: 500,
    },
  },
  pro: {
    name: 'Pro',
    price: 59.9,
    currency: 'USD',
    interval: 'month',
    creemProductId: 'prod_1lQWMwrdWZFzo6AgpVcCc7',
    features: {
      maxMembers: 250,
      maxCampaigns: 100,
      maxEmailsPerMonth: 2500,
      emailSupport: true,
      analytics: true,
      advancedTargeting: true,
    },
    limits: {
      memberLimit: 250,
      campaignLimit: 100,
      emailLimit: 2500,
    },
  },
} as const;

export type PlanType = keyof typeof NICHE_LOYALTY_PLANS;

export type PlanConfig = typeof NICHE_LOYALTY_PLANS[PlanType];

/**
 * 获取计划配置
 */
export function getPlanConfig(planType: PlanType): PlanConfig {
  return NICHE_LOYALTY_PLANS[planType];
}

/**
 * 获取计划等级（用于比较）
 */
export function getPlanLevel(planType: PlanType): number {
  const levels: Record<PlanType, number> = {
    free: 0,
    base: 1,
    pro: 2,
  };
  return levels[planType];
}

/**
 * 检查是否可以访问某个功能
 */
export function canAccessFeature(
  currentPlan: PlanType,
  requiredPlan: PlanType
): boolean {
  return getPlanLevel(currentPlan) >= getPlanLevel(requiredPlan);
}














