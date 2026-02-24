import { NextRequest } from 'next/server';
import { requireAuth } from '@/shared/lib/api-auth';
import { respData, respErr } from '@/shared/lib/resp';

// POST /api/niche-loyalty/shopify/auth
// Initiate Shopify OAuth flow
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }
    const user = authResult.user;

    const body = await req.json();
    const { shopDomain }: { shopDomain?: string } = body || {};

    if (!shopDomain) {
      return respErr('Missing shop domain', 400);
    }

    // Validate shop domain format
    const cleanDomain = shopDomain.replace('.myshopify.com', '');
    const fullDomain = `${cleanDomain}.myshopify.com`;

    // Get Shopify app credentials from environment
    const clientId = process.env.SHOPIFY_API_KEY;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/niche-loyalty/shopify/callback`;
    const scopes = 'read_customers,write_discounts,read_orders';

    if (!clientId) {
      return respErr('Shopify app not configured', 500);
    }

    // Generate state for CSRF protection
    const state = Buffer.from(
      JSON.stringify({
        userId: user.id,
        timestamp: Date.now(),
      })
    ).toString('base64');

    // Build OAuth URL
    const authUrl = `https://${fullDomain}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

    return respData({
      authUrl,
      shopDomain: fullDomain,
    });
  } catch (e) {
    console.error('shopify auth error', e);
    return respErr('Failed to initiate Shopify auth');
  }
}











