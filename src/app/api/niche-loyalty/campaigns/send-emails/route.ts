/**
 * Send Campaign Emails API
 * POST /api/niche-loyalty/campaigns/send-emails
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/core/db';
import { loyaltyStore, loyaltyMember, loyaltyCampaign } from '@/config/db/schema';
import { eq, and, isNotNull } from 'drizzle-orm';
import { sendPassEmail } from '@/shared/services/email-service';
import { requireAuth } from '@/shared/lib/api-auth';

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
    const { campaignId } = body;

    if (!campaignId) {
      return NextResponse.json(
        { success: false, message: 'Campaign ID required' },
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
        { success: false, message: 'No store found' },
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

    // Get members with passes
    const members = await db()
      .select()
      .from(loyaltyMember)
      .where(
        and(
          eq(loyaltyMember.storeId, store.id),
          eq(loyaltyMember.status, 'active'),
          isNotNull(loyaltyMember.passUrl),
          isNotNull(loyaltyMember.discountCode)
        )
      );

    if (members.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No members with passes found' },
        { status: 404 }
      );
    }

    // Send emails
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const member of members) {
      try {
        const sent = await sendPassEmail({
          to: member.email,
          memberName: member.name || member.email.split('@')[0],
          discountCode: member.discountCode!,
          discountValue: campaign.discountValue,
          discountType: campaign.discountType as 'percentage' | 'fixed_amount',
          passUrl: member.passUrl!,
          brandName: store.name || 'Glow',
          brandColor: '#000000', // TODO: Get from brand config
        });

        if (sent) {
          results.success++;
        } else {
          results.failed++;
          results.errors.push(`Failed to send to ${member.email}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to send email to ${member.email}:`, error);
        results.failed++;
        results.errors.push(`${member.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Update campaign status
    await db()
      .update(loyaltyCampaign)
      .set({
        status: 'sent',
        sentAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(loyaltyCampaign.id, campaignId));

    return NextResponse.json({
      success: true,
      message: `Sent ${results.success} emails`,
      data: results,
    });
  } catch (error) {
    console.error('Send emails error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

