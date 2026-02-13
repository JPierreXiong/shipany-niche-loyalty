import { NextRequest } from 'next/server';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';
import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';
import { eq } from 'drizzle-orm';

// POST /api/niche-loyalty/shopify/register-webhooks
// Register Shopify webhooks for automation
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

    // Get store from database
    const stores = await db()
      .select()
      .from(schema.loyaltyStore)
      .where(eq(schema.loyaltyStore.shopifyDomain, fullDomain))
      .limit(1);

    if (!stores.length) {
      return respErr('Store not found. Please verify connection first.', 404);
    }

    const store = stores[0];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://glownicheloyalty.vercel.app';

    // Webhooks to register
    const webhooks = [
      {
        topic: 'customers/create',
        address: `${appUrl}/api/webhooks/shopify/customers-create`,
      },
      {
        topic: 'orders/paid',
        address: `${appUrl}/api/webhooks/shopify/orders-paid`,
      },
      {
        topic: 'orders/updated',
        address: `${appUrl}/api/webhooks/shopify/orders-updated`,
      },
    ];

    const registeredWebhooks = [];
    const errors = [];

    for (const webhook of webhooks) {
      try {
        const response = await fetch(
          `https://${fullDomain}/admin/api/2024-01/webhooks.json`,
          {
            method: 'POST',
            headers: {
              'X-Shopify-Access-Token': accessToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              webhook: {
                topic: webhook.topic,
                address: webhook.address,
                format: 'json',
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const webhookId = data.webhook.id;

          // Save webhook to database
          const webhookDbId = getUuid();
          await db().insert(schema.loyaltyWebhook).values({
            id: webhookDbId,
            storeId: store.id,
            topic: webhook.topic,
            webhookId: webhookId.toString(),
            status: 'active',
            createdAt: new Date(),
          });

          registeredWebhooks.push(webhook.topic);
        } else {
          const errorData = await response.json();
          errors.push({
            topic: webhook.topic,
            error: errorData.errors || 'Unknown error',
          });
        }
      } catch (error) {
        errors.push({
          topic: webhook.topic,
          error: 'Failed to register webhook',
        });
      }
    }

    // Update store webhook status
    await db()
      .update(schema.loyaltyStore)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(schema.loyaltyStore.id, store.id));

    return respData({
      registered: registeredWebhooks,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully registered ${registeredWebhooks.length} webhooks`,
    });
  } catch (e) {
    console.error('register webhooks error', e);
    return respErr('Failed to register webhooks');
  }
}
