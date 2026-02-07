/**
 * Niche Loyalty Config API - 品牌配置同步到 Neon 数据库
 * POST /api/niche-loyalty/config - 保存品牌配置
 * GET /api/niche-loyalty/config - 获取品牌配置
 */

import { NextResponse } from 'next/server';
import { db } from '@/core/db';
import { requireAuth } from '@/shared/lib/api-auth';

// 品牌配置接口
interface BrandConfig {
  brandName: string;
  brandColor: string;
  logoUrl: string | null;
  storeUrl: string;
  shopifyStoreId: string | null;
}

/**
 * GET - 获取品牌配置
 */
export async function GET() {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const userId = authResult.user.id;

    // TODO: 从数据库获取配置
    // 这里需要根据 ShipAny 的实际数据库结构调整
    // const config = await db.query.merchants.findFirst({
    //   where: eq(merchants.userId, userId),
    //   columns: { brandConfig: true }
    // });

    // 临时返回默认配置
    const defaultConfig: BrandConfig = {
      brandName: 'Your Brand',
      brandColor: '#1A1A1A',
      logoUrl: null,
      storeUrl: '',
      shopifyStoreId: null,
    };

    return NextResponse.json({
      success: true,
      data: defaultConfig,
    });
  } catch (error) {
    console.error('[NICHE_LOYALTY_CONFIG_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch config' },
      { status: 500 }
    );
  }
}

/**
 * POST - 保存品牌配置
 */
export async function POST(req: Request) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const userId = authResult.user.id;

    const { brandConfig } = await req.json();

    // 验证数据
    if (!brandConfig || typeof brandConfig !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid brand config' },
        { status: 400 }
      );
    }

    // TODO: 保存到数据库
    // 这里需要根据 ShipAny 的实际数据库结构调整
    // await db.update(merchants)
    //   .set({ brandConfig: brandConfig })
    //   .where(eq(merchants.userId, userId));

    console.log('[NICHE_LOYALTY_CONFIG_SAVE]', {
      userId,
      brandConfig,
    });

    return NextResponse.json({
      success: true,
      message: 'Aesthetic saved successfully ✨',
      data: brandConfig,
    });
  } catch (error) {
    console.error('[NICHE_LOYALTY_CONFIG_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save config' },
      { status: 500 }
    );
  }
}



