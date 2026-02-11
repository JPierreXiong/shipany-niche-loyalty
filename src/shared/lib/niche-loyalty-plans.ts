/**
 * Niche Loyalty Plan Limits and Features
 * 会员计划限制和功能配置
 */

export enum PlanType {
  FREE = 'free',
  BASE = 'base',
  PRO = 'pro',
}

export interface PlanLimits {
  maxMembers: number; // -1 表示无限制
  maxCampaigns: number;
  maxEmailsPerMonth: number;
  maxStores: number;
}

export interface PlanFeatures {
  // 基础功能
  basicMemberCard: boolean;
  walletIntegration: boolean;
  emailSupport: boolean;
  manualRewards: boolean;
  
  // 品牌定制
  glowBranding: boolean; // true = 显示Glow品牌
  customBranding: boolean;
  customColors: boolean;
  removeLogo: boolean;
  
  // 自动化功能
  autoDelivery: boolean;
  resendIntegration: boolean;
  
  // 支持级别
  supportResponseTime: string; // '48h' | '24h' | '4h'
  prioritySupport: boolean;
  dedicatedManager: boolean;
  vipConcierge: boolean;
  
  // 分析功能
  basicAnalytics: boolean;
  walletAddTracking: boolean;
  advancedAnalytics: boolean;
  advancedSegmentation: boolean;
  
  // 高级功能
  unlimitedBroadcasts: boolean;
  customDomain: boolean;
  whitelabelCSS: boolean;
  earlyAccess: boolean;
}

export interface Plan {
  type: PlanType;
  name: string;
  price: number; // USD per month
  limits: PlanLimits;
  features: PlanFeatures;
}

// 免费计划
export const FREE_PLAN: Plan = {
  type: PlanType.FREE,
  name: 'Free',
  price: 0,
  limits: {
    maxMembers: 50,
    maxCampaigns: 5,
    maxEmailsPerMonth: 100,
    maxStores: 1,
  },
  features: {
    basicMemberCard: true,
    walletIntegration: true,
    emailSupport: true,
    manualRewards: true,
    glowBranding: true, // 显示Glow品牌
    customBranding: false,
    customColors: false,
    removeLogo: false,
    autoDelivery: false,
    resendIntegration: false,
    supportResponseTime: '48h',
    prioritySupport: false,
    dedicatedManager: false,
    vipConcierge: false,
    basicAnalytics: false,
    walletAddTracking: false,
    advancedAnalytics: false,
    advancedSegmentation: false,
    unlimitedBroadcasts: false,
    customDomain: false,
    whitelabelCSS: false,
    earlyAccess: false,
  },
};

// Base计划 ($19.9/月)
export const BASE_PLAN: Plan = {
  type: PlanType.BASE,
  name: 'Base',
  price: 19.9,
  limits: {
    maxMembers: 250,
    maxCampaigns: 20,
    maxEmailsPerMonth: 1000,
    maxStores: 3,
  },
  features: {
    basicMemberCard: true,
    walletIntegration: true,
    emailSupport: true,
    manualRewards: true,
    glowBranding: false, // 可移除Glow品牌
    customBranding: true, // ✨ 完整品牌定制
    customColors: true,
    removeLogo: true,
    autoDelivery: true, // 自动数字化交付
    resendIntegration: true, // 邮件/短信
    supportResponseTime: '24h',
    prioritySupport: true,
    dedicatedManager: false,
    vipConcierge: false,
    basicAnalytics: true, // 基础分析仪表板
    walletAddTracking: true, // 追踪钱包添加率
    advancedAnalytics: false,
    advancedSegmentation: false,
    unlimitedBroadcasts: false,
    customDomain: false,
    whitelabelCSS: false,
    earlyAccess: false,
  },
};

// Pro计划 ($59.9/月)
export const PRO_PLAN: Plan = {
  type: PlanType.PRO,
  name: 'Pro',
  price: 59.9,
  limits: {
    maxMembers: -1, // 无限制
    maxCampaigns: -1, // 无限制
    maxEmailsPerMonth: -1, // 无限制
    maxStores: -1, // 无限制
  },
  features: {
    // 包含Base所有功能
    basicMemberCard: true,
    walletIntegration: true,
    emailSupport: true,
    manualRewards: true,
    glowBranding: false,
    customBranding: true,
    customColors: true,
    removeLogo: true,
    autoDelivery: true,
    resendIntegration: true,
    supportResponseTime: '4h',
    prioritySupport: true,
    dedicatedManager: true, // 1对1 专属成功经理
    vipConcierge: true, // VIP 礼宾设置
    basicAnalytics: true,
    walletAddTracking: true,
    advancedAnalytics: true, // 高级分析和洞察
    advancedSegmentation: true, // 高级会员细分
    unlimitedBroadcasts: true, // ✨ 无限 Glow 广播
    customDomain: true, // club.yourbrand.com
    whitelabelCSS: true, // 白标 CSS 定制
    earlyAccess: true, // 抢先体验新功能
  },
};

// 获取计划配置
export function getPlan(planType: PlanType): Plan {
  switch (planType) {
    case PlanType.FREE:
      return FREE_PLAN;
    case PlanType.BASE:
      return BASE_PLAN;
    case PlanType.PRO:
      return PRO_PLAN;
    default:
      return FREE_PLAN;
  }
}

// 检查功能是否可用
export function hasFeature(planType: PlanType, feature: keyof PlanFeatures): boolean {
  const plan = getPlan(planType);
  return plan.features[feature];
}

// 检查是否达到限制
export function checkLimit(
  planType: PlanType,
  limitType: keyof PlanLimits,
  currentValue: number
): { allowed: boolean; limit: number; current: number } {
  const plan = getPlan(planType);
  const limit = plan.limits[limitType];
  
  // -1 表示无限制
  if (limit === -1) {
    return { allowed: true, limit: -1, current: currentValue };
  }
  
  return {
    allowed: currentValue < limit,
    limit,
    current: currentValue,
  };
}

// 获取计划升级建议
export function getUpgradeSuggestion(planType: PlanType): Plan | null {
  switch (planType) {
    case PlanType.FREE:
      return BASE_PLAN;
    case PlanType.BASE:
      return PRO_PLAN;
    case PlanType.PRO:
      return null; // 已是最高计划
    default:
      return null;
  }
}

