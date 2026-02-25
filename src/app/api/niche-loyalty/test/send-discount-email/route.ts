/**
 * Test Email Send API
 * POST /api/niche-loyalty/test/send-discount-email
 * Simplified API for testing discount email flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/shared/lib/api-auth';
import { db } from '@/core/db';
import { loyaltyStore, loyaltyMember } from '@/config/db/schema';
import { eq } from 'drizzle-orm';
import { sendPassEmail } from '@/shared/services/email-service';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;

    const body = await request.json();
    const { email, discountPercent } = body;

    if (!email || !discountPercent) {
      return NextResponse.json(
        { success: false, message: 'Email and discount percentage required' },
        { status: 400 }
      );
    }

    // Get or create store
    let stores = await db()
      .select()
      .from(loyaltyStore)
      .where(eq(loyaltyStore.userId, user.id))
      .limit(1);

    let store;
    if (stores.length === 0) {
      // Create a test store
      const newStore = await db()
        .insert(loyaltyStore)
        .values({
          id: nanoid(),
          userId: user.id,
          name: 'Test Store',
          shopifyDomain: 'test-store.myshopify.com',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      store = newStore[0];
    } else {
      store = stores[0];
    }

    // Generate discount code
    const discountCode = `LOYALTY${discountPercent}_${Date.now()}`;

    // Create or update member
    const existingMembers = await db()
      .select()
      .from(loyaltyMember)
      .where(eq(loyaltyMember.email, email))
      .limit(1);

    let member;
    if (existingMembers.length > 0) {
      // Update existing member
      const updated = await db()
        .update(loyaltyMember)
        .set({
          discountCode: discountCode,
          status: 'active',
          updatedAt: new Date(),
        })
        .where(eq(loyaltyMember.id, existingMembers[0].id))
        .returning();
      member = updated[0];
    } else {
      // Create new member
      const newMember = await db()
        .insert(loyaltyMember)
        .values({
          id: nanoid(),
          storeId: store.id,
          email: email,
          name: email.split('@')[0],
          discountCode: discountCode,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      member = newMember[0];
    }

    // Send email
    try {
      const sent = await sendPassEmail({
        to: email,
        memberName: member.name || email.split('@')[0],
        discountCode: discountCode,
        discountValue: discountPercent,
        discountType: 'percentage',
        passUrl: member.passUrl || '', // Optional
        brandName: store.name || 'Test Store',
        brandColor: '#667eea',
      });

      if (sent) {
        return NextResponse.json({
          success: true,
          message: 'Email sent successfully',
          data: {
            email: email,
            discountCode: discountCode,
            discountPercent: discountPercent,
            memberId: member.id,
            storeId: store.id,
          },
        });
      } else {
        return NextResponse.json(
          { success: false, message: 'Failed to send email' },
          { status: 500 }
        );
      }
    } catch (emailError) {
      console.error('Email send error:', emailError);
      return NextResponse.json(
        { 
          success: false, 
          message: `Email send failed: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`,
          data: {
            discountCode: discountCode,
            note: 'Discount code was created but email failed to send',
          }
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Test email API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    );
  }
}

