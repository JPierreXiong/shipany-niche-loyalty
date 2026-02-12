/**
 * Super Admin API - Get Dashboard Stats
 * GET /api/admin/super/stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/shared/lib/api-auth';
import { isSuperAdmin, getAdminDashboardStats } from '@/shared/models/admin-dashboard';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;

    // 检查是否为超级管理员
    if (!isSuperAdmin(user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized - Super admin access required' },
        { status: 403 }
      );
    }

    // 获取统计数据
    const stats = await getAdminDashboardStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('[SUPER_ADMIN_STATS]', error);
    return NextResponse.json(
      { error: 'Failed to get admin stats' },
      { status: 500 }
    );
  }
}


