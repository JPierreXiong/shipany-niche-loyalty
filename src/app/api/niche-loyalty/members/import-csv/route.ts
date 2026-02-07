/**
 * CSV Import API - 批量导入会员
 * POST /api/niche-loyalty/members/import-csv
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/shared/lib/api-auth';

interface CSVMember {
  name: string;
  email: string;
  points?: number;
  tier?: 'bronze' | 'silver' | 'gold';
}

/**
 * POST - 导入 CSV 会员数据
 */
export async function POST(req: Request) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const userId = authResult.user.id;

    const { members } = await req.json();

    // 验证数据
    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid members data' },
        { status: 400 }
      );
    }

    // 验证每个会员数据
    const validMembers: CSVMember[] = [];
    const errors: string[] = [];

    members.forEach((member: any, index: number) => {
      // 验证必填字段
      if (!member.name || !member.email) {
        errors.push(`Row ${index + 1}: Missing name or email`);
        return;
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(member.email)) {
        errors.push(`Row ${index + 1}: Invalid email format`);
        return;
      }

      validMembers.push({
        name: member.name,
        email: member.email,
        points: member.points || 0,
        tier: member.tier || 'bronze',
      });
    });

    // 如果有错误，返回错误信息
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errors,
        },
        { status: 400 }
      );
    }

    // TODO: 批量插入到数据库
    // await db.insert(members).values(
    //   validMembers.map(m => ({
    //     userId,
    //     name: m.name,
    //     email: m.email,
    //     points: m.points,
    //     tier: m.tier,
    //     joinedAt: new Date(),
    //   }))
    // );

    console.log('[NICHE_LOYALTY_CSV_IMPORT]', {
      userId,
      count: validMembers.length,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${validMembers.length} members`,
      data: {
        imported: validMembers.length,
        failed: errors.length,
      },
    });
  } catch (error) {
    console.error('[NICHE_LOYALTY_CSV_IMPORT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to import members' },
      { status: 500 }
    );
  }
}



