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
    const { 
      shopDomain, 
      clientId, 
      clientSecret, 
      accessToken, 
      webhookSecret 
    }: { 
      shopDomain?: string; 
      clientId?: string; 
      clientSecret?: string; 
      accessToken?: string; 
      webhookSecret?: string; 
    } = body || {};

    // 验证必填字段：clientId, clientSecret, accessToken, webhookSecret
    if (!clientId || !clientSecret || !accessToken || !webhookSecret) {
      return respErr('Missing required fields: clientId, clientSecret, accessToken, webhookSecret', 400);
    }

    // shopDomain 是可选的，但强烈建议提供以便验证
    let fullDomain = '';
    let shop: any = null;

    if (shopDomain && shopDomain.trim()) {
    // Clean domain
      const cleanDomain = shopDomain.replace('https://', '').replace('http://', '').trim();
      fullDomain = cleanDomain.includes('.myshopify.com') 
      ? cleanDomain 
      : `${cleanDomain}.myshopify.com`;

    // Verify token by calling Shopify API
      try {
    const shopResponse = await fetch(`https://${fullDomain}/admin/api/2024-01/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });

    if (!shopResponse.ok) {
          return respErr('Invalid credentials or shop domain. Please check your access token and domain.', 401);
    }

    const shopData = await shopResponse.json();
        shop = shopData.shop;
        
        // 使用从 API 返回的真实域名
        fullDomain = shop.myshopify_domain || shop.domain || fullDomain;
      } catch (error) {
        return respErr('Failed to connect to Shopify. Please check your shop domain and access token.', 500);
      }
    } else {
      // 如果没有提供 domain，使用一个默认值或生成一个临时标识
      // 注意：没有 domain 的情况下，某些 Shopify API 调用会失败
      fullDomain = `store-${user.id}.myshopify.com`; // 临时域名
      shop = {
        name: 'Shopify Store',
        myshopify_domain: fullDomain,
      };
    }

    // Get access scopes (只在有真实 domain 时调用)
    let scopes: string[] = [];
    if (shopDomain && shopDomain.trim()) {
    const scopesResponse = await fetch(`https://${fullDomain}/admin/oauth/access_scopes.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });

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
    }

    // Encrypt access token
    const encryptionKey = crypto.randomBytes(32).toString('hex');
    const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
    let encryptedToken = cipher.update(accessToken, 'utf8', 'hex');
    encryptedToken += cipher.final('hex');

    // Encrypt client secret
    const clientSecretCipher = crypto.createCipher('aes-256-cbc', encryptionKey);
    let encryptedClientSecret = clientSecretCipher.update(clientSecret, 'utf8', 'hex');
    encryptedClientSecret += clientSecretCipher.final('hex');

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
          shopifyClientId: clientId,
          shopifyClientSecret: encryptedClientSecret,
          shopifyAccessToken: encryptedToken,
          shopifyWebhookSecret: webhookSecret,
          encryptionKey: encryptionKey,
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
        shopifyClientId: clientId,
        shopifyClientSecret: encryptedClientSecret,
        shopifyAccessToken: encryptedToken,
        shopifyWebhookSecret: webhookSecret,
        encryptionKey: encryptionKey,
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
