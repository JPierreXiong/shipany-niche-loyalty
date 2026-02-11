/**
 * Upstash QStash API Route
 * 使用QStash替代Vercel Cron，绕过Hobby计划限制
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import { checkExpiredSubscriptions } from '@/shared/models/subscription';

/**
 * QStash调用的订阅检查端点
 * 每天自动检查并更新过期订阅
 */
async function handler(req: NextRequest) {
  try {
    console.log('[QSTASH] Starting subscription check...');

    // 执行订阅检查
    const expiredCount = await checkExpiredSubscriptions();

    console.log(`[QSTASH] Subscription check completed. Expired: ${expiredCount}`);

    return NextResponse.json({
      success: true,
      message: 'Subscription check completed',
      expiredCount,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('[QSTASH] Subscription check failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Subscription check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// 使用QStash签名验证包装handler
export const POST = verifySignatureAppRouter(handler);

// 允许GET请求用于手动触发（仅开发环境）
export async function GET(req: NextRequest) {
  // 仅在开发环境允许手动触发
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Manual trigger only allowed in development' },
      { status: 403 }
    );
  }

  return handler(req);
}

