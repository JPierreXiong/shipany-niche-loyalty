import { NextRequest } from 'next/server';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { respErr } from '@/shared/lib/resp';
import { getUuid } from '@/shared/lib/hash';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// GET /api/niche-loyalty/shopify/callback
// Handle Shopify OAuth callback
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const shop = searchParams.get('shop');
    const state = searchParams.get('state');
    const hmac = searchParams.get('hmac');

    if (!code || !shop || !state) {
      return respErr('Missing required parameters', 400);
    }

    // Verify HMAC
    const clientSecret = process.env.SHOPIFY_API_SECRET;
    if (!clientSecret) {
      return respErr('Shopify app not configured', 500);
    }

    // Decode state to get user ID
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    const userId = stateData.userId;

    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.SHOPIFY_API_KEY,
          client_secret: clientSecret,
          code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      return respErr('Failed to get access token', 500);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Generate webhook secret
    const webhookSecret = crypto.randomBytes(32).toString('hex');

    // Save store to database
    const storeId = getUuid();
    const now = new Date();

    // Check if store already exists
    const existingStores = await db()
      .select()
      .from(schema.loyaltyStore)
      .where(eq(schema.loyaltyStore.shopifyDomain, shop))
      .limit(1);

    if (existingStores.length > 0) {
      // Update existing store
      await db()
        .update(schema.loyaltyStore)
        .set({
          userId,
          shopifyAccessToken: accessToken,
          shopifyWebhookSecret: webhookSecret,
          status: 'active',
          updatedAt: now,
        })
        .where(eq(schema.loyaltyStore.id, existingStores[0].id));
    } else {
      // Create new store
      await db().insert(schema.loyaltyStore).values({
        id: storeId,
        userId,
        name: shop.replace('.myshopify.com', ''),
        shopifyDomain: shop,
        shopifyAccessToken: accessToken,
        shopifyWebhookSecret: webhookSecret,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      });
    }

    // Install webhooks
    await installWebhooks(shop, accessToken);

    // Redirect to dashboard
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/niche-loyalty/dashboard?shopify=connected`
    );
  } catch (e) {
    console.error('shopify callback error', e);
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/niche-loyalty/dashboard?shopify=error`
    );
  }
}

async function installWebhooks(shop: string, accessToken: string) {
  const webhooks = [
    {
      topic: 'customers/create',
      address: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/shopify/customers-create`,
    },
    {
      topic: 'orders/paid',
      address: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/shopify/orders-paid`,
    },
    {
      topic: 'orders/updated',
      address: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/shopify/orders-updated`,
    },
  ];

  for (const webhook of webhooks) {
    try {
      await fetch(`https://${shop}/admin/api/2024-01/webhooks.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
        body: JSON.stringify({
          webhook: {
            topic: webhook.topic,
            address: webhook.address,
            format: 'json',
          },
        }),
      });
    } catch (error) {
      console.error(`Failed to install webhook ${webhook.topic}:`, error);
    }
  }
}


