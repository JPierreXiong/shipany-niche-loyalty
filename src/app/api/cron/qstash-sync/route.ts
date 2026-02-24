/**
 * Upstash QStash Sync Endpoint
 * 用于处理每 6 小时的数据同步和营销活动任务
 * 
 * 运行频率：每 6 小时（通过 Upstash QStash 触发）
 * 功能：
 * - 同步 Shopify 订单数据
 * - 更新会员积分统计
 * - 触发定时营销活动
 * - 清理过期数据
 */

import { NextRequest, NextResponse } from 'next/server';
import { Receiver } from '@upstash/qstash';

// 初始化 Upstash QStash 签名校验器
const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    // 1. 获取签名和原始 Body
    const signature = req.headers.get('upstash-signature');
    const body = await req.text();

    if (!signature) {
      console.error('[QSTASH_SYNC] Missing signature');
      return new NextResponse('Unauthorized: Missing signature', { status: 401 });
    }

    // 2. 验证签名（核心安全逻辑）
    let isValid = false;
    try {
      await receiver.verify({
        signature,
        body,
      });
      isValid = true;
    } catch (error) {
      console.error('[QSTASH_SYNC] Signature verification failed:', error);
      isValid = false;
    }

    if (!isValid) {
      return new NextResponse('Unauthorized: Invalid signature', { status: 401 });
    }

    console.log('[QSTASH_SYNC] Signature verified successfully');

    // 3. 执行业务逻辑
    const results = {
      timestamp: new Date().toISOString(),
      tasks: [] as Array<{ name: string; status: string; message?: string }>,
    };

    // 任务 1: 同步 Shopify 订单（如果配置了 Shopify）
    try {
      await syncShopifyOrders();
      results.tasks.push({
        name: 'shopify_sync',
        status: 'success',
        message: 'Shopify orders synced successfully',
      });
    } catch (error: any) {
      console.error('[QSTASH_SYNC] Shopify sync failed:', error);
      results.tasks.push({
        name: 'shopify_sync',
        status: 'failed',
        message: error.message,
      });
    }

    // 任务 2: 更新会员积分统计
    try {
      await updateMemberStats();
      results.tasks.push({
        name: 'member_stats',
        status: 'success',
        message: 'Member statistics updated',
      });
    } catch (error: any) {
      console.error('[QSTASH_SYNC] Member stats update failed:', error);
      results.tasks.push({
        name: 'member_stats',
        status: 'failed',
        message: error.message,
      });
    }

    // 任务 3: 触发定时营销活动
    try {
      await triggerScheduledCampaigns();
      results.tasks.push({
        name: 'scheduled_campaigns',
        status: 'success',
        message: 'Scheduled campaigns triggered',
      });
    } catch (error: any) {
      console.error('[QSTASH_SYNC] Campaign trigger failed:', error);
      results.tasks.push({
        name: 'scheduled_campaigns',
        status: 'failed',
        message: error.message,
      });
    }

    // 任务 4: 清理过期数据
    try {
      await cleanupExpiredData();
      results.tasks.push({
        name: 'cleanup',
        status: 'success',
        message: 'Expired data cleaned up',
      });
    } catch (error: any) {
      console.error('[QSTASH_SYNC] Cleanup failed:', error);
      results.tasks.push({
        name: 'cleanup',
        status: 'failed',
        message: error.message,
      });
    }

    console.log('[QSTASH_SYNC] All tasks completed:', results);

    return NextResponse.json({
      success: true,
      message: 'Glow sync completed safely',
      results,
    });

  } catch (error: any) {
    console.error('[QSTASH_SYNC] Unexpected error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// 重要：由于我们需要读取原始 body 进行校验，不要使用自动解析
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // 最长执行 60 秒

// ============ 业务逻辑函数 ============

/**
 * 同步 Shopify 订单数据
 */
async function syncShopifyOrders() {
  // TODO: 实现 Shopify 订单同步逻辑
  // 1. 获取最近 6 小时的订单
  // 2. 更新会员积分
  // 3. 触发欢迎邮件（如果是新会员）
  
  console.log('[SHOPIFY_SYNC] Starting Shopify order sync...');
  
  // 示例：检查是否配置了 Shopify
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const shopifyToken = process.env.SHOPIFY_ACCESS_TOKEN;
  
  if (!shopifyDomain || !shopifyToken) {
    console.log('[SHOPIFY_SYNC] Shopify not configured, skipping...');
    return;
  }

  // 这里添加实际的 Shopify API 调用
  // const orders = await fetchShopifyOrders(shopifyDomain, shopifyToken);
  // await processOrders(orders);
  
  console.log('[SHOPIFY_SYNC] Shopify sync completed');
}

/**
 * 更新会员积分统计
 */
async function updateMemberStats() {
  // TODO: 实现会员统计更新逻辑
  // 1. 计算每个会员的总积分
  // 2. 更新会员等级
  // 3. 生成统计报表
  
  console.log('[MEMBER_STATS] Updating member statistics...');
  
  // 这里添加数据库查询和更新逻辑
  // const { db } = await import('@/core/db');
  // await db().update(members).set({ ... });
  
  console.log('[MEMBER_STATS] Member statistics updated');
}

/**
 * 触发定时营销活动
 */
async function triggerScheduledCampaigns() {
  // TODO: 实现定时营销活动触发逻辑
  // 1. 查询需要在当前时间段发送的活动
  // 2. 筛选目标会员
  // 3. 使用 Resend scheduled_at 安排发送
  
  console.log('[CAMPAIGNS] Checking for scheduled campaigns...');
  
  // 这里添加营销活动逻辑
  // const campaigns = await getScheduledCampaigns();
  // for (const campaign of campaigns) {
  //   await scheduleCampaignEmails(campaign);
  // }
  
  console.log('[CAMPAIGNS] Scheduled campaigns processed');
}

/**
 * 清理过期数据
 */
async function cleanupExpiredData() {
  // TODO: 实现数据清理逻辑
  // 1. 删除过期的临时数据
  // 2. 归档旧的邮件记录
  // 3. 清理失效的会员卡
  
  console.log('[CLEANUP] Starting data cleanup...');
  
  // 这里添加清理逻辑
  // const { db } = await import('@/core/db');
  // await db().delete(tempData).where(lt(tempData.expiresAt, new Date()));
  
  console.log('[CLEANUP] Data cleanup completed');
}




























