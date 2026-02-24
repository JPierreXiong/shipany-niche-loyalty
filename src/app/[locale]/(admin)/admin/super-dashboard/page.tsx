/**
 * Super Admin Dashboard Page
 * 超级管理员仪表板页面
 */

import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getUserInfo } from '@/shared/models/user';
import {
  getAdminDashboardStats,
  getAllUsersDetail,
  getUserGrowthTrend,
  getRevenueTrend,
  isSuperAdmin,
} from '@/shared/models/admin-dashboard';
import { Header, Main, MainHeader } from '@/shared/blocks/dashboard';
import { Crumb } from '@/shared/types/blocks/common';

export default async function SuperAdminDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; plan?: string }>;
}) {
  const { locale } = await params;
  const { page = '1', plan } = await searchParams;
  
  setRequestLocale(locale);

  // 检查用户权限
  const user = await getUserInfo();
  if (!user || !isSuperAdmin(user.email)) {
    redirect(`/${locale}/no-permission`);
  }

  const t = await getTranslations('admin');

  const crumbs: Crumb[] = [
    { title: 'Admin', url: '/admin' },
    { title: 'Super Admin Dashboard', is_active: true },
  ];

  // 获取统计数据
  const stats = await getAdminDashboardStats();
  const { users, total } = await getAllUsersDetail(parseInt(page), 50, plan);
  const userGrowth = await getUserGrowthTrend();
  const revenueTrend = await getRevenueTrend();

  return (
    <>
      <Header crumbs={crumbs} />
      <Main>
        <MainHeader title="Super Admin Dashboard" />
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 用户统计 */}
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            subtitle={`${stats.newUsersThisMonth} new this month`}
            icon="👥"
          />
          
          <StatCard
            title="Active Users (30d)"
            value={stats.activeUsers}
            subtitle={`${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total`}
            icon="🔥"
          />
          
          <StatCard
            title="Monthly Revenue"
            value={`$${stats.monthlyRecurringRevenue.toFixed(2)}`}
            subtitle={`$${stats.totalRevenue.toFixed(2)} annual`}
            icon="💰"
          />
          
          <StatCard
            title="Total Members"
            value={stats.totalMembers}
            subtitle={`${stats.totalStores} stores`}
            icon="🎫"
          />
        </div>

        {/* 订阅分布 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Subscription Distribution</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">
                {stats.freeUsers}
              </div>
              <div className="text-sm text-gray-500">Free Plan</div>
              <div className="text-xs text-gray-400">
                {Math.round((stats.freeUsers / stats.totalUsers) * 100)}%
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats.baseUsers}
              </div>
              <div className="text-sm text-gray-500">Base Plan ($19.9)</div>
              <div className="text-xs text-gray-400">
                {Math.round((stats.baseUsers / stats.totalUsers) * 100)}%
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {stats.proUsers}
              </div>
              <div className="text-sm text-gray-500">Pro Plan ($59.9)</div>
              <div className="text-xs text-gray-400">
                {Math.round((stats.proUsers / stats.totalUsers) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Niche Loyalty 使用统计 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Niche Loyalty Usage</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <UsageStat label="Stores" value={stats.totalStores} />
            <UsageStat label="Members" value={stats.totalMembers} />
            <UsageStat label="Campaigns" value={stats.totalCampaigns} />
            <UsageStat label="Discount Codes" value={stats.totalDiscountCodes} />
          </div>
        </div>

        {/* 用户列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Users</h2>
            <div className="flex gap-2">
              <a
                href="?plan=free"
                className={`px-3 py-1 rounded ${plan === 'free' ? 'bg-gray-600 text-white' : 'bg-gray-200'}`}
              >
                Free
              </a>
              <a
                href="?plan=base"
                className={`px-3 py-1 rounded ${plan === 'base' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Base
              </a>
              <a
                href="?plan=pro"
                className={`px-3 py-1 rounded ${plan === 'pro' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
              >
                Pro
              </a>
              <a
                href="?"
                className={`px-3 py-1 rounded ${!plan ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
              >
                All
              </a>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Plan</th>
                  <th className="text-right p-2">Stores</th>
                  <th className="text-right p-2">Members</th>
                  <th className="text-right p-2">Campaigns</th>
                  <th className="text-right p-2">Total Spent</th>
                  <th className="text-left p-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          user.planType === 'pro'
                            ? 'bg-purple-100 text-purple-800'
                            : user.planType === 'base'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.planType.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-right p-2">{user.storeCount}</td>
                    <td className="text-right p-2">{user.memberCount}</td>
                    <td className="text-right p-2">{user.campaignCount}</td>
                    <td className="text-right p-2">${user.totalSpent.toFixed(2)}</td>
                    <td className="p-2 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 分页 */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {(parseInt(page) - 1) * 50 + 1} to {Math.min(parseInt(page) * 50, total)} of {total} users
            </div>
            <div className="flex gap-2">
              {parseInt(page) > 1 && (
                <a
                  href={`?page=${parseInt(page) - 1}${plan ? `&plan=${plan}` : ''}`}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Previous
                </a>
              )}
              {parseInt(page) * 50 < total && (
                <a
                  href={`?page=${parseInt(page) + 1}${plan ? `&plan=${plan}` : ''}`}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Next
                </a>
              )}
            </div>
          </div>
        </div>
      </Main>
    </>
  );
}

// 统计卡片组件
function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
}

// 使用统计组件
function UsageStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}















