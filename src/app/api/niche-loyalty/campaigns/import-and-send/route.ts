/**
 * Batch Import Members and Send Passes API
 * POST /api/niche-loyalty/campaigns/import-and-send
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/core/db';
import { loyaltyStore, loyaltyMember, loyaltyCampaign } from '@/config/db/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { 
  generateDiscountCode, 
  generateAndUploadPass 
} from '@/shared/services/pass-service';
import { getPlanConfig } from '@/shared/config/niche-loyalty-plans';
import { requireAuth } from '@/shared/lib/api-auth';

interface ImportMemberData {
  email: string;
  name?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;
    const userId = user.id;
    const body = await request.json();
    const { campaignId, members } = body as {
      campaignId: string;
      members: ImportMemberData[];
    };

    // Validate input
    if (!campaignId || !members || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid input: campaignId and members array required' },
        { status: 400 }
      );
    }

    // Get user's store
    const stores = await db()
      .select()
      .from(loyaltyStore)
      .where(eq(loyaltyStore.userId, userId))
      .limit(1);

    if (stores.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No store found. Please connect your store first.' },
        { status: 404 }
      );
    }

    const store = stores[0];

    // Get campaign
    const campaigns = await db()
      .select()
      .from(loyaltyCampaign)
      .where(
        and(
          eq(loyaltyCampaign.id, campaignId),
          eq(loyaltyCampaign.storeId, store.id)
        )
      )
      .limit(1);

    if (campaigns.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Campaign not found' },
        { status: 404 }
      );
    }

    const campaign = campaigns[0];

    // Check plan limits
    const userPlan = (user as any).planType || 'free';
    const planConfig = getPlanConfig(userPlan);
    
    // Get current member count
    const existingMembers = await db()
      .select()
      .from(loyaltyMember)
      .where(eq(loyaltyMember.storeId, store.id));

    const newMemberCount = existingMembers.length + members.length;
    
    if (newMemberCount > planConfig.limits.memberLimit) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Plan limit exceeded. Your ${planConfig.name} plan allows up to ${planConfig.limits.memberLimit} members. Please upgrade.`,
          data: {
            currentCount: existingMembers.length,
            attemptedCount: members.length,
            limit: planConfig.limits.memberLimit,
          }
        },
        { status: 403 }
      );
    }

    // Process members in batches to avoid timeout
    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const memberData of members) {
      try {
        // Validate email
        if (!memberData.email || !memberData.email.includes('@')) {
          results.failed++;
          results.errors.push(`Invalid email: ${memberData.email}`);
          continue;
        }

        // Check if member already exists
        const existing = await db()
          .select()
          .from(loyaltyMember)
          .where(
            and(
              eq(loyaltyMember.storeId, store.id),
              eq(loyaltyMember.email, memberData.email)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          results.skipped++;
          continue;
        }

        // Generate discount code
        const discountCode = generateDiscountCode(campaign.name.substring(0, 6).toUpperCase());

        // Generate Apple Wallet pass
        const { passUrl } = await generateAndUploadPass({
          memberId: nanoid(),
          memberName: memberData.name || memberData.email.split('@')[0],
          email: memberData.email,
          discountCode,
          discountValue: campaign.discountValue,
          discountType: campaign.discountType as 'percentage' | 'fixed_amount',
          brandName: store.name || 'Glow',
          brandColor: '#000000', // TODO: Get from brand config
        });

        // Insert member
        await db().insert(loyaltyMember).values({
          id: nanoid(),
          storeId: store.id,
          email: memberData.email,
          name: memberData.name,
          discountCode,
          passUrl,
          source: 'import',
          status: 'active',
          joinedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        results.success++;
      } catch (error) {
        console.error(`Failed to process member ${memberData.email}:`, error);
        results.failed++;
        results.errors.push(`${memberData.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${members.length} members`,
      data: results,
    });
  } catch (error) {
    console.error('Import and send error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

