/**
 * Connect Shopify Store Page
 * Step-by-step guide for Custom App setup
 */

'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { 
  Store, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Shield,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

export default function ConnectShopifyPage() {
  const [formData, setFormData] = useState({
    shopDomain: '',
    clientId: '',
    clientSecret: '',
    accessToken: '',
    webhookSecret: '',
  });
  const [verifying, setVerifying] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);

  const requiredScopes = [
    { name: 'read_customers', description: 'To know who to send the loyalty card to' },
    { name: 'read_orders', description: 'To trigger rewards automatically after a purchase' },
    { name: 'write_price_rules', description: 'To generate unique discount codes for your customers' },
  ];

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  }

  async function handleVerify() {
    // 验证必填字段
    if (!formData.clientId || !formData.clientSecret || !formData.accessToken || !formData.webhookSecret) {
      toast.error('Please fill in all required fields: Client ID, Client Secret, Access Token, and Webhook Secret');
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch('/api/niche-loyalty/shopify/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setPermissions(data.data.scopes || []);
        
        const missingScopes = requiredScopes.filter(
          scope => !data.data.scopes.includes(scope.name)
        );

        if (missingScopes.length > 0) {
          toast.error(`Missing permissions: ${missingScopes.map(s => s.name).join(', ')}`);
        } else {
          toast.success('Connection verified! Registering webhooks...');
          await registerWebhooks();
        }
      } else {
        toast.error('Invalid credentials. Please check and try again.');
      }
    } catch (error) {
      toast.error('Connection failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  }

  async function registerWebhooks() {
    try {
      const response = await fetch('/api/niche-loyalty/shopify/register-webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Webhooks registered successfully!');
        setTimeout(() => {
          window.location.href = '/niche-loyalty/dashboard?connected=true';
        }, 1500);
      }
    } catch (error) {
      toast.warning('Webhooks registration failed. You can retry later in Settings.');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="h-20" />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Store className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="mt-6 text-4xl font-bold text-gray-900">
            Connect Your Shopify Store
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            The 2-Minute Setup. No App Store review required.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Bank-level encryption</span>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-8">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create a Custom App in Shopify
                </h2>
                <p className="mt-2 text-gray-600">
                  Open your Shopify Admin and follow the path
                </p>

                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <p className="font-mono text-sm text-gray-700">
                    Settings → Apps and sales channels → Develop apps
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://admin.shopify.com/settings/apps/development', '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Shopify Admin
                  </Button>
                </div>

                <div className="mt-6">
                  <Label>App Name</Label>
                  <div className="mt-2 flex gap-2">
                    <Input value="Glow Loyalty" readOnly className="flex-1" />
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard('Glow Loyalty', 'App name')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  Configure Admin API Scopes (Critical!)
                </h2>
                <p className="mt-2 text-gray-600">
                  Click &quot;Configure Admin API scopes&quot; and check EXACTLY these 3 permissions
                </p>

                <div className="mt-6 space-y-4">
                  {requiredScopes.map((scope) => (
                    <div
                      key={scope.name}
                      className="flex items-start gap-3 rounded-lg border border-gray-200 p-4"
                    >
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                      <div>
                        <p className="font-mono text-sm font-semibold text-gray-900">
                          {scope.name}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {scope.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-900">
                    <strong>💡 Pro Tip:</strong> Use the search bar in Shopify to find these quickly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  Install & Get Your Token
                </h2>
                <p className="mt-2 text-gray-600">
                  Follow these steps to get your Admin API Access Token
                </p>

                <ol className="mt-4 space-y-2 text-gray-700">
                  <li>1. Click &quot;Install app&quot; at the top right</li>
                  <li>2. Go to the &quot;API credentials&quot; tab</li>
                  <li>3. Click &quot;Reveal token once&quot;</li>
                </ol>

                <div className="mt-4 rounded-lg bg-red-50 p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                    <p className="text-sm text-red-900">
                      <strong>Important:</strong> Shopify only shows this token ONCE. Copy it immediately!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-600">
                4
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  Paste Credentials to Glow
                </h2>
                <p className="mt-2 text-gray-600">
                  Paste the token and your store URL below to activate the connection
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="shopDomain">
                      Shopify Domain <span className="text-gray-400 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="shopDomain"
                      placeholder="your-store.myshopify.com (optional)"
                      value={formData.shopDomain}
                      onChange={(e) =>
                        setFormData({ ...formData, shopDomain: e.target.value })
                      }
                      className="mt-2"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Optional: Your Shopify store domain for reference
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="clientId">
                      Client ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="clientId"
                      placeholder="Enter your Shopify App Client ID"
                      value={formData.clientId}
                      onChange={(e) =>
                        setFormData({ ...formData, clientId: e.target.value })
                      }
                      className="mt-2"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Found in your Shopify App settings under &quot;Client credentials&quot;
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="clientSecret">
                      Client Secret <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="clientSecret"
                      type="password"
                      placeholder="Enter your Shopify App Client Secret"
                      value={formData.clientSecret}
                      onChange={(e) =>
                        setFormData({ ...formData, clientSecret: e.target.value })
                      }
                      className="mt-2"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Found in your Shopify App settings under &quot;Client credentials&quot;
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="accessToken">
                      Admin API Access Token <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="accessToken"
                      type="password"
                      placeholder="shpat_xxxxxxxxxxxxxxxxxxxxx"
                      value={formData.accessToken}
                      onChange={(e) =>
                        setFormData({ ...formData, accessToken: e.target.value })
                      }
                      className="mt-2"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Click &quot;Reveal token once&quot; in the API credentials tab
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="webhookSecret">
                      Webhooks Secret <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="webhookSecret"
                      type="password"
                      placeholder="Enter your Shopify Webhooks Secret"
                      value={formData.webhookSecret}
                      onChange={(e) =>
                        setFormData({ ...formData, webhookSecret: e.target.value })
                      }
                      className="mt-2"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Used to verify webhook authenticity from Shopify
                    </p>
                  </div>

                  <Button
                    onClick={handleVerify}
                    disabled={verifying || !formData.clientId || !formData.clientSecret || !formData.accessToken || !formData.webhookSecret}
                    className="w-full"
                    size="lg"
                  >
                    {verifying ? 'Verifying...' : '🔘 Verify & Launch My Loyalty Program'}
                  </Button>
                </div>

                {permissions.length > 0 && (
                  <div className="mt-6 rounded-lg bg-green-50 p-4">
                    <p className="text-sm font-semibold text-green-900">
                      ✅ Permissions detected:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-green-800">
                      {permissions.map((scope) => (
                        <li key={scope}>• {scope}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-lg bg-gray-50 p-6 text-center">
          <Shield className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-4 text-sm text-gray-600">
            Glow uses bank-level encryption. Your Access Token is encrypted in our Neon database
            and is never visible to anyone.
          </p>
        </div>
      </div>
    </div>
  );
}
