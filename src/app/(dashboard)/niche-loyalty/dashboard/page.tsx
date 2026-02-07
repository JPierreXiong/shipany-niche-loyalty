/**
 * Niche Loyalty Dashboard - Artisan Theme
 * 设计理念: 数据可视化 + 实时预览 + 优雅交互
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  ShoppingBag, 
  Mail,
  Sparkles,
  Settings,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useNicheLoyaltyStore } from '@/shared/stores/niche-loyalty-store';
import { 
  StatsCardGrid, 
  MemberCard,
  MagicLinkFormInline,
} from '@/themes/artisan/components';
import { BrandConfigPanel } from '@/themes/artisan/components/BrandConfigPanel';

export default function NicheLoyaltyDashboard() {
  const { brandConfig, stats, members, setStats, setMembers, isLoading, setLoading } = useNicheLoyaltyStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'brand' | 'members' | 'campaigns'>('overview');

  // 模拟数据加载
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    
    // TODO: 替换为真实 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟数据
    setStats({
      totalMembers: 1250,
      activeMembers: 980,
      totalPoints: 45600,
      redemptionRate: 78,
      memberGrowth: 12,
      engagementRate: 94,
    });

    setMembers([
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        points: 240,
        joinedAt: '2025-12-01',
        lastActivity: '2025-02-05',
        tier: 'gold',
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael@example.com',
        points: 180,
        joinedAt: '2026-01-15',
        lastActivity: '2025-02-06',
        tier: 'silver',
      },
      {
        id: '3',
        name: 'Emma Wilson',
        email: 'emma@example.com',
        points: 420,
        joinedAt: '2025-11-20',
        lastActivity: '2025-02-04',
        tier: 'gold',
      },
    ]);

    setLoading(false);
  };

  return (
    <div className="theme-artisan min-h-screen bg-[#FDFCFB]">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-800 to-stone-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl artisan-heading">Niche Loyalty</h1>
                <p className="text-sm text-stone-500">{brandConfig.brandName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="artisan-button-secondary">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
              <button className="artisan-button-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Members
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-stone-200 bg-white">
        <div className="container">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'brand', label: 'Brand Setup' },
              { id: 'members', label: 'Members' },
              { id: 'campaigns', label: 'Campaigns' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-stone-800 text-stone-800 font-medium'
                    : 'border-transparent text-stone-500 hover:text-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Welcome Section */}
            <div className="artisan-glass-card p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl artisan-heading mb-2">
                    Welcome back! 👋
                  </h2>
                  <p className="text-stone-600 text-lg mb-6">
                    Your loyalty program is growing. Here's what's happening today.
                  </p>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button className="artisan-button-primary">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Campaign
                    </button>
                    <button className="artisan-button-secondary">
                      <Users className="w-4 h-4 mr-2" />
                      Import Members
                    </button>
                  </div>
                </div>

                {/* Mini Preview Card */}
                <div className="hidden lg:block">
                  <div className="scale-75 origin-top-right">
                    <MemberCard
                      brandColor={brandConfig.brandColor}
                      brandName={brandConfig.brandName}
                      logoUrl={brandConfig.logoUrl || undefined}
                      memberName="Preview"
                      points={100}
                      size="sm"
                      animated={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div>
              <h3 className="text-xl font-medium text-stone-800 mb-6">Key Metrics</h3>
              <StatsCardGrid
                columns={4}
                stats={[
                  {
                    label: 'Total Members',
                    value: stats.totalMembers,
                    icon: Users,
                    iconColor: '#8B9D83',
                    trend: 'up',
                    trendValue: `+${stats.memberGrowth}%`,
                    trendLabel: 'this month',
                  },
                  {
                    label: 'Active Members',
                    value: stats.activeMembers,
                    icon: TrendingUp,
                    iconColor: '#6B8E23',
                    trend: 'up',
                    trendValue: '+8%',
                    trendLabel: 'vs last month',
                  },
                  {
                    label: 'Engagement Rate',
                    value: `${stats.engagementRate}%`,
                    icon: Heart,
                    iconColor: '#C97064',
                    trend: 'up',
                    trendValue: '+5%',
                  },
                  {
                    label: 'Redemption Rate',
                    value: `${stats.redemptionRate}%`,
                    icon: ShoppingBag,
                    iconColor: '#D4A574',
                    trend: 'up',
                    trendValue: '+3%',
                  },
                ]}
              />
            </div>

            {/* Recent Members */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-stone-800">Recent Members</h3>
                <button className="text-sm text-stone-600 hover:text-stone-800 flex items-center">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {members.slice(0, 3).map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MemberCard
                      brandColor={brandConfig.brandColor}
                      brandName={brandConfig.brandName}
                      logoUrl={brandConfig.logoUrl || undefined}
                      memberName={member.name}
                      memberEmail={member.email}
                      memberSince={new Date(member.joinedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                      points={member.points}
                      nextRewardPoints={300}
                      size="md"
                      animated={true}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Growth Tip */}
            <div className="artisan-card p-6 bg-gradient-to-br from-stone-50 to-white">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-stone-800 mb-2">
                    💡 Growth Tip
                  </h4>
                  <p className="text-stone-600 mb-4">
                    Members who receive a welcome email within 24 hours are 3x more likely to make a repeat purchase. 
                    Set up your first campaign to boost engagement!
                  </p>
                  <button className="text-sm text-stone-800 font-medium hover:underline">
                    Create Welcome Campaign →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Brand Setup Tab */}
        {activeTab === 'brand' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl artisan-heading mb-2">Brand Setup</h2>
              <p className="text-stone-600 text-lg">
                Customize your loyalty program to match your brand identity
              </p>
            </div>

            <BrandConfigPanel />
          </motion.div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl artisan-heading mb-2">Members</h2>
                <p className="text-stone-600 text-lg">
                  Manage your loyalty program members
                </p>
              </div>
              <button className="artisan-button-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </button>
            </div>

            {/* Members List */}
            <div className="artisan-card p-6">
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 hover:bg-stone-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-stone-200 to-stone-100 flex items-center justify-center">
                        <span className="text-lg font-medium text-stone-600">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-stone-800">{member.name}</p>
                        <p className="text-sm text-stone-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-2xl font-light text-stone-800">{member.points}</p>
                        <p className="text-xs text-stone-500 uppercase">Points</p>
                      </div>
                      <span className={`artisan-badge ${
                        member.tier === 'gold' ? 'bg-amber-100 text-amber-700' :
                        member.tier === 'silver' ? 'bg-stone-100 text-stone-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {member.tier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl artisan-heading mb-2">Campaigns</h2>
                <p className="text-stone-600 text-lg">
                  Engage your members with targeted campaigns
                </p>
              </div>
              <button className="artisan-button-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </button>
            </div>

            {/* Empty State */}
            <div className="artisan-glass-card p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-xl font-medium text-stone-800 mb-2">
                No campaigns yet
              </h3>
              <p className="text-stone-600 mb-6 max-w-md mx-auto">
                Create your first campaign to start engaging with your members
              </p>
              <button className="artisan-button-primary">
                Create Your First Campaign
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}




