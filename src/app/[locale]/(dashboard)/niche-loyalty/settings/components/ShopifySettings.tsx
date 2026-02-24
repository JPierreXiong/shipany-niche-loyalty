/**
 * Shopify Settings Component
 * Manage Shopify store connection
 */

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { CheckCircle, XCircle, RefreshCw, Eye, EyeOff, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Store {
  connected: boolean;
  store: {
    shopifyDomain: string;
    shopifyClientId?: string;
    status: string;
  } | null;
}

export function ShopifySettings() {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  
  // Credentials form state
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchStore();
  }, []);

  async function fetchStore() {
    try {
      const response = await fetch('/api/niche-loyalty/store/get');
      if (response.ok) {
        const data = await response.json();
        setStore(data.data);
        // Load existing credentials if available
        if (data.data?.store?.shopifyClientId) {
          setClientId(data.data.store.shopifyClientId);
        }
      }
    } catch (error) {
      console.error('Failed to fetch store:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveCredentials() {
    if (!clientId.trim() || !clientSecret.trim()) {
      toast.error('Please fill in both Client ID and Client Secret');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/niche-loyalty/shopify/update-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: clientId.trim(),
          clientSecret: clientSecret.trim(),
        }),
      });

      if (response.ok) {
        toast.success('Shopify credentials updated successfully');
        setIsEditing(false);
        setClientSecret(''); // Clear secret after saving
        await fetchStore(); // Refresh store data
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update credentials');
      }
    } catch (error) {
      toast.error('An error occurred while saving credentials');
      console.error('Save credentials error:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleConnect() {
    toast.info('Redirecting to Shopify...');
    // TODO: Implement Shopify OAuth flow
    window.location.href = '/api/niche-loyalty/shopify/auth';
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const response = await fetch('/api/niche-loyalty/members/sync', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Synced ${data.data.synced} customers from Shopify`);
      } else {
        toast.error('Failed to sync customers');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setSyncing(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 rounded-lg bg-white p-6 shadow">
        <div className="h-6 w-48 rounded bg-gray-200"></div>
        <div className="h-4 w-full rounded bg-gray-200"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">
          Shopify Connection
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Manage your Shopify store connection
        </p>

        <div className="mt-6 space-y-4">
          {store?.connected ? (
            <>
              <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-900">Connected</p>
                  <p className="text-sm text-green-700">
                    {store.store?.shopifyDomain}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSync} disabled={syncing}>
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`}
                  />
                  {syncing ? 'Syncing...' : 'Sync Customers Now'}
                </Button>
                <Button variant="outline" onClick={() => toast.info('Coming soon')}>
                  Disconnect
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <XCircle className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Not Connected</p>
                  <p className="text-sm text-gray-600">
                    Connect your Shopify store to sync customers automatically
                  </p>
                </div>
              </div>

              <Button onClick={handleConnect}>Connect Shopify</Button>
            </>
          )}
        </div>
      </div>

      {/* API Credentials */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              API Credentials
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Configure your Shopify App Client ID and Client Secret for OAuth authentication
            </p>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Client ID</Label>
            <Input
              id="clientId"
              type="text"
              placeholder="Enter your Shopify App Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              disabled={!isEditing}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Found in your Shopify App settings under "API credentials"
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientSecret">Client Secret</Label>
            <div className="relative">
              <Input
                id="clientSecret"
                type={showSecret ? 'text' : 'password'}
                placeholder={isEditing ? 'Enter your Shopify App Client Secret' : '••••••••••••••••'}
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                disabled={!isEditing}
                className="pr-10 font-mono text-sm"
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecret ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Keep this secret secure. It will be encrypted before storage.
            </p>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSaveCredentials}
                disabled={saving}
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Credentials'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setClientSecret('');
                  fetchStore(); // Reset to original values
                }}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          )}

          {!isEditing && store?.store?.shopifyClientId && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                ✓ Credentials configured. Click "Edit" to update.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}











