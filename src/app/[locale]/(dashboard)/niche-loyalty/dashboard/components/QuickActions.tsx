/**
 * Quick Actions Component
 * Provides quick access to common tasks
 */

'use client';

import { Mail, Upload, Plus, Store } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreateCampaignDialog } from './CreateCampaignDialog';
import { ImportMembersDialog } from './ImportMembersDialog';
import { CreateCardDialog } from './CreateCardDialog';

export function QuickActions() {
  const router = useRouter();
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [hasConnectedStore, setHasConnectedStore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has connected a Shopify store
    async function checkStoreConnection() {
      try {
        const response = await fetch('/api/niche-loyalty/shopify/check-connection');
        if (response.ok) {
          const data = await response.json();
          setHasConnectedStore(data.data?.connected || false);
        }
      } catch (error) {
        console.error('Failed to check store connection', error);
      } finally {
        setLoading(false);
      }
    }
    checkStoreConnection();
  }, []);

  return (
    <>
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        
        {/* Show Connect Store banner if not connected */}
        {!loading && !hasConnectedStore && (
          <div className="mt-4 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Store className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Connect Your Shopify Store
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Start sending loyalty cards automatically after each purchase. Setup takes only 2 minutes.
                </p>
                <button
                  onClick={() => router.push('/niche-loyalty/connect-store')}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <Store className="h-4 w-4" />
                  Connect Store Now
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button
            onClick={() => setCampaignOpen(true)}
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <div className="rounded-full bg-blue-50 p-2">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">Send Campaign</span>
          </button>

          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <div className="rounded-full bg-green-50 p-2">
              <Upload className="h-5 w-5 text-green-600" />
            </div>
            <span className="font-medium text-gray-900">Import Members</span>
          </button>

          <button
            onClick={() => setCardOpen(true)}
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <div className="rounded-full bg-purple-50 p-2">
              <Plus className="h-5 w-5 text-purple-600" />
            </div>
            <span className="font-medium text-gray-900">Create Card</span>
          </button>
        </div>
      </div>

      <CreateCampaignDialog open={campaignOpen} onOpenChange={setCampaignOpen} />
      <ImportMembersDialog open={importOpen} onOpenChange={setImportOpen} />
      <CreateCardDialog open={cardOpen} onOpenChange={setCardOpen} />
    </>
  );
}


