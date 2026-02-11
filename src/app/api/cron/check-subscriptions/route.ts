/**
 * Cron Job: Check Expired Subscriptions
 * 定时任务：检查并处理过期订阅
 * 
 * 运行频率：每天一次
 * Vercel Cron: 0 0 * * * (每天午夜)
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkExpiredSubscriptions } from '@/shared/models/subscription';

export async function GET(req: NextRequest) {
  try {
    // 验证请求来源（Vercel Cron 或授权的请求）
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-cron-secret';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[CRON] Starting subscription expiration check...');

    // 检查并更新过期订阅
    const expiredCount = await checkExpiredSubscriptions();

    console.log(`[CRON] Processed ${expiredCount} expired subscriptions`);

    return NextResponse.json({
      success: true,
      message: `Processed ${expiredCount} expired subscriptions`,
      expiredCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[CRON] Error checking expired subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to check expired subscriptions' },
      { status: 500 }
    );
  }
}

// 也支持 POST 请求（用于手动触发）
export async function POST(req: NextRequest) {
  return GET(req);
}

