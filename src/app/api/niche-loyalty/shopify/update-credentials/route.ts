/**
 * Update Shopify Credentials API
 * POST /api/niche-loyalty/shopify/update-credentials
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/core/db';
import { loyaltyStore } from '@/config/db/schema';
import { eq } from 'drizzle-orm';
import { encrypt, generateEncryptionKey, maskSensitive } from '@/shared/utils/encryption';
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
    const { clientId, clientSecret } = body;

    // Validate input
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { success: false, message: 'Client ID and Client Secret are required' },
        { status: 400 }
      );
    }

    // Find user's store
    const stores = await db()
      .select()
      .from(loyaltyStore)
      .where(eq(loyaltyStore.userId, userId))
      .limit(1);

    if (stores.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No store found. Please connect your Shopify store first.' },
        { status: 404 }
      );
    }

    const store = stores[0];

    // Generate or reuse encryption key
    let encryptionKey = store.encryptionKey;
    if (!encryptionKey) {
      encryptionKey = generateEncryptionKey();
    }

    // Encrypt the client secret
    const encryptedSecret = encrypt(clientSecret, encryptionKey);

    // Log the operation (with masked data)
    console.log(`[Shopify Credentials] Updating for store: ${store.id}`);
    console.log(`[Shopify Credentials] Client ID: ${maskSensitive(clientId)}`);
    console.log(`[Shopify Credentials] Client Secret: ${maskSensitive(clientSecret)}`);

    // Update store with credentials
    await db()
      .update(loyaltyStore)
      .set({
        shopifyClientId: clientId,
        shopifyClientSecret: encryptedSecret,
        encryptionKey: encryptionKey,
        updatedAt: new Date(),
      })
      .where(eq(loyaltyStore.id, store.id));

    console.log(`[Shopify Credentials] Successfully updated for store: ${store.id}`);

    return NextResponse.json({
      success: true,
      message: 'Credentials updated successfully',
      data: {
        clientId: clientId,
        hasClientSecret: true,
      },
    });
  } catch (error) {
    console.error('Update credentials error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

