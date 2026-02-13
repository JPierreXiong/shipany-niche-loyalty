import { NextRequest } from 'next/server';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// POST /api/niche-loyalty/shopify/verify
// Verify Shopify credentials and check permissions
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;

    const body = await req.json();
    const { shopDomain, accessToken }: { shopDomain?: string; accessToken?: string } = body || {};

    if (!shopDomain || !accessToken) {
      return respErr('Missing shop domain or access token', 400);
    }

    // Clean domain
    const cleanDomain = shopDomain.replace('https://', '').replace('http://', '');
    const fullDomain = cleanDomain.includes('.myshopify.com') 
      ? cleanDomain 
      : `${cleanDomain}.myshopify.com`;

    // Verify token by calling Shopify API
    const shopResponse = await fetch(`https://${fullDomain}/admin/api/2024-01/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });

    if (!shopResponse.ok) {
      return respErr('Invalid credentials. Please check your access token.', 401);
    }

    const shopData = await shopResponse.json();
    const shop = shopData.shop;

    // Get access scopes
    const scopesResponse = await fetch(`https://${fullDomain}/admin/oauth/access_scopes.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });

    let scopes: string[] = [];
    if (scopesResponse.ok) {
      const scopesData = await scopesResponse.json();
      scopes = scopesData.access_scopes?.map((s: any) => s.handle) || [];
    }

    // Check required scopes
    const requiredScopes = ['read_customers', 'read_orders', 'write_price_rules'];
    const missingScopes = requiredScopes.filter(scope => !scopes.includes(scope));

    if (missingScopes.length > 0) {
      return respErr(`Missing required permissions: ${missingScopes.join(', ')}`, 403);
    }

    // Encrypt access token
    const encryptionKey = crypto.randomBytes(32).toString('hex');
    const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
    let encryptedToken = cipher.update(accessToken, 'utf8', 'hex');
    encryptedToken += cipher.final('hex');

    // Generate webhook secret
    const webhookSecret = crypto.randomBytes(32).toString('hex');

    const now = new Date();

    // Check if store already exists
    const existingStores = await db()
      .select()
      .from(schema.loyaltyStore)
      .where(eq(schema.loyaltyStore.shopifyDomain, fullDomain))
      .limit(1);

    let storeId: string;

    if (existingStores.length > 0) {
      // Update existing store
      storeId = existingStores[0].id;
      await db()
        .update(schema.loyaltyStore)
        .set({
          userId: user.id,
          shopifyAccessToken: encryptedToken,
          shopifyWebhookSecret: webhookSecret,
          status: 'active',
          updatedAt: now,
        })
        .where(eq(schema.loyaltyStore.id, storeId));
    } else {
      // Create new store
      storeId = getUuid();
      await db().insert(schema.loyaltyStore).values({
        id: storeId,
        userId: user.id,
        name: shop.name || fullDomain.replace('.myshopify.com', ''),
        shopifyDomain: fullDomain,
        shopifyAccessToken: encryptedToken,
        shopifyWebhookSecret: webhookSecret,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      });
    }

    return respData({
      storeId,
      shopName: shop.name,
      shopDomain: fullDomain,
      scopes,
      encryptionKey,
    });
  } catch (e) {
    console.error('shopify verify error', e);
    return respErr('Failed to verify Shopify credentials');
  }
}
