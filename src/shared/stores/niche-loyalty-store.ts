/**
 * Niche Loyalty Store - Zustand State Management
 * 管理品牌配置、会员数据、活动数据的全局状态
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// 类型定义
// ============================================

export interface BrandConfig {
  brandName: string;
  brandColor: string;
  logoUrl: string | null;
  storeUrl: string;
  shopifyStoreId: string | null;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  points: number;
  joinedAt: string;
  lastActivity: string;
  tier: 'bronze' | 'silver' | 'gold';
}

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  status: 'draft' | 'scheduled' | 'sent';
  recipientCount: number;
  sentAt: string | null;
  openRate: number;
  clickRate: number;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  totalPoints: number;
  redemptionRate: number;
  memberGrowth: number;
  engagementRate: number;
}

// ============================================
// Store Interface
// ============================================

interface NicheLoyaltyStore {
  // 品牌配置
  brandConfig: BrandConfig;
  setBrandConfig: (config: Partial<BrandConfig>) => void;
  updateBrandColor: (color: string) => void;
  updateBrandName: (name: string) => void;
  updateLogoUrl: (url: string | null) => void;
  
  // 会员数据
  members: Member[];
  setMembers: (members: Member[]) => void;
  addMember: (member: Member) => void;
  removeMember: (id: string) => void;
  updateMemberPoints: (id: string, points: number) => void;
  
  // 活动数据
  campaigns: Campaign[];
  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
  
  // Dashboard 统计
  stats: DashboardStats;
  setStats: (stats: DashboardStats) => void;
  
  // UI 状态
  isPreviewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  selectedMemberId: string | null;
  setSelectedMemberId: (id: string | null) => void;
  
  // 加载状态
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // 重置
  reset: () => void;
}

// ============================================
// 初始状态
// ============================================

const initialBrandConfig: BrandConfig = {
  brandName: 'Your Brand',
  brandColor: '#1A1A1A',
  logoUrl: null,
  storeUrl: '',
  shopifyStoreId: null,
};

const initialStats: DashboardStats = {
  totalMembers: 0,
  activeMembers: 0,
  totalPoints: 0,
  redemptionRate: 0,
  memberGrowth: 0,
  engagementRate: 0,
};

// ============================================
// Zustand Store
// ============================================

export const useNicheLoyaltyStore = create<NicheLoyaltyStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      brandConfig: initialBrandConfig,
      members: [],
      campaigns: [],
      stats: initialStats,
      isPreviewMode: false,
      selectedMemberId: null,
      isLoading: false,

      // 品牌配置方法
      setBrandConfig: (config) =>
        set((state) => ({
          brandConfig: { ...state.brandConfig, ...config },
        })),

      updateBrandColor: (color) =>
        set((state) => ({
          brandConfig: { ...state.brandConfig, brandColor: color },
        })),

      updateBrandName: (name) =>
        set((state) => ({
          brandConfig: { ...state.brandConfig, brandName: name },
        })),

      updateLogoUrl: (url) =>
        set((state) => ({
          brandConfig: { ...state.brandConfig, logoUrl: url },
        })),

      // 会员数据方法
      setMembers: (members) => set({ members }),

      addMember: (member) =>
        set((state) => ({
          members: [...state.members, member],
        })),

      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        })),

      updateMemberPoints: (id, points) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, points } : m
          ),
        })),

      // 活动数据方法
      setCampaigns: (campaigns) => set({ campaigns }),

      addCampaign: (campaign) =>
        set((state) => ({
          campaigns: [...state.campaigns, campaign],
        })),

      // Dashboard 统计方法
      setStats: (stats) => set({ stats }),

      // UI 状态方法
      setPreviewMode: (mode) => set({ isPreviewMode: mode }),

      setSelectedMemberId: (id) => set({ selectedMemberId: id }),

      // 加载状态方法
      setLoading: (loading) => set({ isLoading: loading }),

      // 重置方法
      reset: () =>
        set({
          brandConfig: initialBrandConfig,
          members: [],
          campaigns: [],
          stats: initialStats,
          isPreviewMode: false,
          selectedMemberId: null,
          isLoading: false,
        }),
    }),
    {
      name: 'niche-loyalty-storage',
      partialize: (state) => ({
        brandConfig: state.brandConfig,
        // 不持久化会员和活动数据，这些应该从 API 获取
      }),
    }
  )
);

// ============================================
// Selectors (优化性能)
// ============================================

export const selectBrandConfig = (state: NicheLoyaltyStore) => state.brandConfig;
export const selectMembers = (state: NicheLoyaltyStore) => state.members;
export const selectCampaigns = (state: NicheLoyaltyStore) => state.campaigns;
export const selectStats = (state: NicheLoyaltyStore) => state.stats;
export const selectIsPreviewMode = (state: NicheLoyaltyStore) => state.isPreviewMode;

// ============================================
// Hooks (便捷使用)
// ============================================

export const useBrandConfig = () => useNicheLoyaltyStore(selectBrandConfig);
export const useMembers = () => useNicheLoyaltyStore(selectMembers);
export const useCampaigns = () => useNicheLoyaltyStore(selectCampaigns);
export const useStats = () => useNicheLoyaltyStore(selectStats);






