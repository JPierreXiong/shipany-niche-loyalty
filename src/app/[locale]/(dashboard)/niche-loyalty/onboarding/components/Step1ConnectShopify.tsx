/**
 * Step 1: Connect Shopify
 * OAuth flow to connect Shopify store
 */

'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Store, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Step1Props {
  onComplete: (data: any) => void;
  onSkip: () => void;
  data: any;
}

export function Step1ConnectShopify({ onComplete, onSkip, data }: Step1Props) {
  const [loading, setLoading] = useState(false);
  const [shopDomain, setShopDomain] = useState('');

  async function handleConnect() {
    if (!shopDomain) {
      toast.error('Please enter your Shopify store domain');
      return;
    }

    setLoading(true);
    try {
      // Redirect to Shopify OAuth
      const response = await fetch('/api/niche-loyalty/shopify/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopDomain }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.data.authUrl;
      } else {
        toast.error('Failed to connect to Shopify');
        setLoading(false);
      }
    } catch (error) {
      toast.error('An error occurred');
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg bg-white p-8 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-blue-100 p-4">
          <Store className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Connect Your Shopify Store
          </h2>
          <p className="mt-1 text-gray-600">
            Link your store to sync customers automatically
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <Label htmlFor="shopDomain">Shopify Store Domain</Label>
          <div className="mt-2 flex gap-2">
            <Input
              id="shopDomain"
              value={shopDomain}
              onChange={(e) => setShopDomain(e.target.value)}
              placeholder="your-store"
              className="flex-1"
            />
            <span className="flex items-center text-gray-500">
              .myshopify.com
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Enter your Shopify store name (e.g., &quot;my-awesome-store&quot;)
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="font-medium text-blue-900">What happens next?</h3>
          <ul className="mt-2 space-y-1 text-sm text-blue-800">
            <li>• You&apos;ll be redirected to Shopify to authorize access</li>
            <li>• We&apos;ll sync your customer list automatically</li>
            <li>• Webhooks will be set up for real-time updates</li>
          </ul>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onSkip}>
            Skip for now
          </Button>
          <Button onClick={handleConnect} disabled={loading || !shopDomain}>
            {loading ? 'Connecting...' : 'Connect Shopify'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}


