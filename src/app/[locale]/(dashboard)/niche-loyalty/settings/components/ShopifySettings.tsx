/**
 * Shopify Settings Component
 * Manage Shopify store connection
 */

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Store {
  connected: boolean;
  store: {
    shopifyDomain: string;
    status: string;
  } | null;
}

export function ShopifySettings() {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchStore();
  }, []);

  async function fetchStore() {
    try {
      const response = await fetch('/api/niche-loyalty/store/get');
      if (response.ok) {
        const data = await response.json();
        setStore(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch store:', error);
    } finally {
      setLoading(false);
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
  );
}




